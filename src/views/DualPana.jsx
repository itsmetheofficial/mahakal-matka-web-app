import React, { useState } from 'react';
import GameHeader from '../components/GameHeader';
import Popup from '../components/Submit_Bet_Popup';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const filterDoublePanaByRemainder = (remainder) => {
  return Array.from({ length: 900 }, (_, index) => index + 100)
    .filter(num => {
      const digits = num.toString().split('').map(Number);
      const sumOfDigits = digits.reduce((acc, curr) => acc + curr, 0);
      const isAscending = digits[2] === 0
        ? digits[0] <= digits[1]
        : digits[0] <= digits[1] && digits[1] <= digits[2];
      const hasRepeatedDigit = new Set(digits).size !== digits.length;
      const allSameDigit = new Set(digits).size === 1; // Checks if all digits are the same
      return (sumOfDigits % 10 === remainder && isAscending && hasRepeatedDigit && !allSameDigit) || (num % 100 === 0);
    })
    .map(num => num.toString());
};

const DualPana = () => {
  const [selectedOption, setSelectedOption] = useState('close');
  const [inputValues, setInputValues] = useState({});
  const [showPopup, setShowPopup] = useState(false);

  let { appData } = useSelector(
    (state) => state.appData
  );

  // Handle input change to allow multiple digits and numeric values
  const handleInputChange = (e, key) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) { // Allows only numeric values
      setInputValues(prevValues => ({ ...prevValues, [key]: value }));
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

  // Prepare data to show in the popup, excluding pairs with empty values
  const dataToShow = [...Array(10).keys()]
    .flatMap(remainder =>
      filterDoublePanaByRemainder(remainder).map(pair => ({
        pair,
        value: inputValues[`${remainder}-${pair}`] || 'N/A',
        type: selectedOption
      }))
    )
    .filter(item => item.value !== 'N/A');

  const totalBids = dataToShow.length;
  const totalPoints = dataToShow.reduce((sum, item) => sum + parseInt(item.value || 0), 0);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div className="flex-grow">
        <GameHeader dropdown={true} selectedOption={selectedOption} onSelectChange={handleSelectChange} />
        <div className='w-[100%] m-auto h-full shadow-inner p-2 mt-20 pb-28'>
          {[...Array(10).keys()].map(remainder => (
            <div key={remainder}>
              <div className='border-t border-black/30 shadow-md py-1 text-center my-4 ml-4 text-black'>{remainder}</div>
              <div className='grid grid-cols-2 gap-4 w-[92%] m-auto'>
                {filterDoublePanaByRemainder(remainder).map(pair => (
                  <div key={pair} className='flex items-center justify-start'>
                    <div className='text-[18px] font-semibold bg-[#e4ae39] w-[50px] h-[40px] flex justify-center items-center text-[#fff]'>{pair}</div>
                    <input
                      type="number"
                      inputMode="numeric"
                      className='border p-2 text-[14px] w-full border-none bg-slate-200 h-[40px] text-center outline-none'
                      maxLength="2"
                      placeholder="Enter Amount"
                      onChange={(e) => handleInputChange(e, `${remainder}-${pair}`)}
                      value={inputValues[`${remainder}-${pair}`] || ''}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
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

      <Popup show={showPopup} data={dataToShow} onClose={closePopup} onSubmitted={() => { setInputValues({}) }} />
    </div>
  );
}

export default DualPana;
