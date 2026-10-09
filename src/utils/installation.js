export const isPwaInstallation = appData => appData?.installation_method === 'pwa';

export const isIOS = () => /iPad|iPhone|iPod/i.test(navigator.userAgent) ||
    (/Macintosh/i.test(navigator.userAgent) && navigator.maxTouchPoints > 1);

export const isIOSChrome = () => /CriOS/i.test(navigator.userAgent);

export const isPwaInstalled = () =>
    window.matchMedia('(display-mode: standalone)').matches ||
    navigator.standalone === true ||
    (!isIOS() && localStorage.getItem('mahakalPwaInstalled') === 'true');

export const markPwaInstalled = () => {
    localStorage.setItem('mahakalPwaInstalled', 'true');
    window.dispatchEvent(new Event('mahakal-pwa-installed'));
};

export const installationLink = appData =>
    isPwaInstallation(appData) ? appData?.pwa_web_link : appData?.app_update_link;

export const installationLabel = appData =>
    isPwaInstallation(appData) ? 'Install Now' : 'Download APK';

export const openPwaInstallation = async (link, deferredPrompt, setDeferredPrompt) => {
    const destination = new URL(link, window.location.href);
    const current = new URL(window.location.href);
    if (deferredPrompt && destination.origin === current.origin && destination.pathname === current.pathname) {
        await deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        setDeferredPrompt(null);
        return;
    }
    window.location.assign(destination.href);
};
