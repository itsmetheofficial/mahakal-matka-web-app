import React, { useEffect, useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../assets/imgs/Logo.png";
import { useSelector } from "react-redux";
import Modal from "./Modal";
import InstallButton from "../components/InstallButton";
import DownloadButton from "./DownloadButton";
import { logout } from "../repository/AuthRepository";
import { toast } from "react-toastify";
import Spinner from "./Spinner";
import { DeferredPromptContext } from "../context/DeferredPromptContext";

const Sidebar = ({ toggleSideBar }) => {
  let location = useLocation();
  let { appData, user } = useSelector((state) => state.appData.appData);
  let { GameRate } = useSelector((state) => state.FlowApp);
  let [logoutModal, setLogoutModal] = useState(false);
  let [logoutLoading, setLogoutLoading] = useState(false);
  const { deferredPrompt } = useContext(DeferredPromptContext);

  // Detect Android WebView via the JS bridge your WebView exposes
  const isInAndroidApp =
    typeof window !== 'undefined' && typeof window.AndroidApp !== 'undefined';

  // Get user data either from Redux or localStorage
  const storedUser = JSON.parse(localStorage.getItem("authUser")) || {};
  const currentUser = user?.phone ? user : storedUser;

  // Handle logout API call
  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      const { data } = await logout();
      if (data.error === false) {
        // Success - proceed with current logout logic
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/auth/login";
        document.title = "Mahakal Matka";
      } else {
        // Show error message from API
        toast.error(data.message || "Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Something went wrong during logout. Please try again.");
    } finally {
      setLogoutLoading(false);
    }
  };


  let links = [
    {
      text: "App Details",
      to: "/app-details",
      icon: (className) => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          className={className}
          fill="currentColor"
        >
          <path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h6zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H5z"></path>
          <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"></path>
        </svg>
      ),
      iconType: "svg",
    },
    {
      text: "Get Free Bonus",
      to: "/free-gift",
      description: "फ्री बोनस प्राप्त करें",
      icon: (className) => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          className={className}
          fill="currentColor"
        >
          <path d="M3 2.5a2.5 2.5 0 0 1 5 0 2.5 2.5 0 0 1 5 0v.006c0 .07 0 .27-.038.494H15a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 14.5V7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h2.038A2.968 2.968 0 0 1 3 2.506V2.5zm1.068.5H7v-.5a1.5 1.5 0 1 0-3 0c0 .085.002.274.045.43a.522.522 0 0 0 .023.07zM9 3h2.932a.56.56 0 0 0 .023-.07c.043-.156.045-.345.045-.43a1.5 1.5 0 0 0-3 0V3zM1 4v2h6V4H1zm8 0v2h6V4H9zm5 3H9v8h4.5a.5.5 0 0 0 .5-.5V7zm-7 8V7H2v7.5a.5.5 0 0 0 .5.5H7z"></path>
        </svg>
      ),
      iconType: "svg",
    },
    // {
    //   to: "/history",
    //   text: "My Play History",
    //   description: "अपनी खेली हुई गेम देखने के लिए यहाँ दबाये",
    //   icon: require("../assets/imgs/swords.png"),
    //   iconType: "img",
    // },
    // {
    //   to: "/game-posting",
    //   text: "Game Posting",
    //   description: "गेम की गैसिंग देखने के लिए यहां दबाए",
    //   icon: require("../assets/imgs/game.png"),
    //   iconType: "img",
    // },
    // {
    //   to: "/bonus-report",
    //   text: "Bonus Report",
    //   description: "अपनी गेम का कमीशन देखने के लिए यहाँ दबाये",
    //   icon: require("../assets/imgs/bonus.png"),
    //   iconType: "img",
    // },
    // {
    //   to: "/result-history",
    //   text: "Result History",
    //   description: "गेम के रिजल्ट देखने के लिए यहाँ दबाये",
    //   icon: require("../assets/imgs/history.png"),
    //   iconType: "img",
    // },
    {
      text: "Terms and Condition",
      to: "/terms-and-condition",
      description: "नियम एवं शर्ते",
      icon: require("../assets/imgs/connection.png"),
      iconType: "img",
    },
    {
      text: "Share",
      onClick: async (e) => {
        e.preventDefault();
        const shareText = `कल्याण मिलन श्रीदेवी खेलने वाले भाई ये Trusted एप डाउनलोड करें और Online खेलें!`;
        const shareUrl = `${process.env.REACT_APP_SHARE_ORIGIN || window.location.origin}/auth/login?referralCode=${user?.own_code}`;

        if (navigator.share) {
          try {
            await navigator.share({
              title: 'Share',
              text: shareText,
              url: shareUrl,
            });
          } catch (error) {
            console.error('Error sharing:', error);
          }
        } else {
          // Fallback for browsers not supporting Web Share API
          if (navigator.clipboard) {
            try {
              await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
              alert('Link कॉपी हो गया है, अपने दोस्तों के साथ शेयर करें।');
            } catch (error) {
              console.error('Error copying to clipboard:', error);
            }
          } else {
            // Clipboard API not supported
            alert('Unable to copy link. Please try sharing manually.');
          }
        }
      },
      description: "शेयर करें और कमाएं दैनिक कमीशन",
      icon: (className) => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          className={className}
          fill="currentColor"
        >
          <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"></path>
        </svg>
      ),
      iconType: "svg",
    },
    // {
    //   text: "Rate our app",
    //   description: "हमारी एप्लिकेशन को सुझाव देने के लिए दबाये",
    //   icon: require("../assets/imgs/rate.png"),
    //   iconType: "img",
    //   to: appData?.rate_app_link,
    //   external: true,
    // },
    {
      onClick: (e) => {
        e.preventDefault();
        setLogoutModal(true);
        toggleSideBar()
      },
      text: "Logout",
      icon: require("../assets/imgs/logout.png"),
      iconType: "img",
    },
  ];



  // Conditionally add the Game Rate link if GameRate is true
  if (GameRate) {
    links.splice(2, 0, {
      to: "/game-rate",
      text: "Game Rates",
      description: "",
      icon: require("../assets/imgs/swords.png"),
      iconType: "img",
    });
  }
  if (appData?.invite_system_enable) {
    links.splice(1, 0, {
      text: "Invite and Earn",
      to: "/invite-and-earn",
      description: `दोस्तों के खेलने पर ${appData?.invite_percentage_bet}% कमीशन पाएं।`,
      icon: require("../assets/imgs/referral.png"),
      iconType: "img",
    },);
  }

  const handleKeyDown = (e) => {
    if (e.keyCode === 27 && document.body.classList.contains("sidebar-open"))
      toggleSideBar();
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  let [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(prevState => !prevState)
  }

  return (
    <>
      <Modal isOpen={logoutModal} toggle={() => {
        setLogoutModal(prevState => !prevState);
      }}>
        <div className='font-semibold text-black bg-white'>
          <div className='flex justify-end p-3 border-b border-black'>
            <button onClick={() => {
              setLogoutModal(prevState => !prevState);
            }}>
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
          <div className="w-11/12 max-w-[480px] p-3">
            Are You sure you want to logout?
            <div className="mt-4 flex gap-4 justify-end">
              <button
                onClick={handleLogout}
                disabled={logoutLoading}
                className="py-1 px-3 bg-red-400 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {logoutLoading ? <Spinner /> : "Logout"}
              </button>
              <button onClick={() => {
                setLogoutModal(false)
              }} className="py-1 px-3 bg-primary rounded-md">Cancel</button>
            </div>
          </div>
        </div>
      </Modal>
      <div className="absolute z-20 transition-all top-0 group-[.sidebar-open]/body:left-0 -left-full w-full h-[100vh] bg-black/40">
        <div
          onClick={toggleSideBar}
          className="absolute top-0 z-0 w-full h-full cursor-pointer"
        ></div>
        <div className="absolute z-10 w-4/6 h-full bg-white text-white shadow-2xl ">
          <div className="p-5 bg-primary/95">
            <div onClick={toggleSideBar} className="flex justify-end w-full">
              <button>
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
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full">
                    <img src={Logo} className="w-full h-full object-cover" alt="Logo" />
                  </div>
                </div>
                <div className="ml-3 text-sm">
                  <h4>
                    <strong>Name:</strong> {currentUser.name || "Guest"}
                  </h4>
                  <h4 className="opacity-80">
                    <strong>ID:</strong> {currentUser.phone || "N/A"}
                  </h4>
                </div>
              </div>

              <Link
                to="/profile"
                onClick={toggleSideBar}
                className="flex items-center justify-center py-1.5 mt-2 text-white rounded-full shadow-lg bg-greenLight"
              >
                Edit Profile
              </Link>

              {/* Download Button */}
              {(appData?.app_update_link?.length > 0 || deferredPrompt) && !isInAndroidApp && (
                <div className="mt-2">
                  <DownloadButton
                    variant="sidebar"
                    size="medium"
                  />
                </div>
              )}

              {/* <InstallButton /> */}
            </div>
          </div>
          <div className="h-[calc(100vh-172px)] overflow-auto bg-orange pb-12">
            {links.map((link, idx) =>
              link.onClick ? (
                <a
                  onClick={link.onClick}
                  href={"/"}
                  className={`flex items-center px-4 py-3 transition-all border-b-2 border-white shadow-inner hover:bg-greenLight hover:pl-4 h-20 border-opacity-40 bg-orange ${location.pathname === link.to ? "!bg-greenLight !pl-4" : ""
                    }`}
                  key={`SidebarItemNo${idx}`}
                >
                  {link.iconType === "svg" ? (
                    link.icon("w-6 h-6 flex-shrink-0")
                  ) : link.iconType === "img" ? (
                    <img
                      src={link.icon}
                      className="w-6 h-6"
                      style={{ filter: "invert(1)" }}
                      alt={link.title}
                    />
                  ) : (
                    ""
                  )}
                  <div className="flex flex-col">
                    <span className="ml-2 font-black">{link.text}</span>
                    {link.description && (
                      <span className="ml-2 text-xs font-black">
                        {link.description}
                      </span>
                    )}
                  </div>
                </a>
              ) : link.external ? (
                <a
                  href={link.to}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex items-center px-4 py-3 transition-all border-b-2 border-white shadow-inner hover:bg-greenLight hover:pl-4 h-20 border-opacity-40 bg-orange ${location.pathname === link.to ? "!bg-greenLight !pl-4" : ""
                    }`}
                  key={`SidebarItemNo${idx}`}
                >
                  {link.iconType === "svg" ? (
                    link.icon("w-6 h-6 flex-shrink-0")
                  ) : link.iconType === "img" ? (
                    <img

                      src={link.icon}
                      className="w-6 h-6 flex-shrink-0"
                      style={{ filter: "invert(1)" }}
                      alt={link.title}
                    />
                  ) : (
                    ""
                  )}
                  <div className="flex flex-col">
                    <span className="ml-2 font-black">{link.text}</span>
                    {link.description && (
                      <span className="ml-2 text-xs font-black">
                        {link.description}
                      </span>
                    )}
                  </div>
                </a>
              ) : (
                <Link
                  to={link.to || "#"}
                  key={`SidebarItemNo${idx}`}
                  onClick={toggleSideBar}
                  className={`flex items-center px-4 py-3 transition-all border-b-2 border-white shadow-inner hover:bg-greenLight !pl-4 h-20 border-opacity-40 bg-orange ${location.pathname === link.to ? "!bg-greenLight !pl-4" : ""
                    }`}
                >
                  {link.iconType === "svg" ? (
                    link.icon("w-6 h-6 flex-shrink-0")
                  ) : link.iconType === "img" ? (
                    <img
                      src={link.icon}
                      className="w-6 h-6 flex-shrink-0"
                      style={{ filter: "invert(1)" }}
                      alt={link.title}
                    />
                  ) : (
                    ""
                  )}
                  <div className="flex flex-col">
                    <span className="ml-2 font-black">{link.text}</span>
                    {link.description && (
                      <span className="ml-2 text-xs font-black">
                        {link.description}
                      </span>
                    )}
                  </div>
                </Link>
              )
            )}
          </div>
          {/* <div className="p-2 text-[9px] h-[100px] font-semibold text-center text-black bg-white">
              <div className="grid grid-cols-3 gap-2">
                <a
                  href={appData?.whatsapp_group_join_link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center"
                >
                  <div className="bg-[#4267b2] flex items-center justify-center rounded-full w-14 h-14">
                  <i className="text-4xl text-white fab fa-whatsapp"></i>
                  </div>
                  <p className="mt-1">
                     WhatsApp
                  </p>
                </a>
                <a
                  href={appData?.telegram_link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center"
                >
                  <div className="bg-[#4267b2] flex items-center justify-center rounded-full w-14 h-14">
                    <i className="text-4xl text-white fab fa-telegram"></i>
                  </div>
                  <p className="mt-1">
                    Telegram
                  </p>
                </a>
                <a
                  href={appData?.instagram_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center"
                >
                  <div
                    style={{
                      backgroundImage:
                        "linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)",
                    }}
                    className="flex items-center justify-center rounded-full w-14 h-14"
                  >
                    <i className="text-4xl text-white fab fa-instagram"></i>
                  </div>
                  <p className="mt-1">Instagram</p>
                </a>
              </div>
            </div> */}
        </div>
      </div>
      <Modal isOpen={isOpen} toggle={toggle}>
        <div className="font-semibold text-white bg-primary">
          <div className="flex justify-end p-3 border-b border-white">
            <button onClick={toggle}>
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
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 p-3 text-center">
            <div>
              <Link
                to="/withdrawal-chat"
                className="block w-full py-2 rounded-md bg-orange"
              >
                Withdrawal Chat
              </Link>
              <p className="mt-2">
                पैसे निकालने मैं अगर कोई समस्या है तो withdraw chat पे क्लिक
                करे।
              </p>
            </div>
            <div>
              <Link
                to="/deposit-chat"
                className="block w-full py-2 rounded-md bg-orange"
              >
                Deposit Chat
              </Link>
              <p className="mt-2">
                पैसे ऐड करने मैं अगर आपको समस्या है तो deposit chat पे क्लिक
                करे।
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Sidebar;
