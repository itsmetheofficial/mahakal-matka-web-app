import React, { useEffect, useState, Suspense, startTransition } from "react";
import Logo from "../assets/imgs/Logo.png";
import { useSelector } from "react-redux";
import Deposit from "../assets/imgs/deposit.png";
import Withdraw from "../assets/imgs/withdraw.png";
import deposit1 from '../assets/imgs/deposit1.png';
import widthdraw1 from '../assets/imgs/withdraw1.png';
import Layer from '../assets/imgs/Layer.png';
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Timer from "../components/Timer";
import Auth from '../layouts/Auth.jsx';
import moment from "moment";
import Play from "./Play.jsx"
import Modal from "../components/Modal.jsx"
import InstallAppDialog from "../components/InstallAppDialog.jsx";
import { useShowEverything } from "../credentials/index.js";

// const Play = React.lazy(() => import('./Play.jsx'));
// const Modal = React.lazy(() => import('../components/Modal'));

const Home = () => {
    const navigate = useNavigate();
    let [searchParams] = useSearchParams();
    let { appData } = useSelector((state) => state.appData.appData);
    let { markets } = useSelector((state) => state.markets);
    let { HomeNewView } = useSelector((state) => state.FlowApp);
    let [isOpen, setOpen] = useState(false);
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [hasShownModal, setHasShownModal] = useState(false);
    const [openLoginModal, setOpenLoginModal] = useState(false);
    const [showInstallDialog, setShowInstallDialog] = useState(false);
    const [hasShownInstallDialog, setHasShownInstallDialog] = useState(false);

    const { showEverything } = useShowEverything();
    let showResultsOnly = !showEverything;

    const getCurrentDate = () => {
        return moment(moment.now()).format("YYYY-MM-DD");
    };

    useEffect(() => {
        document.title = "Home | Mahakal Matka";

        // Capture and store promo_type from 'r' URL parameter
        const promoType = searchParams.get("r");
        if (promoType?.trim()?.length > 0) {
            localStorage.setItem("promo_type", promoType);
        }

        // Also trigger install dialog check on mount
        const checkInstallDialog = () => {
            const currentToken = localStorage.getItem("authToken");
            const isModelOpenedAlready = localStorage.getItem("isModelOpenedAlready") === "true";
            const userDismissedDialog = localStorage.getItem("userDismissedInstallDialog") === "true";

            console.log("Mount Install Dialog Check:", {
                token: !!currentToken,
                isModelOpenedAlready,
                userDismissedDialog,
                hasShownInstallDialog
            });

            // Show dialog if:
            // 1. User is logged in
            // 2. Floating download bar was NOT dismissed (isModelOpenedAlready is false)  
            // 3. User has NOT dismissed dialog before (permanent dismissal)
            // 4. Dialog hasn't been shown in this page load yet
            if (currentToken && !isModelOpenedAlready && !userDismissedDialog && !hasShownInstallDialog) {
                console.log("Showing install dialog on mount in 2 seconds...");
                setTimeout(() => {
                    setShowInstallDialog(true);
                    setHasShownInstallDialog(true);
                    console.log("Install dialog shown on mount");
                }, 2000);
            }
        };

        checkInstallDialog();
    }, []);

    const toggle = () => {
        // startTransition(() => {
        setOpen((prevState) => !prevState);
        // });
    };

    useEffect(() => {
        if (!localStorage.getItem("authMenu")) {
            localStorage.setItem("authMenu", "0");
        }

        if (!hasShownModal) {
            const timer = setTimeout(() => {
                const token = localStorage.getItem("authToken");
                const authMenu = localStorage.getItem("authMenu"); // Get the value of authMenu

                if (!token && authMenu === "0") {
                    setAuthModalOpen(true);
                    setHasShownModal(true);
                }
            }, 10000); // Show modal after 10 seconds

            return () => clearTimeout(timer); // Cleanup timer on unmount
        }
    }, [hasShownModal]);

    // Show install dialog once after login when isModelOpenedAlready is false
    useEffect(() => {
        const currentToken = localStorage.getItem("authToken");
        const isModelOpenedAlready = localStorage.getItem("isModelOpenedAlready") === "true";
        const userDismissedDialog = localStorage.getItem("userDismissedInstallDialog") === "true";

        console.log("Install Dialog Check:", {
            token: !!currentToken,
            isModelOpenedAlready,
            userDismissedDialog,
            hasShownInstallDialog
        });

        // Show dialog when user is logged in AND floating download bar was NOT dismissed (isModelOpenedAlready is false)
        // AND user has NOT dismissed dialog before (permanent dismissal)
        if (currentToken && !isModelOpenedAlready && !userDismissedDialog && !hasShownInstallDialog) {
            console.log("Showing install dialog in 2 seconds...");
            const timer = setTimeout(() => {
                setShowInstallDialog(true);
                setHasShownInstallDialog(true);
                console.log("Install dialog shown");
            }, 2000); // Show after 2 seconds of being on homepage

            return () => clearTimeout(timer);
        }
    }, [hasShownInstallDialog]);

    const tabHeight = "h-[1px]";
    const overallPadding = "p-0";
    const vertialyPadding = "p-0";
    const token = localStorage.getItem("authToken");

    // Handle DEPOSIT and WITHDRAWAL click
    const handleProtectedClick = (e) => {
        if (!token) {
            e.preventDefault();
            localStorage.setItem("authMenu", 1)
            setAuthModalOpen(true);
            setOpenLoginModal(true)
        } else {
        }
    };

    const openLink = (url) => {
        if (url?.includes("http")) {
            window.open(url, "_blank");
        } else if (url) {
            navigate(url);
        }

    }



    if (!HomeNewView) {
        return (
            <div className="p-3 pt-1 pb-5">
                <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col items-center justify-center">
                        <Link to="/deposit-chat" className="inline-block">
                            <img className="h-9" alt="Deposit" src={Deposit} />
                        </Link>
                        <Link to="/withdrawal-chat" className="inline-block">
                            <img className="h-9" alt="Withdraw" src={Withdraw} />
                        </Link>
                    </div>
                    <div className="flex items-center justify-center">
                        <img alt="Logo" src={Logo} className="h-20" />
                    </div>
                    <div className="flex flex-col justify-center">
                        <a
                            href={appData?.result_history_webview_url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-center w-full px-2 py-2 text-xs text-white bg-orange-300 rounded-md shadow-md bg-orange">
                            Other Game
                        </a>
                        <button className="flex items-center justify-center w-full px-2 py-2 mt-1 text-xs text-white bg-orange-300 rounded-md shadow-md bg-greenLight">
                            Clear Data
                        </button>
                    </div>
                </div>
                <marquee
                    className="mt-1 text-white rounded-md bg-orange"
                    scrollamount="6"
                >
                    {appData?.homepage_message}
                </marquee>
                <div className="flex flex-col items-center justify-center p-2 mb-3 font-semibold text-center text-white bg-black border rounded-md shadow-sm">
                    <div
                        dangerouslySetInnerHTML={{
                            __html: appData?.custom_message_1_homepage_1st,
                        }}
                    ></div>
                    <Timer />
                </div>
                <div className="flex flex-col items-center justify-center p-2 mb-3 font-semibold text-center text-black bg-white border rounded-md shadow-sm">
                    <span className="text-sm">{markets?.current_result_card?.market?.name}</span>
                    <span className="text-sm">Result</span>
                    <span className="text-sm">{markets?.current_result_card?.result}</span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 mb-3 font-semibold text-center text-white bg-yellow-600 rounded-md">
                    <span>🔥 50 हजार से अधिक लोगों का भरोसा, महाकाल मटका, अब आ गया है अनलाइन एप में 🔥</span>
                    <a
                        href={appData?.result_history_webview_url}
                        rel="noreferrer"
                        className="px-4 py-1 mt-2 rounded-2xl bg-orange"
                        target="_blank"
                    >
                        Download Now
                    </a>
                </div>
                <div
                    className="flex flex-col justify-center p-2 mb-3 font-semibold text-center text-white bg-red-600 rounded-md"
                    dangerouslySetInnerHTML={{
                        __html: appData?.custom_message_2_homepage_2nd_note,
                    }}
                ></div>
                <div className="flex justify-center p-2 mb-2 font-semibold text-white rounded-md bg-greenLight">
                    Mahakal Matka Live Result of {getCurrentDate()}
                </div>
                <div className="flex items-center mb-2 text-xs text-white rounded-3xl bg-orange">
                    <span className="px-2 font-semibold">Market Name/Time</span>
                    <span className="flex flex-row gap-4 px-2 py-2 pr-4 ml-auto text-[10px] border-l border-black border-opacity-20">
                        <span>
                            Previous <br />
                            Result
                        </span>{" "}
                        <span>
                            Today
                            <br /> Result
                        </span>
                    </span>
                </div>
                {markets?.markets?.map((market, idx) => (
                    <Link
                        className="block p-3 py-1 mb-1 font-semibold bg-red-500 rounded-md"
                        key={idx}
                        to={!market?.game_on ? "#" : `/play-game?gameType=${market?.name}&market_id=${market?.id}`}
                    >
                        <span className="text-sm font-semibold text-white">
                            {market?.name}
                        </span>
                        <div className="grid items-end grid-cols-12 text-xs">
                            <div className="flex flex-col col-span-3 text-white">
                                <small>Open Time</small>
                                <small>{market?.open_time}</small>
                            </div>
                            <div className="flex flex-col col-span-3 text-white">
                                <small>Close Time</small>
                                <small>{market?.close_time}</small>
                            </div>
                            <div className="flex flex-col col-span-2 text-white">
                                <small>Result At</small>
                                <small>{market?.result_time}</small>
                            </div>
                            <div className="flex flex-col col-span-4 text-white">
                                <div className="grid grid-cols-2">
                                    <h3 className="text-xl font-bold text-right">
                                        {market?.second_last_result?.result || "XX"}
                                    </h3>
                                    <h3 className="text-xl font-bold text-right">
                                        {market?.last_result?.result || "XX"}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}

                {/* <Suspense fallback={<div>Loading...</div>}> */}
                {token && (
                    <Modal isOpen={isOpen} toggle={toggle} zIndex={30} closeOnBackdrop={false}>
                        <div className='font-semibold relative text-black bg-white rounded-xl'>
                            <img src={Logo} className="w-20 h-20 absolute left-1/2 z-9 -top-10 border-4 border-white rounded-full -translate-x-1/2" />
                            <div className='flex justify-end p-3'>
                                <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(); }}>
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                        strokeWidth='1.5'
                                        stroke='currentColor'
                                        className='w-6 h-6'
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            d='M6 18 18 6M6 6l12 12'
                                        />
                                    </svg>
                                </button>
                            </div>
                            <div className='p-3 text-center text-md'>
                                <h3 className="text-orange text-2xl">Important</h3>
                                <div>
                                    {appData.info_dialog_1_message}
                                </div>
                                <div className="pt-3">
                                    {appData.info_dialog_1_bottom_text}
                                </div>
                                <a href={appData.info_dialog_1_url} target="_blank" className="mt-8 inline-block bg-primary py-1 px-8 text-white rounded-3xl">
                                    <span className="mr-2">🚀</span>Click me!
                                </a>
                            </div>
                        </div>
                    </Modal>
                )}
                {/* </Suspense> */}

                {/* <Suspense fallback={<div>Loading...</div>}> */}
                <Auth isOpen={authModalOpen} toggle={() => setAuthModalOpen(false)} />
                {/* </Suspense> */}

                {/* Install App Dialog */}
                <InstallAppDialog
                    isOpen={showInstallDialog}
                    onClose={() => setShowInstallDialog(false)}
                />
            </div>
        );
    }

    return (
        <>
            <div className="p-2 pt-1 pb-5">
                <div className="w-full rounded-md overflow-hidden mb-2">
                    <img src={appData?.homepage_image_url} className="cursor-pointer" alt="" onClick={() => token ? openLink(appData?.slider_url) : setAuthModalOpen(true)} />
                </div>
                {
                    (appData?.homepage_message?.length > 0 && !showResultsOnly) ?
                        <div className="flex flex-col items-center justify-center p-2 mb-2 font-semibold text-center text-white bg-yellow-600 rounded-md">
                            <span>{appData.homepage_message}</span>
                            {
                                appData?.homepage_button_text?.length > 0 ?
                                    <button
                                        onClick={() => token ? openLink(appData?.homepage_button_url) : setOpenLoginModal(true)}
                                        rel="noreferrer"
                                        className="px-4 py-1 mt-2 rounded-2xl bg-orange"
                                        target="_blank"
                                    >
                                        {appData.homepage_button_text}
                                    </button>
                                    : null
                            }
                        </div>
                        : null

                }

                {/* Deposit and Withdrawal buttons */}
                {
                    !showResultsOnly ?
                        <div className="flex justify-between items-center gap-2 mb-3">
                            <Link
                                to={{ pathname: "/wallet", search: "?tab=addPoints" }}
                                className="shadow-md rounded-lg w-full h-[40px] flex items-center justify-center gap-2 p-2 border-[3px] border-[#fff] bg-[#2ed838] hover:shadow-xl transition-shadow duration-300"
                                onClick={handleProtectedClick} // Added click handler here
                            >
                                <img src={deposit1} alt="" className="text-[#fff] w-6 h-6" />
                                <span className="text-white text-[16px] font-extrabold">DEPOSIT</span>
                            </Link>
                            <Link
                                to={{ pathname: "/wallet", search: "?tab=withdrawPoints" }}
                                className="shadow-md rounded-lg w-full h-[40px] flex items-center justify-center gap-2 p-2 border-[3px] border-[#fff] bg-[#d82e2e] hover:shadow-xl transition-shadow duration-300"
                                onClick={handleProtectedClick} // Added click handler here
                            >
                                <img src={widthdraw1} alt="" className="text-[#fff] w-8 h-8" />
                                <span className="text-white text-[16px] font-extrabold">WITHDRAWAL</span>
                            </Link>
                        </div>
                        : null
                }
                {/* <div className="flex justify-center">
                    <a href={appData?.telegram_link} className="shadow-md rounded-lg w-1/2 h-[50px] flex items-center justify-center gap-2 p-2 border-[3px] border-[#fff] bg-[#2eb9d8] hover:shadow-xl transition-shadow duration-300">
                        <i className="fab fa-telegram " style={{ fontSize: "20px" }}></i>
                        <span className="text-white text-[12px] font-extrabold">Join Telegram</span>
                    </a>
                </div> */}
                <Play
                    tabHeight={tabHeight}
                    overallPadding={overallPadding}
                    vertialyPadding={vertialyPadding}
                    tabBorderColor=""
                    activeTabBgColor="bg-[#ca8a04]"
                    tabBG="bg-[#abd5e1]"
                />


                {token && (
                    <Modal isOpen={isOpen} toggle={toggle} zIndex={30} closeOnBackdrop={false}>
                        <div className='font-semibold relative text-black bg-white rounded-xl'>
                            <img src={Logo} className="w-20 h-20 absolute left-1/2 z-9 -top-10 border-4 border-white rounded-full -translate-x-1/2" />
                            <div className='flex justify-end p-3'>
                                <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(); }}>
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                        strokeWidth='1.5'
                                        stroke='currentColor'
                                        className='w-6 h-6'
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            d='M6 18 18 6M6 6l12 12'
                                        />
                                    </svg>
                                </button>
                            </div>
                            <div className='p-3 text-center text-md'>
                                <h3 className="text-orange text-2xl">Important</h3>
                                <div>
                                    {appData.info_dialog_1_message}
                                </div>
                                <div className="pt-3">
                                    {appData.info_dialog_1_bottom_text}
                                </div>
                                <a href={appData.info_dialog_1_url} target="_blank" className="mt-8 inline-block bg-primary py-1 px-8 text-white rounded-3xl">
                                    <span className="mr-2">🚀</span>Click me!
                                </a>
                            </div>
                        </div>
                    </Modal>
                )}

                {/* <Suspense fallback={<div>Loading...</div>}> */}
                {/* <Auth isOpen={authModalOpen} toggle={() => setAuthModalOpen(false)} /> */}
                {/* </Suspense> */}
            </div >

            {
                !showResultsOnly ?
                    <Modal
                        isOpen={openLoginModal}
                        toggle={() => setOpenLoginModal(false)}
                        zIndex={40}
                        closeOnBackdrop={false}
                        className="custom-modal"
                        centered
                    >
                        <div className="font-semibold text-white bg-primary " style={{ width: "400px", maxWidth: "90vw" }}>
                            <div className="flex justify-between p-3 border-b border-white">
                                <h4>Need Login</h4>
                                <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpenLoginModal(false); }}>
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
                    : null
            }

            {/* Install App Dialog */}
            <InstallAppDialog
                isOpen={showInstallDialog}
                onClose={() => setShowInstallDialog(false)}
            />
        </>
    );
};

export default Home;
