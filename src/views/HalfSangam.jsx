import { walletAmounts } from '../utils/wallet';
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { fetchAppData } from '../store/features/appData/appDataSlice';
import Open from './HalfSangam/Open.jsx';
import Close from './HalfSangam/Close.jsx';
import Gold_Coin from '../assets/imgs/coin.png';
import { useSearchParams } from "react-router-dom";


const HalfSangam = () => {
  const [activeTab, setActiveTab] = useState("Open");
  const { appData: initialAppData } = useSelector((state) => state.appData);
  const { markets } = useSelector(state => state.markets);
  const [currentMarket, setCurrentMarket] = useState(null);
  const { user } = initialAppData;
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();


  const [balance, setBalance] = useState(walletAmounts(user).total);

  useEffect(() => {
    const isMarketLoaded = Object.keys(markets).includes('general');
    if (isMarketLoaded) {
      setCurrentMarket(markets['general'].markets.find(market => market.id == searchParams.get('market_id')))
    }
  }, [markets]);

  useEffect(() => {
    const isOpenExist = currentMarket?.open_game_status;
    const isCloseExist = currentMarket?.close_game_status;
    setActiveTab(isOpenExist ? 'Open' : isCloseExist ? 'Close' : null)
  }, [currentMarket])

  useEffect(() => {
    if (!balance) {
      // Dispatch the correct action to get the app data, including the user's balance
      dispatch(fetchAppData())
        .then((response) => {
          const { appData } = response.payload;
          setBalance(walletAmounts(appData?.user).total);  // Update balance from appData
        })
        .catch((error) => {
          console.error("Error fetching app data: ", error);
        });
    }
  }, [dispatch, balance]);

  return (
    <div className="">
      <div className="flex mb-4 bg-primary border-t-2 border-[#fff]">
        {currentMarket?.open_game_status &&
          <button
            className={`flex-1 px-4 py-1 ${activeTab === "Open"
              ? "bg-primary text-white border-b-4 border-white"
              : "bg-primary text-white"
              } rounded-t-lg`}
            onClick={() => setActiveTab("Open")}
          >
            <div className="text-center">Open</div>
          </button>
        }
        {currentMarket?.close_game_status &&
          <button
            className={`flex-1 px-4 py-1 ${activeTab === "Close"
              ? "bg-primary text-white border-b-4 border-white"
              : "bg-primary text-white"
              } rounded-t-lg`}
            onClick={() => setActiveTab("Close")}
          >
            <div className="text-center">Close</div>
          </button>
        }
      </div>
      <div className='w-[92%] rounded-lg text-[22px] p-1 m-auto my-2 text-center bg-[#e4ae39] font-semibold text-[#fff] flex justify-center items-center gap-0'>
        <img src={Gold_Coin} alt="Balance" className="w-[25px] h-[25px] object-cover cursor-auto" />
        <p className='text-[16px]'> Balance: {walletAmounts(user).total}</p>
      </div>
      <div className="border-t border-gray-300">
        {activeTab === "Open" && (
          <Open />
        )}
        {activeTab === "Close" && (
          <Close />
        )}
      </div>

    </div>
  );
};

export default HalfSangam;
