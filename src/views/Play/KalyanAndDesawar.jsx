import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { getMarkets } from "../../repository/MarketRepository";
import { Tab } from "@headlessui/react";
import Chart_b from "../../assets/imgs/chart_b.png";
import Close_b from "../../assets/imgs/close_b.png";
import Chat1 from "../../assets/imgs/play_now.png";
import Auth from '../../layouts/Auth.jsx';
import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal.jsx";
import { useSelector } from "react-redux";
import { useShowEverything } from "../../credentials/index.js";

const KalyanAndDesawar = ({
  tabBorderColor,
  tabBG,
  activeTabBgColor,
  vertialyPadding,
  tabHeight,
}) => {
  const [marketsData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openLoginModal, setOpenLoginModal] = useState(false);
  let { appData } = useSelector((state) => state.appData.appData);
  const [selectedTab, setSelectedTab] = useState(() => {
    return localStorage.getItem("selectedTab") || "general";
  });
  const { showEverything } = useShowEverything();
  let showResultsOnly = !showEverything;

  const navigate = useNavigate();
  const [authModalOpen, setAuthModalOpen] = useState(false); // State for authentication modal

  const token = localStorage.getItem("authToken");

  const marketType = selectedTab === "general" ? "general" : "desawar";
  const marketTypeChart = selectedTab === "general" ? "market" : "desawar";
  const marketTypeSlug = selectedTab === "general" ? "pana-chart" : "chart";

  useEffect(() => {
    const fetchMarkets = async () => {
      setLoading(true);
      try {
        const response = await getMarkets(marketType);
        setMarketData(response?.data?.response?.markets);
      } catch (error) {
        console.error("Error fetching markets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarkets();
  }, [selectedTab]);

  useEffect(() => {
    localStorage.setItem("selectedTab", selectedTab);
  }, [selectedTab]);

  const handleProtectedClick = (e, marketId, marketName) => {
    if (showResultsOnly) return
    if (!token) {
      e.preventDefault();
      localStorage.setItem("authMenu", 1);
      setAuthModalOpen(true); // Show authentication modal if not logged in
    } else {
      // Your other conditions here if the user is authenticated
      const url = `https://api.mahakalmatka.com/${marketTypeChart}/${marketTypeSlug}/${marketId}/hello`;
      navigate("/game-chart/?gameName=" + marketName + "&gameUrl=" + url);
    }
  };


  const handlekalyanChatClick = (market) => {
    if (!token) {
      localStorage.setItem("authMenu", 1)
      setAuthModalOpen(true); // Open modal for authentication
    } else {
      // Use navigate to redirect in the same tab
      navigate(`/general-sub-games?gameType=${market?.name}&market_id=${market?.id}`);
    }
  };
  const handleChatClick = (market) => {
    if (!token) {
      localStorage.setItem("authMenu", 1)
      setAuthModalOpen(true); // Open modal for authentication
    } else {
      // Use navigate to redirect in the same tab
      navigate(`/play-game?gameType=desawar&market_id=${market?.id}&open=${market?.open_game_status}&close=${market?.close_game_status}`);
    }
  };

  return (
    <div className="px-1 pb-8">
      <Tab.Group
        selectedIndex={selectedTab === "general" ? 0 : 1}
        onChange={(index) =>
          setSelectedTab(index === 0 ? "general" : "desawar")
        }
      >
        {/* Tab List (Tabs remain visible even during loading) */}
        <Tab.List
          className={`flex p-1 space-x-1 rounded-xl border-2 w-[250px] m-auto ${tabBorderColor} ${tabBG}`}
        >
          <Tab
            className={({ selected }) =>
              selected
                ? `${activeTabBgColor} shadow text-white font-semibold ${vertialyPadding} px-4 rounded-lg w-[49%]`
                : `text-white font-semibold ${vertialyPadding} px-4 rounded-lg w-[49%] ${tabHeight}`
            }
          >
            Kalyan
          </Tab>
          <Tab
            className={({ selected }) =>
              selected
                ? `${activeTabBgColor} shadow text-white font-semibold ${vertialyPadding} px-4 rounded-lg w-[49%]`
                : `text-white font-semibold ${vertialyPadding} px-4 rounded-lg w-[49%] ${tabHeight}`
            }
          >
            Desawar
          </Tab>
        </Tab.List>

        {/* Tab Panels (Show loading spinner here if loading is true) */}
        <Tab.Panels className="mt-1">
          {loading ? (
            <div className="flex justify-center items-center h-[60vh]">
              <BeatLoader color="#0098c7" loading={loading} />
            </div>
          ) : (
            <>
              <Tab.Panel className="flex flex-col gap-1">
                {marketsData
                  ?.filter((market) => market !== null)
                  .map((market) => (
                    <div
                      key={market?.id}
                      className={`flex flex-col text-white rounded-md border-2 ${tabBorderColor}`}
                    >
                      <div className="w-full flex justify-between items-center p-1 px-3 bg-primary">
                        <p className="text-[12px]">Open: {market?.open_time}</p>
                        <p className="text-[12px]">Close: {market?.close_time}</p>
                      </div>

                      {
                        !showResultsOnly && (
                          <div className="p-2 w-full flex justify-between items-center">
                            <img
                              src={Chart_b}
                              alt="Chart"
                              className="w-[50px] h-[50px] object-cover cursor-pointer my-[-5px]"
                              onClick={(e) => handleProtectedClick(e, market?.id, market?.name)}
                            />

                            <div className="flex flex-col justify-center items-center">
                              <span className="text-[13px] font-semibold uppercase text-[#4f4f4f]">
                                {market?.name}
                              </span>
                              <span className="text-[12px] font-semibold uppercase text-primary">
                                {market?.last_result
                                  ? market?.last_result.result
                                  : "***-**-***"}
                              </span>
                              <span
                                className={`text-[12px] ${!market?.game_on
                                  ? "text-orange"
                                  : "text-greenLight"
                                  }`}
                              >
                                {market?.game_on
                                  ? "Market is Running"
                                  : "Market is Close"}
                              </span>
                            </div>
                            <div
                              className={`w-[50px] h-[50px] text-center font-semibold rounded-full`}
                            >
                              {!market?.game_on ? (
                                <div style={{ pointerEvents: "none" }}>
                                  <img
                                    src={Close_b}
                                    alt="Close"
                                    className="w-full h-full object-cover cursor-not-allowed"
                                  />
                                </div>
                              ) : (
                                <img
                                  src={Chat1}
                                  alt="Play Now"
                                  className="w-full h-full object-cover cursor-pointer"
                                  onClick={() => token ? handlekalyanChatClick(market) : setOpenLoginModal(true)}
                                />
                              )}
                            </div>
                          </div>
                        )
                      }
                    </div>
                  ))}
              </Tab.Panel>
              <Tab.Panel className="flex flex-col gap-1">
                {marketsData
                  ?.filter((market) => market !== null)
                  .map((market) => (
                    <div
                      key={market?.id}
                      className={`flex flex-col text-white rounded-md border-2 ${tabBorderColor}`}
                    >
                      <div className="w-full flex justify-between items-center p-1 px-3 bg-primary">
                        <p className="text-[12px]">Open: {market?.open_time}</p>
                        <p className="text-[12px]">Close: {market?.close_time}</p>
                      </div>
                      <div className="p-2 w-full flex justify-between items-center">
                        <img
                          src={Chart_b}
                          alt="Chart"
                          className="w-[50px] h-[50px] object-cover cursor-pointer"
                          onClick={(e) => handleProtectedClick(e, market?.id, market?.name)}
                        />

                        <div className="flex flex-col justify-center items-center">
                          <span className="text-[13px] font-semibold uppercase text-[#4f4f4f]">
                            {market?.name}
                          </span>
                          <span className="text-[12px] font-semibold uppercase text-primary">
                            {market?.last_result
                              ? market?.last_result.result
                              : "***-**-***"}
                          </span>
                          <span
                            className={`text-[12px] ${!market?.game_on
                              ? "text-orange"
                              : "text-greenLight"
                              }`}
                          >
                            {market?.game_on
                              ? "Market is Running"
                              : "Market is Close"}
                          </span>
                        </div>
                        <div
                          className={`w-[50px] h-[50px] text-center font-semibold rounded-full`}
                        >
                          {
                            !showResultsOnly ?
                              (!market?.game_on ? (
                                <div style={{ pointerEvents: "none" }}>
                                  <img
                                    src={Close_b}
                                    alt="Close"
                                    className="w-full h-full object-cover cursor-not-allowed"
                                  />
                                </div>
                              ) : (
                                <img
                                  src={Chat1}
                                  alt="Play Now"
                                  className="w-full h-full object-cover cursor-pointer"
                                  onClick={() => token ? handleChatClick(market) : setOpenLoginModal(true)}
                                />
                              ))
                              : null
                          }
                        </div>
                      </div>
                    </div>
                  ))}
              </Tab.Panel>
            </>
          )}
        </Tab.Panels>
      </Tab.Group>

      {/* Render the authentication modal */}
      <Auth isOpen={authModalOpen} toggle={() => setAuthModalOpen(false)} />

      {
        !showResultsOnly ?
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
          : null
      }
    </div>
  );
};

export default KalyanAndDesawar;
