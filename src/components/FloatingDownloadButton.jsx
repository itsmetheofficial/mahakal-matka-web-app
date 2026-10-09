import React, { useEffect } from 'react';
import { FaDownload } from 'react-icons/fa';
import { useDownload } from '../hooks/useDownload';
import { useSelector } from 'react-redux';
import { openPwaInstallation } from '../utils/installation';
import useInstallationOffer from '../hooks/useInstallationOffer';

const FloatingDownloadButton = ({
    onDownloadComplete = null,
    onErrorChange = null,
    onDownloadingChange = null
}) => {
    const { appData } = useSelector((state) => state.appData.appData);
    const { downloadProgress, isDownloading, downloadError, downloadFile } = useDownload();
    const { method, link, deferredPrompt, setDeferredPrompt } = useInstallationOffer(appData);

    // Detect Android WebView via the JS bridge your WebView exposes
    const isInAndroidApp =
        typeof window !== 'undefined' && typeof window.AndroidApp !== 'undefined';

    // Communicate state changes to parent
    useEffect(() => {
        if (onErrorChange) {
            onErrorChange(downloadError);
        }
    }, [downloadError, onErrorChange]);

    useEffect(() => {
        if (onDownloadingChange) {
            onDownloadingChange(isDownloading);
        }
    }, [isDownloading, onDownloadingChange]);

    const handleDownloadClick = async () => {
        if (link) {
            if (method === 'pwa') {
                await openPwaInstallation(link, deferredPrompt, setDeferredPrompt);
                return;
            }
            const result = await downloadFile(link, 'MahakalMatka.apk');

            if (result.success && onDownloadComplete) {
                onDownloadComplete();
            }
        }
    };

    const buttonText = () => {
        if (downloadError) return "Error";
        if (isDownloading) return `${downloadProgress}%`;
        return method === 'pwa' ? 'Install Now' : 'Download APK';
    };

    // Don't render the button if running inside Android app
    if (isInAndroidApp || !link) {
        return null;
    }

    return (
        <button
            onClick={handleDownloadClick}
            disabled={isDownloading}
            style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "5px 8px",
                borderRadius: "4px",
                background: downloadError
                    ? "#ff4444"
                    : isDownloading
                        ? `linear-gradient(to right, #0098c7 ${downloadProgress}%, transparent ${downloadProgress}%)`
                        : "transparent",
                border: downloadError ? "1px solid #ff4444" : "1px solid #0098c7",
                fontWeight: "600",
                color: downloadError ? "#fff" : "#0098c7",
                position: "relative",
                overflow: "hidden",
                cursor: isDownloading ? "not-allowed" : "pointer",
                opacity: isDownloading ? 0.8 : 1,
            }}
        >
            <FaDownload className="w-4 h-4" />
            {buttonText()}
        </button>
    );
};

export default FloatingDownloadButton;
