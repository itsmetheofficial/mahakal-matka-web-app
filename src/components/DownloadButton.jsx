import React, { useState } from 'react';
import { FaDownload } from 'react-icons/fa';
import { useDownload } from '../hooks/useDownload';
import { useSelector } from 'react-redux';
import { openPwaInstallation } from '../utils/installation';
import useInstallationOffer from '../hooks/useInstallationOffer';
import IOSInstallDialog from './IOSInstallDialog';

const DownloadButton = ({
    variant = 'default',
    className = '',
    onDownloadComplete = null,
    showText = true,
    size = 'medium'
}) => {
    const { appData } = useSelector((state) => state.appData.appData);
    const { downloadProgress, isDownloading, downloadError, downloadFile } = useDownload();
    const { method, link, isIOS, deferredPrompt, setDeferredPrompt } = useInstallationOffer(appData);
    const [showIOSInstructions, setShowIOSInstructions] = useState(false);

    const handleDownloadClick = async () => {
        if (link) {
            if (method === 'pwa') {
                if (isIOS) {
                    setShowIOSInstructions(true);
                    return;
                }
                await openPwaInstallation(link, deferredPrompt, setDeferredPrompt);
                return;
            }
            const result = await downloadFile(link, 'MahakalMatka.apk');

            if (result.success && onDownloadComplete) {
                onDownloadComplete();
            }
        }
    };

    // Size configurations
    const sizeConfig = {
        small: {
            padding: '4px 6px',
            gap: '6px',
            fontSize: '12px',
            iconSize: 'w-3 h-3'
        },
        medium: {
            padding: '5px 8px',
            gap: '10px',
            fontSize: '14px',
            iconSize: 'w-4 h-4'
        },
        large: {
            padding: '8px 12px',
            gap: '12px',
            fontSize: '16px',
            iconSize: 'w-5 h-5'
        }
    };

    const config = sizeConfig[size];

    // Variant styles
    const getVariantStyles = () => {
        const baseStyles = {
            display: "flex",
            alignItems: "center",
            gap: config.gap,
            padding: config.padding,
            borderRadius: "4px",
            fontWeight: "600",
            position: "relative",
            overflow: "hidden",
            cursor: isDownloading ? "not-allowed" : "pointer",
            opacity: isDownloading ? 0.8 : 1,
            fontSize: config.fontSize,
            border: "none",
            transition: "all 0.3s ease"
        };

        switch (variant) {
            case 'floating':
                return {
                    ...baseStyles,
                    background: downloadError
                        ? "#ff4444"
                        : isDownloading
                            ? `linear-gradient(to right, #0098c7 ${downloadProgress}%, transparent ${downloadProgress}%)`
                            : "transparent",
                    border: downloadError ? "1px solid #ff4444" : "1px solid #0098c7",
                    color: downloadError ? "#fff" : "#0098c7",
                };
            case 'sidebar':
                return {
                    ...baseStyles,
                    background: downloadError
                        ? "#ff4444"
                        : isDownloading
                            ? `linear-gradient(to right, #22c55e ${downloadProgress}%, rgba(34, 197, 94, 0.2) ${downloadProgress}%)`
                            : "#22c55e",
                    color: "#fff",
                    width: "100%",
                    justifyContent: "center",
                    borderRadius: "6px",
                };
            default:
                return {
                    ...baseStyles,
                    background: downloadError
                        ? "#ff4444"
                        : isDownloading
                            ? `linear-gradient(to right, #0098c7 ${downloadProgress}%, rgba(0, 152, 199, 0.2) ${downloadProgress}%)`
                            : "#0098c7",
                    color: "#fff",
                };
        }
    };

    const buttonText = () => {
        if (downloadError) return "Error";
        if (isDownloading) return `${downloadProgress}%`;
        return method === 'pwa' ? 'Install Now' : 'Download APK';
    };

    if (!link) return null;

    return <>
        <button
            onClick={handleDownloadClick}
            disabled={isDownloading || !link}
            style={getVariantStyles()}
            className={className}
        >
            <FaDownload className={config.iconSize} />
            {showText && buttonText()}
        </button>
        <IOSInstallDialog isOpen={showIOSInstructions} onClose={() => setShowIOSInstructions(false)} />
    </>;
};

export default DownloadButton;
