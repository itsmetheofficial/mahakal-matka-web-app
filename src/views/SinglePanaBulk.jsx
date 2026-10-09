import React, { useState } from 'react';
import GameHeader from '../components/GameHeader';
import Popup from '../components/Submit_Bet_Popup';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const filterSinglePanaByRemainder = (remainder) => {
    return Array.from({ length: 900 }, (_, index) => index + 100)
        .filter(num => {
            const digits = num.toString().split('').map(Number);
            const sumOfDigits = digits.reduce((acc, curr) => acc + curr, 0);
            const isAscending = digits[2] === 0
                ? digits[0] <= digits[1]
                : digits[0] <= digits[1] && digits[1] <= digits[2];
            const allDigitsUnique = new Set(digits).size === digits.length;
            return sumOfDigits % 10 === remainder && isAscending && allDigitsUnique;
        })
        .map(num => num.toString());
};

const SinglePanaBulk = () => {
    const [selectedOption, setSelectedOption] = useState('close');
    const [amountPerClick, setAmountPerClick] = useState('');
    const [digitAmounts, setDigitAmounts] = useState(Array(10).fill(0)); // Track amount for each digit 0-9
    const [excludedPanas, setExcludedPanas] = useState([]); // Track individually deleted panas
    const [showPopup, setShowPopup] = useState(false);

    let { appData } = useSelector(
        (state) => state.appData
    );

    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleAmountChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setAmountPerClick(value);
        }
    };

    const handleDigitClick = (digit) => {
        if (!amountPerClick || parseInt(amountPerClick) <= 0) {
            toast.error('Please enter a valid amount first');
            return;
        }

        const newDigitAmounts = [...digitAmounts];
        newDigitAmounts[digit] += parseInt(amountPerClick);
        setDigitAmounts(newDigitAmounts);
    };

    const handleDeletePana = (pana) => {
        // Add this pana to excluded list
        setExcludedPanas([...excludedPanas, pana]);
    };

    const _checkMinBid = (minBid, allbids) => {
        let check = allbids?.find((bid) => parseInt(bid?.value) < minBid)
        return check !== undefined;
    }

    const handleSubmit = () => {
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

    // Prepare data to show in the popup - all panas for digits with amounts > 0, excluding deleted ones
    const dataToShow = [...Array(10).keys()]
        .filter(digit => digitAmounts[digit] > 0)
        .flatMap(digit =>
            filterSinglePanaByRemainder(digit)
                .filter(pana => !excludedPanas.includes(pana)) // Exclude deleted panas
                .map(pana => ({
                    pair: pana,
                    value: digitAmounts[digit],
                    type: selectedOption
                }))
        );

    const totalBids = dataToShow.length;
    const totalPoints = dataToShow.reduce((sum, item) => sum + parseInt(item.value || 0), 0);

    const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]; // All 10 digits in order for 5x2 grid

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

                    {/* Digit Grid - 5 columns (1-5, 6-0) */}
                    <div className='grid grid-cols-5 gap-2 mb-3'>
                        {digits.map((digit) => (
                            <button
                                key={digit}
                                onClick={() => handleDigitClick(digit)}
                                className='bg-white shadow-sm rounded p-2 h-[50px] flex items-center justify-center active:scale-95'
                            >
                                <span className='text-xl font-bold text-gray-700'>{digit}</span>
                            </button>
                        ))}
                    </div>

                    {/* Show individual panas when digits are selected */}
                    {digitAmounts.some(amount => amount > 0) && (
                        <div className='bg-white rounded-lg shadow-md mt-3 mb-20'>
                            {/* Headers */}
                            <div className='grid grid-cols-[1fr_1fr_1fr_auto] gap-2 p-3 pb-2 border-b border-gray-200 items-center'>
                                <div className='text-sm font-semibold text-gray-700'>Pana</div>
                                <div className='text-sm font-semibold text-gray-700'>Points</div>
                                <div className='text-sm font-semibold text-gray-700'>Game Type</div>
                                <div className='w-10'></div>
                            </div>

                            {/* Pana List */}
                            <div className='max-h-[350px] overflow-y-auto p-2'>
                                {digitAmounts.map((amount, digit) => {
                                    if (amount > 0) {
                                        const panas = filterSinglePanaByRemainder(digit).filter(pana => !excludedPanas.includes(pana));
                                        return panas.map((pana) => (
                                            <div key={`${digit}-${pana}`} className='grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center bg-gray-50 p-2.5 rounded mb-2'>
                                                <span className='text-base font-semibold text-gray-700'>{pana}</span>
                                                <span className='text-base text-gray-700'>{amount}</span>
                                                <span className='text-sm text-gray-600 capitalize'>{selectedOption}</span>
                                                <button
                                                    onClick={() => handleDeletePana(pana)}
                                                    className='bg-[#3949ab] text-white rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold'
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ));
                                    }
                                    return null;
                                })}
                            </div>
                        </div>
                    )}

                    <br /><br /><br />
                </div>
            </div>

            {/* Bottom Bar - Compact version */}
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
                        onClick={handleSubmit}
                    >
                        Continue
                    </button>
                </div>
            </div>

            <Popup show={showPopup} data={dataToShow} onClose={closePopup} onSubmitted={() => {
                setDigitAmounts(Array(10).fill(0));
                setExcludedPanas([]);
                setAmountPerClick('');
            }} />
        </div>
    );
}

export default SinglePanaBulk;

