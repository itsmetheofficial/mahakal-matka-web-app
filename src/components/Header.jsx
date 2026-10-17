import { walletAmounts, money } from '../utils/wallet';
import React, { useEffect, useState } from "react";
import Container from "./Container";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { routes } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { getAppData } from "../repository/DataRepository";
import Modal from "./Modal";
import moment from "moment";
import { setAppData, setLastReadNotificationId } from "../store/features/appData/appDataSlice";
import { getUserBalance } from "../repository/BalanceRepository";
import { useShowEverything } from "../credentials";
import Pusher from "pusher-js";
import WebPushNotice from './WebPushNotice';
import NotificationImage from './NotificationImage';
import { useWebPush } from '../context/WebPushContext';

// Function to convert URLs in text to clickable links while preserving line breaks
const linkifyText = (text) => {
    if (!text) return null;

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
        if (part.match(urlRegex)) {
            return (
                <a
                    key={index}
                    href={part}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800 break-all"
                    onClick={(e) => e.stopPropagation()}
                >
                    {part}
                </a>
            );
        }
        // Split by newlines and map to preserve line breaks
        const lines = part.split('\n');
        return lines.map((line, lineIndex) => (
            <React.Fragment key={`${index}-${lineIndex}`}>
                {line}
                {lineIndex < lines.length - 1 && '\n'}
            </React.Fragment>
        ));
    });
};

const Header = ({ toggleSideBar }) => {
    const navigate = useNavigate();
    const { status: pushStatus } = useWebPush();
    let location = useLocation();
    const dispatch = useDispatch();
    let { appData: initialAppData, lastReadNotificationId, status } = useSelector(
        (state) => state.appData
    );
    let { user, appData } = initialAppData;
    const latestNotificationId = Number(appData?.last_notification?.id) || 0;
    const unreadNotificationCount = latestNotificationId <= lastReadNotificationId
        ? 0
        : Math.max(0, Number(appData?.unread_notification_count) || 0);
    const [openNotificationModal, setOpenNotificationModal] = useState(false);
    const [openLoginModal, setOpenLoginModal] = useState(false);
    const [refreshBalanceLoading, setRefreshBalanceLoading] = useState(false);

    useEffect(() => {
        if (unreadNotificationCount > 0) {
            setOpenNotificationModal(true);
        }
    }, [latestNotificationId, unreadNotificationCount])

    useEffect(() => {
        if (!appData?.pusher_key || !appData?.pusher_cluster) return;

        const pusher = new Pusher(appData.pusher_key, { cluster: appData.pusher_cluster });
        const channel = pusher.subscribe('user-notifications');
        let active = true;
        let requestId = 0;

        channel.bind('notification.changed', async ({ notification_id, action }) => {
            if (action === 'sent' && Number(notification_id) <= Number(localStorage.getItem('lastReadNotificationId') || 0)) return;

            const currentRequestId = ++requestId;
            try {
                const response = await getAppData();
                if (active && currentRequestId === requestId && response?.data?.error === false) {
                    dispatch(setAppData(response.data.response));
                }
            } catch (error) {
                console.error('Could not refresh notifications', error);
            }
        });

        return () => {
            active = false;
            channel.unbind('notification.changed');
            pusher.unsubscribe('user-notifications');
            pusher.disconnect();
        };
    }, [appData?.pusher_key, appData?.pusher_cluster, dispatch]);

    useEffect(() => {
        if (location.pathname === "/wallet") {
            refreshBalance();
        }
    }, [location])

    const getCurrentRouteHeading = () => {
        const currentRoute = routes.flatMap(route => route.children || [route]).find(
            (child) => child.path === location.pathname
        );
        return currentRoute?.name || "Unknown Route";
    };

    const handleSideBarToggle = () => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            window.dispatchEvent(new Event("triggerAuthModal"));
            setOpenLoginModal(true);
        } else {
            toggleSideBar();
        }
    };

    const handleCloseNotificationModal = (e) => {
        // Prevent event from bubbling to parent modals
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setOpenNotificationModal(false)
        dispatch(setLastReadNotificationId(latestNotificationId));
        localStorage.setItem("lastReadNotificationId", String(latestNotificationId));
    }

    const refreshBalance = async () => {
        setRefreshBalanceLoading(true);
        let userBalance = await getUserBalance();
        if (userBalance?.data?.error === false) {
            dispatch(setAppData(
                {
                    appData: initialAppData?.appData,
                    user: {
                        ...initialAppData?.user,
                        ...userBalance?.data?.response,
                    }
                }));
        }

        setRefreshBalanceLoading(false);
    }

    const storedUser = JSON.parse(localStorage.getItem("authUser")) || {};

    const currentUser = user?.phone ? user : storedUser;

    const isAuthenticated = Boolean(localStorage.getItem("authToken"));
    const { showEverything } = useShowEverything();
    let showResultsOnly = !showEverything;

    return (
        <>
            <div className="text-white bg-primary">
                <Container>
                    <div className="flex items-center">
                        <div className="flex items-center">
                            {
                                !showResultsOnly ?
                                    <button
                                        onClick={handleSideBarToggle}
                                        className="relative flex items-center justify-center"
                                    >
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
                                                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                            />
                                        </svg>
                                    </button>
                                    : null
                            }
                            <span className="ml-2 font-semibold">
                                {getCurrentRouteHeading()}
                            </span>
                        </div>
                        {
                            !showResultsOnly ?
                                <div className="flex items-center ml-auto">
                                    {isAuthenticated && currentUser && (
                                        <>
                                            <span className="mr-2 text-xs flex flex-col items-center font-normal">
                                                <strong>₹{money(walletAmounts(initialAppData?.user).total)}</strong>
                                                <span>Balance</span>

                                            </span>
                                            <button
                                                onClick={isAuthenticated ? () => refreshBalance() : null}
                                                className={`${refreshBalanceLoading ? "rotateIcon" : ""} flex items-center justify-center px-1 py-1 text-xs text-white bg-orange-300 rounded-full shadow-md bg-transparent border border-white`}
                                                disabled={!isAuthenticated} // Only disable interaction, not styling
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.5"
                                                    stroke="currentColor"
                                                    className="w-4 h-4"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                                                    />
                                                </svg>
                                            </button>
                                        </>
                                    )}

                                    <button
                                        className="relative ml-2"
                                        aria-label="Notifications"
                                        title={pushStatus === 'enabled' ? 'Notifications enabled' : 'Notification settings'}
                                        // to={isAuthenticated ? "/notifications" : "#"} // Prevent click if not authenticated
                                        onClick={
                                            isAuthenticated
                                                ? () => navigate("/notifications")
                                                : () => setOpenLoginModal(true)
                                        }
                                        style={{
                                            // pointerEvents: isAuthenticated ? "auto" : "none", // Disable interaction
                                        }}
                                    >
                                        {isAuthenticated && !['enabled', 'loading', 'unavailable'].includes(pushStatus) && (
                                            <span className="absolute -bottom-1 -left-1 h-2 w-2 rounded-full bg-amber-300 ring-1 ring-white" aria-label="Notification setup needed" />
                                        )}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="2"
                                            stroke="currentColor"
                                            className="w-6 h-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                                            />
                                        </svg>
                                        {(unreadNotificationCount > 0 && isAuthenticated) && (
                                            <div
                                                id="notificationCounter"
                                                className="absolute w-4 h-4 rounded-full -top-1.5 -right-1.5 bg-orange flex text-[7px] items-center justify-center"
                                            >
                                                {unreadNotificationCount}
                                            </div>
                                        )}
                                    </button>
                                </div>
                                : null
                        }
                    </div>
                </Container>
            </div>
            {
                (openNotificationModal && localStorage.getItem('authToken')) ?
                    <Modal
                        isOpen={openNotificationModal}
                        panelClassName="sm:max-w-none"
                        containerClassName={appData?.last_notification?.image_url ? "p-2" : undefined}
                        toggle={handleCloseNotificationModal}
                        zIndex={40}
                        closeOnBackdrop={false}
                        className="custom-modal"
                        centered
                    >
                        <div className="overflow-hidden rounded-xl font-semibold text-white bg-white" style={{ width: appData?.last_notification?.image_url ? "760px" : "400px", maxWidth: appData?.last_notification?.image_url ? "calc(100vw - 16px)" : "90vw" }}>
                            <div className="flex justify-between p-3 border-b bg-primary border-white">
                                <h4 className="min-w-0 break-words pr-3">{appData?.last_notification?.title}</h4>
                                <button className="shrink-0 self-start" aria-label="Close notification" onClick={handleCloseNotificationModal}>
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
                            <div className={appData?.last_notification?.image_url ? "p-1" : "py-2 pb-3 px-1"}>
                                <div
                                    className={`notification-content text-md text-black overflow-y-auto whitespace-pre-line break-words ${appData?.last_notification?.image_url ? "p-1 max-h-[80dvh]" : "p-3 pb-1 max-h-[60vh]"}`}
                                    style={{
                                        scrollbarWidth: 'thin',
                                        scrollbarColor: '#ca8a04 #e5e7eb'
                                    }}
                                >
                                    {linkifyText(appData?.last_notification?.description)}
                                    <NotificationImage notification={appData?.last_notification} compact />
                                </div>
                                {!appData?.last_notification?.image_url && <>
                                <div className="p-3 pt-1 text-gray-700">
                                    {appData?.last_notification?.created_at?.length > 0
                                        ? moment(appData?.last_notification?.created_at).format("DD-MM-YYYY HH:mm")
                                        : ""}
                                </div>
                                <WebPushNotice compact />
                                </>}
                            </div>
                        </div>
                    </Modal>

                    : null
            }
            <Modal
                isOpen={openLoginModal}
                toggle={() => setOpenLoginModal(false)}
                zIndex={40}
                closeOnBackdrop={false}
                className="custom-modal"
                centered
            >
                <div className="font-semibold text-white bg-white " style={{ width: "400px", maxWidth: "90vw" }}>
                    <div className="flex justify-between p-3 border-b border-white bg-primary">
                        <h4>Need Login</h4>
                        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpenLoginModal(false); }} className="outline-none">
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
                        <div className="text-md text-black">
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

export default Header;
