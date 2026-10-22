import React from "react";
import { walletAmounts, money } from '../utils/wallet';

const AmountSelector = ({ placeholder, minAmount, onChange, value, setPaymentMethodModal, addBalanceMethod, appData, rechargeOffers, user }) => {
  // Different price lists for deposit and withdraw
  const isWithdraw = placeholder === "Withdraw Amount";
  const depositPriceList = Array.isArray(appData?.deposit_amounts)
    ? [...new Set(appData.deposit_amounts.map(Number))].filter(amount => Number.isFinite(amount) && amount > 0 && amount >= Number(minAmount || 0))
    : [];
  const withdrawPriceList = [minAmount, 1000, 5000];

  const selfOffer = rechargeOffers?.self;
  const fixedOffers = rechargeOffers?.fixed || [];
  const number = amount => Number(amount).toLocaleString('en-IN', { maximumFractionDigits: 2 });
  const rewardFor = amount => {
    const paise = Math.round(Number(amount) * 100);
    const percentage = selfOffer?.eligible && Number(amount) >= Number(selfOffer.minimum)
      ? Math.floor((paise * Math.round(Number(selfOffer.percentage) * 100) + 5000) / 10000) : 0;
    const fixed = fixedOffers.find(offer => Math.round(Number(offer.amount) * 100) === paise);
    return (percentage + Math.round(Number(fixed?.bonus || 0) * 100)) / 100;
  };
  let priceList = isWithdraw ? withdrawPriceList : depositPriceList;

  const _openMethodModal = () => {
    if (setPaymentMethodModal) {
      setPaymentMethodModal(true)
    } else {
      return;
    }
  }
  return (
    <div className="p-3">
      {isWithdraw && (
        <div className="mb-3 flex items-center justify-between gap-3 rounded-lg border-2 border-primary bg-gradient-to-r from-green-50 to-blue-50 p-2.5 shadow-md">
          <div className="flex min-w-0 items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5 shrink-0 text-primary" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h16a2 2 0 0 1 2 2v10H5a2 2 0 0 1-2-2V7Zm0 0V5a2 2 0 0 1 2-2h12v4m4 5h-5v4h5" />
            </svg>
            <div>
              <p className="text-[11px] font-medium leading-tight text-gray-600">Cash available to withdraw</p>
              <p className="text-[10px] leading-tight text-gray-500">(केवल नकद राशि · बोनस नहीं)</p>
            </div>
          </div>
          <p className="shrink-0 text-xl font-bold text-primary">₹{money(walletAmounts(user).cash)}</p>
        </div>
      )}
      <div className="relative w-full">
        <input
          type="number"
          inputMode="numeric"
          className="w-full p-2 px-4 pl-10 text-sm border border-black/30 rounded-3xl"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        ></input>
        <div className="absolute flex items-center justify-center w-8 h-8 text-white -translate-y-1/2 rounded-full top-1/2 left-1 bg-primary">

          {
            addBalanceMethod === "upi" ?
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80" width="200" height="80" style={{ cursor: setPaymentMethodModal ? "pointer" : "default" }}
                onClick={_openMethodModal}>
                <text x="38" y="68" font-family="Arial, sans-serif" font-size="65" font-weight="bold" fill="white">U</text>
                <text x="90" y="68" font-family="Arial, sans-serif" font-size="65" font-weight="bold" fill="white">P</text>
                <text x="138" y="68" font-family="Arial, sans-serif" font-size="65" font-weight="bold" fill="white">I</text>
              </svg>
              :
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
                style={{ cursor: setPaymentMethodModal ? "pointer" : "default" }}
                onClick={_openMethodModal}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z"
                />
              </svg>
          }
        </div>
      </div>
      {!isWithdraw && (
        <div className="grid grid-cols-3 gap-3 mt-3">
          {priceList.map((price, index) => (
            <button
              key={index}
              type="button"
              onClick={() => onChange(price)}
              className="flex relative items-center justify-center p-2 text-sm font-semibold bg-white border rounded-md shadow-md border-black/200"
            >
              {price}
              {
                rewardFor(price) > 0 ?
                  <span className="absolute top-0 right-0 text-[10px] font-normal bg-primary text-white leading-none py-[2px] px-1 rounded">
                    +{number(rewardFor(price) / Number(price) * 100)}%
                  </span>
                  : null
              }
            </button>
          ))}
        </div>
      )}
      {!isWithdraw && (selfOffer?.eligible || fixedOffers.length > 0) && (
        <div className="mt-3 space-y-1 text-center text-xs text-primary">
          {selfOffer?.eligible && <p>रिचार्ज पर {number(selfOffer.percentage)}% बोनस · {selfOffer.first_only ? 'सिर्फ पहले सफल रिचार्ज पर' : 'हर सफल रिचार्ज पर'}{Number(selfOffer.minimum) > 0 ? ` · न्यूनतम ₹${number(selfOffer.minimum)}` : ''}</p>}
          {fixedOffers.length > 0 && <p>{fixedOffers.map(offer => `₹${number(offer.amount)} पर ₹${number(offer.bonus)} बोनस`).join(' · ')} · हर बार</p>}
          {Number(value) > 0 && rewardFor(value) > 0 && <p className="font-semibold">इस रिचार्ज पर ₹{number(rewardFor(value))} बोनस</p>}
        </div>
      )}
    </div>
  );
};

export default AmountSelector;
