import React from "react";

const AmountSelector = ({ placeholder, minAmount, onChange, value, setPaymentMethodModal, addBalanceMethod, appData, user }) => {
  // Different price lists for deposit and withdraw
  const isWithdraw = placeholder === "Withdraw Amount";
  const depositPriceList = [minAmount, 200, 300, 500, 1000, 2000, 5000, 10000, 20000];
  const withdrawPriceList = [minAmount, 1000, 5000];

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
        <div className="mb-3 p-2.5 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-primary rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-5 h-5 text-primary"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3"
                />
              </svg>
              <div>
                <p className="text-[11px] text-gray-600 font-medium leading-tight">
                  {appData?.enable_withdrawabale_balance_condition
                    ? "Available for Withdrawal"
                    : "Wallet Balance"}
                </p>
                <p className="text-[10px] text-gray-500 leading-tight">
                  {appData?.enable_withdrawabale_balance_condition
                    ? "(निकासी के लिए उपलब्ध)"
                    : "(वॉलेट बैलेंस)"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-primary">
                ₹{appData?.enable_withdrawabale_balance_condition
                  ? (user?.withdrawable_balance ? parseFloat(user?.withdrawable_balance).toFixed(2) : "0.00")
                  : (user?.balance ? parseFloat(user?.balance).toFixed(2) : "0.00")}
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="relative w-full">
        <input
          type="number"
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
                appData?.self_recharge_bonus ?
                  <span className="absolute top-0 right-0 text-[10px] font-normal bg-primary text-white leading-none py-[2px] px-1 rounded">
                    +{appData?.self_recharge_bonus > 0 ? parseFloat(appData?.self_recharge_bonus).toFixed(1) : 0}%
                  </span>
                  : null
              }
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AmountSelector;
