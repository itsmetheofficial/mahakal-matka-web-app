import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Repository from '../repository/Repository';

const WebPushContext = createContext({ status: 'loading', enable: async () => {}, refresh: () => {} });
let sdkPromise;

const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const isInstalled = () => window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;

function getSdk(appId) {
  if (!sdkPromise) {
    sdkPromise = new Promise((resolve, reject) => {
      const timeout = window.setTimeout(() => {
        sdkPromise = null;
        reject(new Error('OneSignal SDK did not load'));
      }, 12000);
      window.OneSignalDeferred = window.OneSignalDeferred || [];
      window.OneSignalDeferred.push(async (sdk) => {
        try {
          await sdk.init({
            appId,
            serviceWorkerPath: 'onesignal/OneSignalSDKWorker.js',
            serviceWorkerParam: { scope: '/onesignal/' },
            promptOptions: { slidedown: { prompts: [{ type: 'push', autoPrompt: false }] } },
            welcomeNotification: { disable: true },
          });
          window.clearTimeout(timeout);
          resolve(sdk);
        } catch (error) {
          window.clearTimeout(timeout);
          sdkPromise = null;
          reject(error);
        }
      });
    });
  }
  return sdkPromise;
}

export function WebPushProvider({ children }) {
  const { appData, user } = useSelector((state) => state.appData.appData);
  const [status, setStatus] = useState('loading');
  const sdkRef = useRef(null);
  const appId = appData?.onesignal_app_id;
  const userId = user?.id;
  const userFcm = user?.fcm;

  useEffect(() => {
    if (!appId || !userId || userFcm || window.AndroidApp || !localStorage.getItem('authToken')) {
      setStatus('unavailable');
      return;
    }
    if (isIOS() && !isInstalled()) {
      setStatus('install');
      return;
    }
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      setStatus('unsupported');
      return;
    }

    let active = true;
    let currentSdk;
    const update = async () => {
      if (!active || !currentSdk) return;
      const supported = await currentSdk.Notifications.isPushSupported();
      if (!active) return;
      if (!supported) { setStatus('unsupported'); return; }
      const permission = Notification.permission;
      const subscription = currentSdk.User.PushSubscription;
      const enabled = permission === 'granted' && subscription.optedIn;
      setStatus(permission === 'denied' ? 'blocked' : enabled ? 'enabled' : 'off');
      if (subscription.id && localStorage.getItem('authToken')) {
        try {
          await Repository.put('/web-push-subscription', {
            subscription_id: subscription.id,
            enabled,
          }, { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } });
          localStorage.setItem('webPushSubscriptionId', subscription.id);
        } catch (error) {
          console.error('Could not save web push subscription', error);
        }
      }
    };
    getSdk(appId).then((instance) => {
      if (!active) return;
      currentSdk = instance;
      sdkRef.current = instance;
      instance.Notifications.addEventListener('permissionChange', update);
      instance.User.PushSubscription.addEventListener('change', update);
      window.addEventListener('focus', update);
      document.addEventListener('visibilitychange', update);
      update();
    }).catch((error) => {
      console.error('OneSignal initialization failed', error);
      if (active) setStatus('error');
    });
    return () => {
      active = false;
      if (currentSdk) {
        currentSdk.Notifications.removeEventListener('permissionChange', update);
        currentSdk.User.PushSubscription.removeEventListener('change', update);
      }
      window.removeEventListener('focus', update);
      document.removeEventListener('visibilitychange', update);
    };
  }, [appId, userId, userFcm]);

  const enable = async () => {
    if (!sdkRef.current) return;
    if (Notification.permission === 'denied') { setStatus('blocked'); return; }
    try {
      await sdkRef.current.Notifications.requestPermission();
      if (Notification.permission === 'granted') await sdkRef.current.User.PushSubscription.optIn();
      setStatus(Notification.permission === 'granted' ? 'enabled' : 'off');
    } catch (error) {
      console.error('Could not enable notifications', error);
      setStatus('error');
    }
  };

  return <WebPushContext.Provider value={{ status, enable }}>{children}</WebPushContext.Provider>;
}

export const useWebPush = () => useContext(WebPushContext);
