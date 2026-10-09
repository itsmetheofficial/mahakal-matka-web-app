import { useContext, useEffect, useState } from 'react';
import { DeferredPromptContext } from '../context/DeferredPromptContext';
import { isIOS, isPwaInstalled, markPwaInstalled } from '../utils/installation';

const isAndroid = () => /Android/i.test(navigator.userAgent);

export default function useInstallationOffer(appData) {
    const { deferredPrompt, setDeferredPrompt } = useContext(DeferredPromptContext);
    const [fallbackReady, setFallbackReady] = useState(false);
    const [installedNow, setInstalledNow] = useState(isPwaInstalled);

    useEffect(() => {
        const onInstalled = () => {
            if (!isIOS()) markPwaInstalled();
        };
        const onMarkedInstalled = () => {
            if (!isIOS()) setInstalledNow(true);
        };
        const onStorage = event => {
            if (event.key === 'mahakalPwaInstalled') setInstalledNow(isPwaInstalled());
        };
        window.addEventListener('appinstalled', onInstalled);
        window.addEventListener('mahakal-pwa-installed', onMarkedInstalled);
        window.addEventListener('storage', onStorage);
        return () => {
            window.removeEventListener('appinstalled', onInstalled);
            window.removeEventListener('mahakal-pwa-installed', onMarkedInstalled);
            window.removeEventListener('storage', onStorage);
        };
    }, []);

    useEffect(() => {
        setFallbackReady(false);
        if (appData?.installation_method !== 'pwa' || deferredPrompt) return;
        const timer = window.setTimeout(() => setFallbackReady(true), 3000);
        return () => window.clearTimeout(timer);
    }, [appData?.installation_method, deferredPrompt]);

    if (installedNow || typeof window.AndroidApp !== 'undefined') {
        return { method: null, link: null, deferredPrompt, setDeferredPrompt };
    }

    if (appData?.installation_method === 'pwa') {
        if (isIOS() && appData?.pwa_web_link) {
            return { method: 'pwa', link: appData.pwa_web_link, isIOS: true, deferredPrompt, setDeferredPrompt };
        }
        if (deferredPrompt && appData?.pwa_web_link) {
            return { method: 'pwa', link: appData.pwa_web_link, deferredPrompt, setDeferredPrompt };
        }
        if (fallbackReady && isAndroid() && appData?.app_update_link) {
            return { method: 'app', link: appData.app_update_link, deferredPrompt, setDeferredPrompt };
        }
        return { method: null, link: null, deferredPrompt, setDeferredPrompt };
    }

    if (isIOS()) return { method: null, link: null, deferredPrompt, setDeferredPrompt };

    if (appData?.app_update_link) {
        return { method: 'app', link: appData.app_update_link, deferredPrompt, setDeferredPrompt };
    }
    return { method: null, link: null, deferredPrompt, setDeferredPrompt };
}
