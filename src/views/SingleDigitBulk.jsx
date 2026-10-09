import React, { useState } from 'react';
import GameHeader from '../components/GameHeader';
import Popup from '../components/Submit_Bet_Popup';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const SingleDigitBulk = () => {
    const [selectedOption, setSelectedOption] = useState('close');
    const [amountPerClick, setAmountPerClick] = useState('');
    const [digitAmounts, setDigitAmounts] = useState(Array(10).fill(0));
    const [showPopup, setShowPopup] = useState(false);

    let { appData } = useSelector(
        (state) => state.appData
    );

    const digitPairs = Array.from({ length: 10 }, (_, index) => index);
    const mainDigits = [1, 2, 3, 4, 5, 6, 7, 8, 9]; // 1-9 for the grid

    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleAmountChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setAmountPerClick(value);
        }
    };

    const handleDigitClick = (index) => {
        if (!amountPerClick || parseInt(amountPerClick) === 0) {
            toast.error('Please enter an amount first!');
            return;
        }

        if (appData?.appData?.min_bid_amount && parseInt(amountPerClick) < appData.appData.min_bid_amount) {
            toast.error(`Amount cannot be less than ${appData.appData.min_bid_amount}!`);
            return;
        }

        const newAmounts = [...digitAmounts];
        newAmounts[index] = newAmounts[index] + parseInt(amountPerClick);
        setDigitAmounts(newAmounts);
    };

    const _checkMinBid = (minBid, allbids) => {
        let check = allbids?.find((bid) => parseInt(bid?.value) < minBid)
        return check !== undefined;
    }

    const handleContinue = () => {
        if (dataToShow.length === 0) {
            toast.error('No records to submit.');
            return;
        }
        else if (appData?.appData?.min_bid_amount && dataToShow?.length > 0 && _checkMinBid(appData.appData.min_bid_amount, dataToShow)) {
            toast.error(`Bid amount cannot be less than ${appData.appData.min_bid_amount}!`);
            return;
        }
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    const resetBids = () => {
        setDigitAmounts(Array(10).fill(0));
        setAmountPerClick('');
    };

    // Filter out digits with zero amounts
    const dataToShow = digitPairs
        .map((pair, index) => ({
            pair,
            value: digitAmounts[index] > 0 ? digitAmounts[index].toString() : 'N/A',
            type: selectedOption
        }))
        .filter(item => item.value !== 'N/A');

    const totalBids = dataToShow.length;
    const totalPoints = digitAmounts.reduce((sum, amount) => sum + amount, 0);

    return (
        <div className="min-h-screen flex flex-col justify-between">
            <div className="flex-grow">
                <GameHeader dropdown={true} selectedOption={selectedOption} onSelectChange={handleSelectChange} />

                <div className='w-[92%] mx-auto mt-28'>
                    {/* Amount Input Section */}
                    <div className='bg-white p-2 rounded shadow mb-3'>
                        <input
                            type="number"
                            inputMode="numeric"
                            className='border p-2 text-[14px] w-full h-[40px] rounded bg-slate-100 outline-none text-center'
                            placeholder="Enter amount"
                            value={amountPerClick}
                            onChange={handleAmountChange}
                        />
                    </div>

                    {/* Digit Grid (1-9) */}
                    <div className='grid grid-cols-3 gap-3 mb-3'>
                        {mainDigits.map((digit) => (
                            <button
                                key={digit}
                                onClick={() => handleDigitClick(digit)}
                                className='relative bg-white shadow rounded p-3 h-[70px] flex items-center justify-center active:scale-95'
                            >
                                <span className='text-2xl font-semibold text-gray-700'>{digit}</span>
                                {digitAmounts[digit] > 0 && (
                                    <div className='absolute top-0.5 right-0.5 bg-[#e4ae39] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[24px] text-center'>
                                        {digitAmounts[digit]}
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Single 0 Button */}
                    <div className='flex justify-center mb-3'>
                        <button
                            onClick={() => handleDigitClick(0)}
                            className='relative bg-white shadow rounded p-3 w-[100px] h-[70px] flex items-center justify-center active:scale-95'
                        >
                            <span className='text-2xl font-semibold text-gray-700'>0</span>
                            {digitAmounts[0] > 0 && (
                                <div className='absolute top-0.5 right-0.5 bg-[#e4ae39] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[24px] text-center'>
                                    {digitAmounts[0]}
                                </div>
                            )}
                        </button>
                    </div>

                    <br /><br /><br />
                </div>
            </div>

            {/* Bottom Summary and Continue Button */}
            <div className='w-[480px] max-w-full mx-auto fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-10'>
                <div className='px-4 py-3'>
                    <div className='flex justify-between items-center mb-2'>
                        <span className='text-sm text-gray-600'>
                            <span className='font-bold text-gray-800'>{totalBids}</span> Bids
                        </span>
                        <span className='text-sm text-gray-600'>
                            <span className='font-bold text-gray-800'>{totalPoints}</span> Points
                        </span>
                    </div>
                    <button
                        className='w-full p-2.5 bg-[#e4ae39] text-white rounded font-semibold shadow hover:bg-[#d49d2d] transition-colors'
                        onClick={handleContinue}
                    >
                        Continue
                    </button>
                </div>
            </div>

            <Popup
                show={showPopup}
                data={dataToShow}
                onClose={closePopup}
                onSubmitted={resetBids}
            />
        </div>
    );
}

export default SingleDigitBulk;

