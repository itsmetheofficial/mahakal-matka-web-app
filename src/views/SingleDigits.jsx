import React, { useState } from 'react';
import GameHeader from '../components/GameHeader';
import Popup from '../components/Submit_Bet_Popup';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const SingleDigits = () => {
  const [selectedOption, setSelectedOption] = useState('close');
  const [inputValues, setInputValues] = useState(Array(10).fill(''));
  const [showPopup, setShowPopup] = useState(false);

  let { appData } = useSelector(
    (state) => state.appData
  );

  const digitPairs = Array.from({ length: 10 }, (_, index) => index);

  // Handle input change to allow multiple digits and numeric values
  const handleInputChange = (e, index) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) { // Allows only numeric values
      const newValues = [...inputValues];
      newValues[index] = value;
      setInputValues(newValues);
    }
  };

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
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

  // Filter out pairs with empty values
  const dataToShow = digitPairs
    .map((pair, index) => ({
      pair,
      value: inputValues[index] || 'N/A',
      type: selectedOption
    }))
    .filter(item => item.value !== 'N/A');

  const totalBids = dataToShow.length;
  const totalPoints = dataToShow.reduce((sum, item) => sum + parseInt(item.value || 0), 0);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div className="flex-grow">
        <GameHeader dropdown={true} selectedOption={selectedOption} onSelectChange={handleSelectChange} />
        <div className='grid grid-cols-2 gap-4 w-[92%] mx-auto mt-28'>
          {digitPairs.map((pair, index) => (
            <div key={pair} className='flex items-center justify-start'>
              <div className='text-[20px] font-semibold bg-[#e4ae39] w-[50px] h-[40px] flex justify-center items-center text-[#fff]'>{pair}</div>
              <input
                type="number"
                inputMode="numeric"
                className='border p-2 text-[14px] w-full border-none bg-slate-200 h-[40px] text-center outline-none'
                maxLength="10"
                placeholder="Enter Amount"
                onChange={(e) => handleInputChange(e, index)}
                value={inputValues[index]}
              />
            </div>
          ))}
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
            onClick={handleSubmit}
          >
            Continue
          </button>
        </div>
      </div>

      <Popup show={showPopup} data={dataToShow} onClose={closePopup} onSubmitted={() => setInputValues(new Array(10).fill(''))} />
    </div>
  );
}

export default SingleDigits;
