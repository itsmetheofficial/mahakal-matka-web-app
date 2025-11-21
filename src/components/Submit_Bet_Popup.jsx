import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { BeatLoader } from "react-spinners";
import { submitGame } from '../repository/GameRepository';
import { setAuthDataUsersSingleValue } from '../store/features/appData/appDataSlice';
import ResponseDialog from './ResponseDialog';


const Submit_Bet_Popup = ({ show, data, onClose, onSubmitted = () => { } }) => {
    const dispatch = useDispatch();
    const { appData: initialAppData } = useSelector((state) => state.appData);
    const { user } = initialAppData;
    const [searchParams] = useSearchParams();

    const tabType = searchParams.get('tabType');
    const gameType = searchParams.get('gameType');
    const market_id = searchParams.get('market_id');
    const bidType = searchParams.get('bidType');

    const gameTypeIdMap = {
        "Single Digit": 1,
        "Jodi Digits": 2,
        "Single Pana": 3,
        "Double Pana": 4,
        "Triple Pana": 5,
        "Half Sangam open": 6,
        "Half Sangam close": 7,
        "Full Sangam": 8
    };

    const getGameTypeId = (bidType, type) => {
        if (bidType === "Half Sangam") {
            return type === "open" ? gameTypeIdMap["Half Sangam open"] : gameTypeIdMap["Half Sangam close"];
        }
        return gameTypeIdMap[bidType] || 16;
    };

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [notEnoughPoints, setNotEnoughPoints] = useState(false);
    const [showTelegram, setShowTelegram] = useState(false);
    const [apiMessage, setApiMessage] = useState('');

    const totalBids = data.length;
    const totalBidAmount = data.reduce((acc, { value }) => acc + parseInt(value, 10), 0);
    const walletBalanceBefore = user?.balance || 0;
    const walletBalanceAfter = walletBalanceBefore - totalBidAmount;

    const handleSubmit = async () => {
        if (totalBidAmount > walletBalanceBefore) {
            setNotEnoughPoints(true);
            return;
        }

        setLoading(true);
        onClose(); // Close the main popup
        const formattedData = {
            type: "general",
            market_id: market_id,
            games: data.map(({ number, value, pair, type, gameTypeId }) => {
                const finalGameTypeId = gameTypeId || getGameTypeId(bidType, type);
                return {
                    number: pair.toString().replace('x', ''),
                    amount: parseInt(value, 10),
                    session: type || "null",
                    game_type_id: finalGameTypeId
                };
            })
        };

        try {
            const response = await submitGame(formattedData);
            if (response.data.error) {
                toast.error(response.data.message);
                console.error('Error submitting bet:', response.data.message);
                setApiMessage(response.data.message || 'Error adding game');
                setSuccess(false);
            } else {
                // Store API message
                setApiMessage(response.data.message || 'Game successfully added');

                // Update balance from API response
                const newBalance = response.data.response.balance_left;
                if (newBalance !== undefined) {
                    dispatch(setAuthDataUsersSingleValue({ key: 'balance', value: newBalance }));
                }

                // Check if we should show Telegram join button
                const hasJoinedTelegram = localStorage.getItem('hasJoinedTelegram') === 'true';
                const telegramLink = initialAppData?.appData?.telegram_link;
                const shouldShowTelegram = response.data.response.showTelegram === 1 || response.data.response.showTelegram === true;

                if (shouldShowTelegram && !hasJoinedTelegram && telegramLink) {
                    setShowTelegram(true);
                } else {
                    setShowTelegram(false);
                }

                setSuccess(true);
                onSubmitted();
            }
        } catch (error) {
            setLoading(false);
            setApiMessage('Error submitting bet. Please try again.');
            setSuccess(false);
            toast.error('Error submitting bet. Please try again.');
            console.error('Error submitting bet:', error);
        }
        finally {
            setLoading(false);
        }
    };

    const handleOkayClick = () => {
        setSuccess(null);
        setApiMessage('');
    };

    const handleNotEnoughPointsOkayClick = () => {
        setNotEnoughPoints(false);
    };

    const handleJoinTelegram = () => {
        const telegramLink = initialAppData?.appData?.telegram_link;
        if (telegramLink) {
            // Open Telegram link in new window
            window.open(telegramLink, '_blank');
            // Mark as joined so we never show this again
            localStorage.setItem('hasJoinedTelegram', 'true');
            setShowTelegram(false);
        }
    };

    return (
        <>
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <BeatLoader color={"#fff"} />
                </div>
            )}
            {show && !loading && !notEnoughPoints && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-[#eeeeee] w-full max-w-md mx-4 rounded-lg h-[90vh] overflow-auto">
                        <div className='w-full text-center bg-primary p-1'>
                            <h2 className="text-lg text-[#fff] font-normal">{gameType} - {new Date().toLocaleDateString('en-GB')}</h2>
                        </div>
                        <div className='p-2'>
                            <div className="w-full flex justify-between items-center text-center text-[14px] border-none">
                                <p className="py-1 border-none font-semibold">Digit</p>
                                <p className="py-1 border-none font-semibold">Balance</p>
                                <p className="py-1 border-none font-semibold">Type</p>
                                {data.some(item => item.gameType) && (
                                    <p className="py-1 border-none font-semibold">Game</p>
                                )}
                            </div>
                            <div className='h-[calc(100vh-420px)] overflow-scroll'>
                                {data.map(({ pair, value, type, gameType }, index) => (
                                    <div key={index} className="w-full flex justify-between items-center text-center text-[14px] bg-white my-1 px-1">
                                        <div className="py-2 border-none">{pair}</div>
                                        <div className="py-2 border-none">{value}</div>
                                        <div className="py-2 border-none">{type || "null"}</div>
                                        {data.some(item => item.gameType) && (
                                            <div className="py-2 border-none font-semibold text-blue-600">{gameType || "-"}</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mb-4 p-2">
                            <div className='flex justify-between items-center w-full bg-[#fff] p-1'>
                                <div className="flex justify-between py-1 gap-2">
                                    <span className='text-[14px] font-semibold'>Total Bids: </span>
                                    <span className='text-[14px]'>{totalBids}</span>
                                </div>
                                <div className="flex justify-between py-2 gap-2">
                                    <span className='text-[14px] font-semibold'>Total Bids Amount: </span>
                                    <span className='text-[14px]'>{totalBidAmount}</span>
                                </div>
                            </div>
                            <div className='w-full bg-[#fff] p-1 mt-1'>
                                <p className='font-semibold'>Balance</p>
                                <div className='flex justify-between items-center'>
                                    <div className="flex justify-between py-2">
                                        <span className='text-[14px] font-semibold'>Before Deduction: </span>
                                        <span className='text-[14px]'>{walletBalanceBefore}</span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className='text-[14px] font-semibold'>After Deduction: </span>
                                        <span className='text-[14px]'>{walletBalanceAfter}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="text-red-600 text-center mb-4 text-[14px]">
                            *Note: Bid Once Played cannot be cancelled
                        </div>
                        <div className="flex justify-between p-2">
                            <button className="w-full p-2 bg-red-600 text-white rounded mr-2" onClick={onClose} disabled={loading}>
                                {loading ? 'Cancelling...' : 'Cancel'}
                            </button>
                            <button className="w-full p-2 bg-green-600 text-white rounded ml-2" onClick={handleSubmit} disabled={loading}>
                                {loading ? 'Submitting...' : 'Submit Bet'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <ResponseDialog
                isOpen={success !== null}
                isSuccess={success}
                message={apiMessage}
                onClose={handleOkayClick}
                showTelegram={success && showTelegram}
                telegramLink={initialAppData?.appData?.telegram_link}
            />
            <ResponseDialog
                isOpen={notEnoughPoints}
                isSuccess={false}
                message="You don't have enough points for this bet."
                onClose={handleNotEnoughPointsOkayClick}
            />
        </>
    );
};

export default Submit_Bet_Popup;
