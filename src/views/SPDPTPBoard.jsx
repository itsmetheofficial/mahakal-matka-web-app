import React, { useState } from 'react';
import GameHeader from '../components/GameHeader';
import Popup from '../components/Submit_Bet_Popup';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

// Single Pana filter
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

// Double Pana filter
const filterDoublePanaByRemainder = (remainder) => {
    return Array.from({ length: 900 }, (_, index) => index + 100)
        .filter(num => {
            const digits = num.toString().split('').map(Number);
            const sumOfDigits = digits.reduce((acc, curr) => acc + curr, 0);
            const isAscending = digits[2] === 0
                ? digits[0] <= digits[1]
                : digits[0] <= digits[1] && digits[1] <= digits[2];
            const hasRepeatedDigit = new Set(digits).size !== digits.length;
            const allSameDigit = new Set(digits).size === 1;
            return (sumOfDigits % 10 === remainder && isAscending && hasRepeatedDigit && !allSameDigit) || (num % 100 === 0);
        })
        .map(num => num.toString());
};

// Triple Pana filter - all triple panas where sum ends with remainder
const filterTriplePanaByRemainder = (remainder) => {
    const triplePanas = ['000', '111', '222', '333', '444', '555', '666', '777', '888', '999'];
    return triplePanas.filter(pana => {
        const digits = pana.split('').map(Number);
        const sum = digits.reduce((acc, curr) => acc + curr, 0);
        return sum % 10 === remainder;
    });
};

const SPDPTPBoard = () => {
    const [selectedOption, setSelectedOption] = useState('close');
    const [digit, setDigit] = useState('');
    const [points, setPoints] = useState('');
    const [checkedTypes, setCheckedTypes] = useState({
        SP: false,
        DP: false,
        TP: false
    });
    const [bids, setBids] = useState([]);
    const [showPopup, setShowPopup] = useState(false);

    let { appData } = useSelector(
        (state) => state.appData
    );

    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleDigitChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value) && value.length <= 1) {
            setDigit(value);
        }
    };

    const handlePointsChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setPoints(value);
        }
    };

    const handleCheckboxChange = (type) => {
        setCheckedTypes(prev => ({
            ...prev,
            [type]: !prev[type]
        }));
    };

    const handleAddBid = () => {
        // Validation
        if (!digit || digit === '') {
            toast.error('Please enter a digit (0-9)');
            return;
        }
        if (!points || parseInt(points) <= 0) {
            toast.error('Please enter a valid points amount');
            return;
        }
        if (!checkedTypes.SP && !checkedTypes.DP && !checkedTypes.TP) {
            toast.error('Please select at least one game type (SP, DP, or TP)');
            return;
        }
        if (appData?.appData?.min_bid_amount && parseInt(points) < appData.appData.min_bid_amount) {
            toast.error(`Points cannot be less than ${appData.appData.min_bid_amount}!`);
            return;
        }

        const digitNum = parseInt(digit);
        const newBids = [];

        // Generate Single Pana bids
        if (checkedTypes.SP) {
            const singlePanas = filterSinglePanaByRemainder(digitNum);
            singlePanas.forEach(pana => {
                newBids.push({
                    pair: pana,
                    value: points,
                    type: selectedOption,
                    gameType: 'SP',
                    gameTypeId: 3 // Single Pana game type ID
                });
            });
        }

        // Generate Double Pana bids
        if (checkedTypes.DP) {
            const doublePanas = filterDoublePanaByRemainder(digitNum);
            doublePanas.forEach(pana => {
                newBids.push({
                    pair: pana,
                    value: points,
                    type: selectedOption,
                    gameType: 'DP',
                    gameTypeId: 4 // Double Pana game type ID
                });
            });
        }

        // Generate Triple Pana bids
        if (checkedTypes.TP) {
            const triplePanas = filterTriplePanaByRemainder(digitNum);
            triplePanas.forEach(pana => {
                newBids.push({
                    pair: pana,
                    value: points,
                    type: selectedOption,
                    gameType: 'TP',
                    gameTypeId: 5 // Triple Pana game type ID
                });
            });
        }

        if (newBids.length === 0) {
            toast.error('No panas generated for the selected digit and game types');
            return;
        }

        setBids([...bids, ...newBids]);
        // Clear inputs after adding
        setDigit('');
        setPoints('');
        toast.success(`Added ${newBids.length} bid(s)`);
    };

    const handleDeleteBid = (index) => {
        const newBids = [...bids];
        newBids.splice(index, 1);
        setBids(newBids);
    };

    const _checkMinBid = (minBid, allbids) => {
        let check = allbids?.find((bid) => parseInt(bid?.value) < minBid)
        return check !== undefined;
    }

    const handleSubmit = () => {
        if (bids.length === 0) {
            toast.error('No records to submit.');
            return;
        }
        else if (appData?.appData?.min_bid_amount && bids?.length > 0 && _checkMinBid(appData.appData.min_bid_amount, bids)) {
            toast.error(`Bid amount cannot be less than ${appData.appData.min_bid_amount}!`);
            return;
        }
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    const totalBids = bids.length;
    const totalPoints = bids.reduce((sum, bid) => sum + parseInt(bid.value || 0), 0);

    return (
        <div className="min-h-screen flex flex-col justify-between">
            <div className="flex-grow">
                <GameHeader dropdown={true} selectedOption={selectedOption} onSelectChange={handleSelectChange} />

                <div className='w-[92%] mx-auto mt-28'>
                    {/* Input Section */}
                    <div className='bg-white p-2 rounded shadow mb-3'>
                        <div className='flex gap-2 mb-2'>
                            <div className='flex-1'>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    className='border p-2 text-[14px] w-full h-[38px] rounded bg-slate-100 outline-none text-center'
                                    placeholder="Digit"
                                    value={digit}
                                    onChange={handleDigitChange}
                                    maxLength="1"
                                />
                            </div>
                            <div className='flex-1'>
                                <input
                                    type="number"
                                    inputMode="numeric"
                                    className='border p-2 text-[14px] w-full h-[38px] rounded bg-slate-100 outline-none text-center'
                                    placeholder="Points"
                                    value={points}
                                    onChange={handlePointsChange}
                                />
                            </div>
                        </div>

                        {/* Checkboxes */}
                        <div className='flex justify-around mb-2'>
                            <label className='flex items-center gap-1.5 cursor-pointer'>
                                <input
                                    type="checkbox"
                                    checked={checkedTypes.SP}
                                    onChange={() => handleCheckboxChange('SP')}
                                    className='w-4 h-4 cursor-pointer'
                                />
                                <span className='font-semibold text-sm'>SP</span>
                            </label>
                            <label className='flex items-center gap-1.5 cursor-pointer'>
                                <input
                                    type="checkbox"
                                    checked={checkedTypes.DP}
                                    onChange={() => handleCheckboxChange('DP')}
                                    className='w-4 h-4 cursor-pointer'
                                />
                                <span className='font-semibold text-sm'>DP</span>
                            </label>
                            <label className='flex items-center gap-1.5 cursor-pointer'>
                                <input
                                    type="checkbox"
                                    checked={checkedTypes.TP}
                                    onChange={() => handleCheckboxChange('TP')}
                                    className='w-4 h-4 cursor-pointer'
                                />
                                <span className='font-semibold text-sm'>TP</span>
                            </label>
                        </div>

                        <button
                            onClick={handleAddBid}
                            className='w-full p-2 bg-[#3949ab] text-white rounded font-semibold text-sm shadow hover:bg-[#2c3a8f] transition-colors'
                        >
                            ADD BID
                        </button>
                    </div>

                    {/* Bids List */}
                    {bids.length > 0 && (
                        <div className='bg-white rounded-lg shadow-md mb-28'>
                            {/* Headers */}
                            <div className='grid grid-cols-[1fr_1fr_1fr_auto] gap-2 p-3 pb-2 border-b border-gray-200 items-center'>
                                <div className='text-sm font-semibold text-gray-700'>Pana</div>
                                <div className='text-sm font-semibold text-gray-700'>Points</div>
                                <div className='text-sm font-semibold text-gray-700'>Game Type</div>
                                <div className='w-10'></div>
                            </div>

                            {/* Bids List */}
                            <div className='max-h-[400px] overflow-y-auto p-2'>
                                {bids.map((bid, index) => (
                                    <div key={index} className='grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center bg-gray-50 p-2.5 rounded mb-2'>
                                        <span className='text-base font-semibold text-gray-700'>{bid.pair}</span>
                                        <span className='text-base text-gray-700'>{bid.value}</span>
                                        <span className='text-sm font-semibold text-blue-600'>{bid.gameType}</span>
                                        <button
                                            onClick={() => handleDeleteBid(index)}
                                            className='bg-[#3949ab] text-white rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold'
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Bar */}
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

            <Popup show={showPopup} data={bids} onClose={closePopup} onSubmitted={() => {
                setBids([]);
                setDigit('');
                setPoints('');
                setCheckedTypes({ SP: false, DP: false, TP: false });
            }} />
        </div>
    );
}

export default SPDPTPBoard;

