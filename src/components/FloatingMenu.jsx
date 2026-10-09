import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Auth from "../layouts/Auth";
import "./styles.css";
import { FaCross } from "react-icons/fa";
import { useSelector } from "react-redux";
import useInstallationOffer from "../hooks/useInstallationOffer";
import { isIOS } from "../utils/installation";
import Modal from "./Modal";
import FloatingDownloadButton from "./FloatingDownloadButton";

const FloatingMenu = () => {
    const navigate = useNavigate();
    let location = useLocation();
    const token = localStorage.getItem("authToken"); // Check if the user is authenticated
    const [authModalOpen, setAuthModalOpen] = useState(false); // State to control modal
    const { appData } = useSelector((state) => state.appData.appData);
    const installationOffer = useInstallationOffer(appData);
    const [openDownloadBar, setOpenDownloadBar] = useState(false);
    const [openLoginModal, setOpenLoginModal] = useState(false);
    const [downloadError, setDownloadError] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);


    useEffect(() => {
        setOpenDownloadBar(localStorage.getItem("isModelOpenedAlready") === "true" ? false : true);
    }, []);

    const handleDownloadComplete = () => {
        handleCloseDownloadBar();
    };

    let items = [
        {
            text: "Home",
            link: "/",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                    />
                </svg>
            ),
        },
        {
            text: "History",
            link: "/history",
            icon: (
                <img
                    src={require("../assets/imgs/game.png")}
                    alt="History"
                    className="w-6 h-6"
                />
            ),
        },
        {
            text: "Wallet",
            link: "/wallet",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3"
                    />
                </svg>
            ),
        },
        {
            text: "Help",
            link: "/help",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                    />
                </svg>
            ),
        },
    ];
    const handleLinkClick = (e, link) => {
        // If user is not authenticated and link is not Home, prevent navigation and open modal
        if (!token && link !== "/") {
            e.preventDefault();
            localStorage.setItem("authMenu", 1); // Set authMenu to 1 when the modal opens
            setAuthModalOpen(true);
            setOpenLoginModal(true)
        }
    };

    const toggleAuthModal = () => {
        if (authModalOpen) {
            localStorage.setItem("authMenu", 0); // Set authMenu to 0 when the modal closes
        } else {
            localStorage.setItem("authMenu", 1); // Set authMenu to 1 when the modal opens
        }
        setAuthModalOpen(!authModalOpen); // Toggle modal state
    };

    const handleCloseDownloadBar = () => {
        setOpenDownloadBar(false)
        localStorage.setItem(
            'isModelOpenedAlready',
            JSON.stringify(true)
        );
    }

    return (
        <>
            {openDownloadBar && !isIOS() && installationOffer.link ? (
                <div className="floating-webAppNotification floating-menu">
                    <div className="fwnLeft">
                        <FloatingDownloadButton
                                onDownloadComplete={handleDownloadComplete}
                                onErrorChange={setDownloadError}
                                onDownloadingChange={setIsDownloading}
                            />
                    </div>
                    <div className="flex items-center gap-4 pl-2">
                        <p className="text-sm text-center" style={{ color: downloadError ? "#ff4444" : "inherit" }}>
                            {downloadError || (installationOffer.method === 'pwa' ? "Install the web app now!" : "Download the APK now!")}
                        </p>
                        <button
                            onClick={handleCloseDownloadBar}
                            disabled={isDownloading}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "20px",
                                background: isDownloading ? "#ccc" : "red",
                                fontWeight: "600",
                                padding: "3px",
                                width: "25px",
                                height: "25px",
                                cursor: isDownloading ? "not-allowed" : "pointer",
                                opacity: isDownloading ? 0.5 : 1,
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="#fff"
                                className="w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18 18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            ) : null}
            <div className="floating-menu">
                {items.map((item, idx) => (
                    <Link
                        to={item.link} // All links remain clickable
                        key={`FloatingMenuItem${idx}`}
                        className={`flex w-11 h-11 flex-col items-center rounded-md py-0.5 px-1 ${location.pathname === item.link && (token || item.link === "/")
                            ? "bg-primary/50"
                            : ""
                            }`}
                        onClick={(e) => handleLinkClick(e, item.link)}
                    >
                        {item.icon}
                        <span className="mt-auto text-xs font-bold">{item.text}</span>
                    </Link>
                ))}
            </div>

            {/* Render the Main component for the modal */}
            {authModalOpen && (
                <Auth
                    isOpen={authModalOpen}
                    toggle={toggleAuthModal} // Toggle modal using the new function
                />

            )}
            <Modal
                isOpen={openLoginModal}
                toggle={() => setOpenLoginModal(false)}
                className="custom-modal"
                centered
            >
                <div className="font-semibold text-white bg-primary " style={{ width: "400px", maxWidth: "90vw" }}>
                    <div className="flex justify-between p-3 border-b border-white">
                        <h4>Need Login</h4>
                        <button onClick={() => setOpenLoginModal(false)}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex flex-col items-center gap-4 pt-4 pb-8">
                        <div className="text-md">
                            To use this feature, you need to login
                        </div>
                        <button className="p-2 px-8 text-md text-white rounded-md bg-green-600 " onClick={(() => navigate("/auth/login"))}>
                            Login
                        </button>
                    </div>
                </div>
            </Modal>

        </>
    );
};

export default FloatingMenu;
