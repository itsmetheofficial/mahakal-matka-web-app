import React, { useContext, useEffect, useRef, useState } from "react";
import AmountSelector from "../components/AmountSelector";
import { Form, useLocation, useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import Logo from "../assets/imgs/Logo.png";
import { ModalContext } from '../context/ModalContext.js'
import {
    getDepositHistory,
    getWithdrawalHistory,
} from "../repository/HistoryRepository.js";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
    depositBalance,
    depositBalancePayFromUpi,
    depositBalancePaymentKaro,
    depositBalanceQRCode,
    transferBalance,
    withdrawBalance,
} from "../repository/BalanceRepository.js";
import Spinner from "../components/Spinner.jsx";
import Pagination from "../components/Pagination.jsx";
import { setAppData, setAuthDataUsersSingleValue } from "../store/features/appData/appDataSlice.js";
import QRCode from "react-qr-code";
import { getAppData } from "../repository/DataRepository.js";
import { ibrPayUPIPaymentUrl } from "../repository/PaymentRepository.js";
import NoDataFoundImage from "../assets/imgs/noDataFound.png";

const WalletHistoryTable = ({
    loading,
    data,
    currentPage,
    lastPage,
    setCurrentPage,
    perPageRecords,
    activeTab,
    onViewScreenshot
}) => {
    return (
        <>
            <div className="overflow-auto">

                <div className="px-3">
                    {
                        loading ? (
                            <div className="flex justify-center w-full p-4">
                                <div className="grid w-full place-items-center overflow-x-scroll rounded-lg lg:overflow-visible">
                                    <svg
                                        className="text-gray-300 animate-spin"
                                        viewBox="0 0 64 64"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                    >
                                        <path
                                            d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
                                            stroke="currentColor"
                                            strokeWidth="5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        ></path>
                                        <path
                                            d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
                                            stroke="currentColor"
                                            strokeWidth="5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="text-gray-600"
                                        ></path>
                                    </svg>
                                </div>
                            </div>
                        ) :
                            data?.length > 0 ?
                                data?.map((item, index) => (
                                    <div className="mb-4 rounded-xl overflow-hidden shadow-lg p-2 border border-black/30 " key={item?.id || index}>
                                        <div className="flex justify-between py-2">
                                            <div className="px-2 w-[65%]">
                                                <p className="text-sm text-[#000] font-medium">
                                                    {item?.created_at?.length ? moment(item?.created_at).format("Do MMM, YYYY") : "N/A"}
                                                </p>
                                                <p className="text-xs text-gray-600">
                                                    {item?.created_at?.length ? moment(item?.created_at).format("hh:mm A") : ""}
                                                </p>
                                            </div>
                                            <div className="px-2 w-[35^] flex justify-end items-center gap-1">
                                                {
                                                    item?.status === "pending" ? (
                                                        <span>⌛</span>
                                                    ) : item?.status === "ongoing" ? (
                                                        <span>🔄</span>
                                                    ) : item?.status === "pending_from_provider" ? (
                                                        <span>💸</span>
                                                    ) : item?.status === "success" ? (
                                                        <span>✅</span>
                                                    ) : item?.status === "failed" ? (
                                                        <span>❌</span>
                                                    ) : ""

                                                }
                                                {
                                                    item?.status === "pending" ? (
                                                        <span className="text-sm text-[#ffb300] font-semibold capitalize">{item?.status || "N/A"}</span>
                                                    ) : item?.status === "ongoing" ? (
                                                        <span className="text-sm text-blue-600 font-semibold capitalize">{item?.status || "N/A"}</span>
                                                    ) : item?.status === "pending_from_provider" ? (
                                                        <span className="text-sm text-[#9333ea] font-semibold capitalize">Processing</span>
                                                    ) : item?.status === "success" ? (
                                                        <span className="text-sm text-green-600 font-semibold capitalize">{item?.status || "N/A"}</span>
                                                    ) : item?.status === "failed" ? (
                                                        <span className="text-sm text-[#f50f0f] font-semibold capitalize">{item?.status || "N/A"}</span>
                                                    ) : ""

                                                }

                                            </div>
                                        </div>
                                        <div className="flex justify-between pb-2">
                                            <div className="px-2 w-full">
                                                <h5 className="text-lg text-[#000] font-bold">₹{item?.amount || "N/A"}</h5>
                                            </div>
                                        </div>
                                        {activeTab === "withdrawPoints" && item?.status && item?.status !== "failed" && (
                                            <div className={`px-2 py-2 mb-2 rounded-md ${item?.status === "success"
                                                ? "bg-green-50 border border-green-200"
                                                : "bg-blue-50 border border-blue-200"
                                                }`}>
                                                <p className={`text-sm text-center font-medium ${item?.status === "success" ? "text-green-800" : "text-blue-800"
                                                    }`}>
                                                    {item?.status === "pending" && (
                                                        <span>⌛ कृपया प्रतीक्षा करें, आपका request pending है।<br /><span className="text-xs">(Please wait, your request is pending)</span></span>
                                                    )}
                                                    {item?.status === "ongoing" && (
                                                        <span>🔄 आपका request approve हो गया है और जल्द ही भेजा जाएगा।<br /><span className="text-xs">(Your request is approved and will be sent soon)</span></span>
                                                    )}
                                                    {item?.status === "pending_from_provider" && (
                                                        <span>💸 आपका पैसा भेजा जा रहा है, कृपया थोड़ा इंतजार करें।<br /><span className="text-xs">(Your money is being transferred, please wait)</span></span>
                                                    )}
                                                    {item?.status === "success" && (
                                                        <span>✅ आपका withdrawal सफलतापूर्वक पूरा हो गया है।<br /><span className="text-xs">(Your withdrawal has been completed successfully)</span></span>
                                                    )}
                                                </p>
                                            </div>
                                        )}
                                        {activeTab === "withdrawPoints" && item?.status === "failed" && item?.failed_reason && (
                                            <div className="px-2 py-3 mb-2 bg-red-50 border-2 border-red-300 rounded-md">
                                                <h5 className="text-sm text-red-700 font-bold mb-1">❌ Failed Reason (विफल होने का कारण)</h5>
                                                <p className="text-sm text-red-600 font-medium">{item?.failed_reason}</p>
                                            </div>
                                        )}
                                        {activeTab === "withdrawPoints" && item?.status === "success" && item?.payment_ss_link && (
                                            <div className="flex justify-center border-t border-black py-2">
                                                <button
                                                    type="button"
                                                    onClick={() => onViewScreenshot(item?.payment_ss_link)}
                                                    className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-md transition"
                                                >
                                                    View Payment Screenshot
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))
                                :
                                <div className="w-full flex py-4 flex-col items-center gap-2">
                                    <img src={NoDataFoundImage} width={100} alt="" />
                                    <p className="text-gray-400 font-bold text-sm">No Data Found</p>

                                </div>
                    }

                </div>
            </div>
            {!loading && data.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    lastPage={lastPage}
                    onChange={setCurrentPage}
                />
            )}
        </>
    );
};

const Wallet = () => {
    const location = useLocation();
    const navigate = useNavigate();
    let { appData, user } = useSelector((state) => state.appData.appData);

    let [activeTab, setActiveTab] = useState("addPoints");
    let [isDepositModal, setDepositModal] = useState(false);
    let [paymentMethodModal, setPaymentMethodModal] = useState(false);
    let [bankAccountType, setBankAccountType] = useState("permanent");
    let [method, setMethod] = useState("bank");
    let [addBalanceMethod, setAddBalanceMethod] = useState("bank");
    let [addBalanceMethodData, setBalanceMethodData] = useState(null)
    let [withdrawLoading, setWithdrawLoading] = useState(false);
    let [depositLoading, setDepositLoading] = useState(false);
    let [qrCodeModalURL, setQRCodeModalURL] = useState(null);
    let [screenshotModalURL, setScreenshotModalURL] = useState(null);

    let defaultWithdrawDetails = localStorage.getItem("withdraw_details") ? JSON.parse(localStorage.getItem("withdraw_details")) : null;

    let [loading, setLoading] = useState(false);
    let [dataLoading, setDataLoading] = useState(true);

    let walletWithdrawForm = useRef(null);

    let [depositHistoryData, setDepositHistoryData] = useState([]);
    let [withdrawHistoryData, setWithdrawHistoryData] = useState([]);
    let [depositLastPage, setDepositLastPage] = useState(0);
    let [withdrawLastPage, setWithdrawLastPage] = useState(0);
    let [currentPage, setCurrentPage] = useState(1);
    const [accountIFSCCode, setAccountIFSCCode] = useState(defaultWithdrawDetails?.account_ifsc_code || "");


    let [depositAmount, setDepositAmount] = useState("");
    let [withdrawAmount, setWithdrawAmount] = useState("");

    let [perPageRecords, setPerPageRecords] = useState(10);

    let { toggleSuccessModalOpen, setSuccessMessage } = useContext(ModalContext)

    let dispatch = useDispatch();
    const storedUser = JSON.parse(localStorage.getItem("authUser")) || {};

    const currentUser = user?.phone ? user : storedUser;

    useEffect(() => {
        setMethod(
            appData.enable_upi_withdraw === 1
                ? "upi"
                : appData.enable_bank_withdraw === 1
                    ? "bank"
                    : ""
        );
    }, [appData]);

    const toggleDepositModal = () => {
        setDepositModal((prevState) => !prevState);
    };


    const _getDepositHistory = async (page) => {
        let { data } = await getDepositHistory({ page });
        if (data.error === false) {
            let {
                depositHistory: { data: depositHistoryData, last_page, per_page },
            } = data.response;
            setDepositHistoryData(depositHistoryData);
            setDepositLastPage(last_page);
            setPerPageRecords(per_page);
        } else {
            toast.error(data.message);
        }
    };

    const _getWithdrawHistory = async (page) => {
        let { data } = await getWithdrawalHistory({ page });
        if (data.error === false) {
            let {
                depositHistory: { data: depositHistoryData, per_page, last_page },
            } = data.response;
            depositHistoryData = depositHistoryData.map((dhd) => ({
                ...dhd,
                type: dhd.withdraw_mode,
            }));
            setWithdrawHistoryData(depositHistoryData);
            setWithdrawLastPage(last_page);
            setPerPageRecords(per_page);
        } else {
            toast.error(data.message);
        }
    };

    useEffect(() => {
        let getData = async () => {
            try {
                setDataLoading(true);
                await _getDepositHistory(currentPage);
                await _getWithdrawHistory(currentPage);

            } catch (err) {
                toast.error(err.message);
            } finally {
                setDataLoading(false);
            }
        };
        getData();
    }, [currentPage]);

    const onHandleTransferSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let phone = e.target["phone"].value;
            let amount = e.target["amount"].value;
            let { data } = await transferBalance({ phone, amount });
            if (data.error) {
                toast.error(data.message);
            } else {
                toast.success(data.message);
                let { response } = data;
                setDataLoading(true);
                await _getWithdrawHistory(currentPage);
                dispatch(
                    setAuthDataUsersSingleValue({
                        key: "balance",
                        value: response.balance_left,
                    })
                );
                toggleDepositModal();
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
            setDataLoading(false);
        }
    };

    const _addBalanceUPI = async (e) => {
        e.preventDefault();
        const upiId = e?.target?.upi_id?.value;
        if (upiId.trim()?.length > 0) {
            setBalanceMethodData({ upi: upiId });
            setPaymentMethodModal(false)
        }
        else {
            toast.error("Please enter a UPI ID.");
            e.target.upi_id.value = "";
            setBalanceMethodData({ upi: null });
        }
    }
    const _addBalanceBank = async (event) => {
        event.preventDefault();
        const formData = {
            bank_name: event.target.bank_name.value,
            account_holder_name: event.target.account_holder_name.value,
            account_number: event.target.account_number.value,
            account_ifsc_code: event.target.account_ifsc_code.value
        };
        setBalanceMethodData({ bank: formData });
    }


    const handleDepositSubmit = async (e) => {
        e.preventDefault();
        // if(addBalanceMethod==="upi"){
        //   if(addBalanceMethodData?.upi?.length>0){
        //     console.log("UPI ID : ",addBalanceMethodData?.upi)
        //   }
        //   else{
        //     setPaymentMethodModal(true);
        //     toast.error("Add a UPI ID first!")
        //   }
        // }

        // else{
        //   if(addBalanceMethodData?.bank){
        //     console.log("UPI ID : ",addBalanceMethodData?.bank)
        //   }
        //   else{
        //     setPaymentMethodModal(true);
        //     toast.error("Add bank details first!")
        //   }
        // }
        try {
            setDepositLoading(true);
            let payload = {
                amount: depositAmount,
            };
            let paymentMethod = appData?.payment_method
            if (paymentMethod === "auto") {
                let { data } = await depositBalance(payload);
                if (data.error) {
                    toast.error(data.message);
                } else {
                    navigate("/payment/?pageName=deposit" + "&pageUrl=" + data?.response?.payment_url);

                    dispatch(
                        setAuthDataUsersSingleValue({
                            key: "balance",
                            value: data.response.balance_left,
                        })
                    );
                }
            }
            else if (paymentMethod === "manual") {
                let baseDomain = appData?.base_domain;
                let url = `${baseDomain}/payment/${user?.id}/${payload?.amount}`
                navigate("/payment/?pageName=deposit" + "&pageUrl=" + url);
            } else if (paymentMethod === "ibr_pay") {
                let { data } = await ibrPayUPIPaymentUrl(payload);
                if (data.error) {
                    toast.error(data.message);
                } else {
                    setQRCodeModalURL(data?.response?.upiIntent)
                }
            } else if (paymentMethod === "payment_karo") {
                let { data } = await depositBalancePaymentKaro(payload);
                if (data.error) {
                    toast.error(data.message);
                } else {
                    navigate("/payment/?pageName=deposit" + "&pageUrl=" + data?.response?.payment_url);
                }
            } else if (paymentMethod === "pay_from_upi") {
                let { data } = await depositBalancePayFromUpi(payload);
                if (data.error) {
                    toast.error(data.message);
                } else {
                    navigate("/payment/?pageName=deposit" + "&pageUrl=" + data?.response?.payment_url);
                }
            }
            else {
                let { data } = await depositBalanceQRCode(payload);
                if (data.error) {
                    toast.error(data.message);
                } else {
                    setQRCodeModalURL(data?.response?.upiString)
                }
            }
            setDataLoading(true);
            await _getDepositHistory(currentPage);

            e.target.reset();

        } catch (err) {
            toast.error(err.message);
        } finally {
            setDepositLoading(false);
            setDataLoading(false);
        }
    };
    const handleWithdrawSubmit = async (e) => {
        let maximumWithdrawAmount = appData?.enable_withdrawabale_balance_condition
            ? (user?.withdrawable_balance ? parseFloat(user?.withdrawable_balance) : 0)
            : (user?.balance ? parseFloat(user?.balance) : 0);

        if (withdrawAmount > maximumWithdrawAmount) {
            toast.error("Can't withdraw more than ₹" + maximumWithdrawAmount.toFixed(2));
            e.preventDefault();
            return;
        }
        e.preventDefault();
        try {
            setWithdrawLoading(true);
            let payload = {
                mode: method,
                amount: withdrawAmount,
            };
            if (method === "upi") {
                let upiName = e.target["upi_name"].value;
                let upiId = e.target["upi_id"].value;
                payload = { ...payload, upiName, upiId };

            } else if (method === "bank") {
                let bankName = e.target["bank_name"].value;
                let accountHolderName = e.target["account_holder_name"].value;
                let accountNumber = e.target["account_number"].value;
                let accountIFSCCode = e.target["account_ifsc_code"].value;
                payload = {
                    ...payload,
                    bankName,
                    accountHolderName,
                    accountNumber,
                    accountIFSCCode,
                };
            }
            let { data } = await withdrawBalance(payload);
            if (data.error) {
                toast.error(data.message);
            } else {
                e.target.reset();
                let { response } = data;
                setDataLoading(true);
                toggleSuccessModalOpen();
                setSuccessMessage(data.message)
                await _getWithdrawHistory(currentPage);
                dispatch(
                    setAuthDataUsersSingleValue({
                        key: "balance",
                        value: response?.balance_left || 0,
                    })
                );
                dispatch(
                    setAuthDataUsersSingleValue({
                        key: "withdrawable_balance",
                        value: response?.withdrwabale_balance || 0,
                    })
                );

                if (data?.response?.withdrwabale_balance) {
                    localStorage.setItem("", JSON.stringify(data?.response?.withdrwabale_balance));
                }

                //also save the withdraw details
                localStorage.setItem("withdraw_details", JSON.stringify(response?.withdraw_details));
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setWithdrawLoading(false);
            setDataLoading(false)
        }
    };

    const toggleQRCodeModal = () => {
        setQRCodeModalURL(null)
    }

    const handleViewScreenshot = (url) => {
        setScreenshotModalURL(url);
    }

    const toggleScreenshotModal = () => {
        setScreenshotModalURL(null);
    }


    useEffect(() => {
        // Extract query params
        const queryParams = new URLSearchParams(location.search);
        const tab = queryParams.get("tab");

        // Set the active tab based on the query parameter
        if (tab) {
            setActiveTab(tab);
        }
    }, [location.search]); // Runs whenever the query string changes

    return (
        <>
            <Modal isOpen={qrCodeModalURL !== null} toggle={toggleQRCodeModal}>
                <div className="flex p-8 items-center flex-col">
                    {qrCodeModalURL !== null &&
                        <QRCode value={qrCodeModalURL} />
                    }
                    <button onClick={async () => {
                        toggleQRCodeModal();
                        // Update with balance api after 5sec
                        let { data } = await getAppData();
                        if (!data.error) {
                            dispatch(setAppData(data.response));
                        }
                    }} className="py-1 px-12 rounded-full bg-green-500 hover:bg-green-600 transition text-white mt-3">I have paid</button>

                </div>
            </Modal>
            <Modal isOpen={screenshotModalURL !== null} toggle={toggleScreenshotModal}>
                <div className="relative w-[90vw] md:max-w-[600px] mx-auto">
                    <div className="flex justify-between items-center p-3 bg-primary text-white">
                        <h3 className="text-lg font-semibold">Payment Screenshot</h3>
                        <button
                            type="button"
                            onClick={toggleScreenshotModal}
                            className="text-white hover:text-gray-200"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18 18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                    <div className="p-4 flex justify-center items-center bg-gray-100 overflow-hidden">
                        {screenshotModalURL && (
                            <img
                                src={screenshotModalURL}
                                alt="Payment Screenshot"
                                className="w-full h-auto max-h-[70vh] object-contain"
                            />
                        )}
                    </div>
                </div>
            </Modal>
            <div className="pb-8">
                <div className="grid grid-cols-2 text-sm">
                    <button
                        className={`w-full p-2 font-semibold text-white ${activeTab === "addPoints"
                            ? "bg-greenLight border-[1px] border-black"
                            : "bg-orange"
                            }`}
                        onClick={async () => {
                            setActiveTab("addPoints");
                            setCurrentPage(1);
                        }}
                    >
                        Add Balance
                    </button>
                    <button
                        className={`w-full p-2 font-semibold text-white ${activeTab === "withdrawPoints"
                            ? "bg-greenLight border-[1px] border-black"
                            : "bg-orange"
                            }`}
                        onClick={() => {
                            setActiveTab("withdrawPoints");
                            setCurrentPage(1);
                        }}
                    >
                        Withdraw Balance
                    </button>
                </div>
                {activeTab === "addPoints" ? (
                    <form onSubmit={handleDepositSubmit}>
                        <AmountSelector
                            value={depositAmount}
                            onChange={setDepositAmount}
                            minAmount={appData.min_deposit}
                            placeholder="Add Amount"
                            setPaymentMethodModal={setPaymentMethodModal}
                            addBalanceMethod={addBalanceMethod}
                            appData={appData}
                        />

                        {
                            appData?.self_recharge_bonus > 0 ?
                                <p className="px-3 mt-2 text-xs text-center text-primary">
                                    रिचार्ज करें और पाएं {appData?.self_recharge_bonus}% एक्स्ट्रा बैलेंस।
                                    <br /> First time offer only
                                </p>
                                : null
                        }
                        <div className="flex px-3 mt-2 justify-center w-full">
                            <button
                                type="submit"
                                className="w-full px-4 py-1 mt-2 text-white border-0 rounded-md mb-3 bg-greenLight"
                            >
                                {depositLoading ? <Spinner /> : "Add Balance"}
                            </button>

                        </div>
                    </form>
                ) : (
                    <form ref={walletWithdrawForm} onSubmit={handleWithdrawSubmit}>

                        <AmountSelector
                            value={withdrawAmount}
                            onChange={setWithdrawAmount}
                            minAmount={appData?.min_withdraw}
                            placeholder="Withdraw Amount"
                            user={user}
                            appData={appData}
                        />
                        <p className="px-3 mt-1 text-xs text-center text-red-600">
                            {/* आपका पैसा 5 से 10 मिनट मैं एड हो जाएगा */}
                        </p>
                        {/* <p className="px-3 mt-2 text-xs text-center text-blue-400">
              Win Amount :- 0
            </p> */}
                        <p className="px-3 mt-2 mb-2 text-sm font-semibold text-center text-black">
                            {/* {method==="bank"?"Bank account details" : "UPI ID"}*/}
                            Enter Withdraw Details
                        </p>
                        {/* <div className="flex justify-center gap-3 px-2">
              <label className="inline-flex items-center gap-1">
                <input
                  type="radio"
                  name="bankAccountType"
                  checked={bankAccountType === "permanent"}
                  onChange={() => setBankAccountType("permanent")}
                  value={"permanent"}
                />
                <small>Permanent</small>
              </label>
              <label className="inline-flex items-center gap-1">
                <input
                  type="radio"
                  name="bankAccountType"
                  checked={bankAccountType === "temporary"}
                  onChange={() => {
                    walletWithdrawForm.current.reset();
                    setBankAccountType("temporary")
                  }}
                  value={"temporary"}
                />
                <small>Temporary</small>
              </label>
            </div> */}
                        {appData.enable_upi_withdraw === 1 &&
                            appData.enable_bank_withdraw === 1 && (
                                <div className="flex flex-col px-3">
                                    {/* <label className="text-sm font-bold">Withdrawal Method</label> */}
                                    <select
                                        className="w-[100%] px-2 py-1 mt-1 text-black border rounded h-9 border-black/30"
                                        name="method"
                                        id="method"
                                        required
                                        value={method}
                                        onChange={(e) => setMethod(e.target.value)}
                                    >
                                        <option value={""}>Select Method</option>
                                        {appData.enable_upi_withdraw === 1 && (
                                            <option value={"upi"}>UPI</option>
                                        )}
                                        {appData.enable_bank_withdraw === 1 && (
                                            <option value={"bank"}>Bank</option>
                                        )}
                                    </select>
                                </div>
                            )}
                        {method === "upi" ? (
                            <div className="px-3 text-sm">
                                <div className="flex flex-col">
                                    <input
                                        className="px-2 py-1 mt-1 text-black border rounded h-9 border-black/30"
                                        type="text"
                                        placeholder="UPI Name"
                                        name="upi_name"
                                        id="upi_name"
                                        key={"upi_name"}
                                        defaultValue={defaultWithdrawDetails?.upi_name || ""}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <input
                                        className="px-2 py-1 mt-1 text-black border rounded h-9 border-black/30"
                                        type="text"
                                        placeholder="UPI id"
                                        name="upi_id"
                                        id="upi_id"
                                        key={"upi_id"}
                                        defaultValue={defaultWithdrawDetails?.upi_id || ""}
                                        required
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="px-3 text-sm">
                                <div className="flex flex-col">
                                    <input
                                        className="px-2 py-1 mt-1 text-black border rounded h-9 border-black/30"
                                        type="text"
                                        placeholder="Enter Bank Name"
                                        name="bank_name"
                                        id="bank_name"
                                        key="bankName"
                                        defaultValue={defaultWithdrawDetails?.bank_name || ""}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <input
                                        className="px-2 py-1 mt-1 text-black border rounded h-9 border-black/30"
                                        type="text"
                                        placeholder="Enter Account Holder Name"
                                        name="account_holder_name"
                                        id="account_holder_name"
                                        defaultValue={defaultWithdrawDetails?.account_holder_name || ""}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <input
                                        className="px-2 py-1 mt-1 text-black border rounded h-9 border-black/30"
                                        type="number"
                                        placeholder="Enter Account Number"
                                        name="account_number"
                                        id="account_number"
                                        required
                                        defaultValue={defaultWithdrawDetails?.account_number || ""}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <input
                                        className="px-2 py-1 mt-1 text-black border rounded h-9 border-black/30"
                                        type="text"
                                        placeholder="Enter IFSC Code"
                                        name="account_ifsc_code"
                                        id="account_ifsc_code"
                                        required
                                        onChange={(e) => {
                                            setAccountIFSCCode(e.target.value.toUpperCase().replace(/\s+/g, ''))
                                        }}
                                        value={accountIFSCCode}
                                    />
                                </div>
                            </div>
                        )}
                        <div className="p-3">
                            {
                                (() => {
                                    const maxAmount = appData?.enable_withdrawabale_balance_condition
                                        ? parseFloat(user?.withdrawable_balance || 0)
                                        : parseFloat(user?.balance || 0);
                                    return withdrawAmount > maxAmount ? (
                                        <p className="text-red-500 text-center text-sm">Your balance is not sufficient for withdrawal.</p>
                                    ) : null;
                                })()
                            }
                            <button
                                type="submit"
                                className={`w-full px-4 py-1 mt-2 text-white border-0 rounded-md 
                                ${(() => {
                                        const maxAmount = appData?.enable_withdrawabale_balance_condition
                                            ? parseFloat(user?.withdrawable_balance || 0)
                                            : parseFloat(user?.balance || 0);
                                        return withdrawAmount > maxAmount ? " bg-gray-500 " : "bg-greenLight";
                                    })()}`}
                            // disabled={withdrawAmount>parseFloat(user?.withdrawable_balance) ? true :false}
                            >
                                {withdrawLoading ? <Spinner /> : "Withdraw"}
                            </button>
                        </div>
                    </form>
                )}

                {
                    appData?.invite_system_enable ?
                        <div className="text-center py-1">
                            <button
                                onClick={() => navigate("/invite-and-earn")}
                                className="text-primary font-bold text-sm blinkText hover:text-blue-700 transition-colors"
                                style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif' }}
                            >
                                🎁 {`${appData?.invite_percentage_bet}% Bet कमीशन पाएं Invite करके`} 🔥
                            </button>
                        </div>
                        : null
                }

                <p className="p-3 mt-3 font-semibold text-center text-primary text-md border-t border-black/60">
                    {activeTab === "addPoints" ? "Deposit" : "Withdraw"} History
                </p>

                <WalletHistoryTable
                    currentPage={currentPage}
                    setCurrentPage={
                        setCurrentPage
                    }
                    loading={dataLoading}
                    perPageRecords={perPageRecords}
                    lastPage={
                        activeTab === "addPoints" ? depositLastPage : withdrawLastPage
                    }
                    data={
                        activeTab === "addPoints" ? depositHistoryData : withdrawHistoryData
                    }
                    activeTab={activeTab}
                    onViewScreenshot={handleViewScreenshot}
                />
                <Modal isOpen={isDepositModal} toggle={toggleDepositModal}>
                    <form onSubmit={onHandleTransferSubmit}>
                        <div className="grid grid-cols-3 p-2 font-semibold text-white bg-primary">
                            <div></div>
                            <div className="text-center">Transfer</div>
                            <div className="flex justify-end">
                                <button type="button" onClick={toggleDepositModal}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="w-6 h-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M6 18 18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="px-3 pb-3 text-sm">
                            <div className="flex justify-center">
                                <img src={Logo} alt="Logo" className="w-24 h-24" />
                            </div>
                            <p className="p-1 mt-1 font-semibold text-center text-white rounded bg-primary">
                                यहां से आप अपने POINT अपने दोस्तो की ID मैं डाल सकते हो
                            </p>
                            <input
                                type="number"
                                className="w-full p-1 px-2 mt-3 border rounded border-black/40 outline-0 focus:border-primary"
                                placeholder="Enter Mobile Number"
                                name="phone"
                                required
                            ></input>
                            <input
                                type="number"
                                className="w-full p-1 px-2 mt-1 border rounded border-black/40 outline-0 focus:border-primary"
                                placeholder="Amount"
                                name="amount"
                                required
                                min={appData?.min_transfer}
                            ></input>
                            <button
                                type="submit"
                                className="w-full h-10 p-1 mt-2 font-semibold text-center text-white rounded shadow text-md bg-primary"
                            >
                                {loading ? <Spinner /> : "Submit"}
                            </button>
                        </div>
                    </form>
                </Modal>

                {/* <Modal isOpen={paymentMethodModal} toggle={()=>setPaymentMethodModal(false )} >
          <div style={{width:"400px",margin:"0 auto",maxWidth:"90vw"}}>
             <div className="grid grid-cols-3 p-2 font-semibold text-white bg-primary">
                <div></div>
                <div className="text-center">Add Balance</div>
                <div className="flex justify-end">
                  <button type="button" onClick={()=>setPaymentMethodModal(false)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
          </div>
          <div className="flex flex-col px-3 pb-3">
            <br />
              <label className="text-sm font-bold">Payment Method</label>
              <select
                className="px-2 py-1 mt-1 text-black border rounded h-9 border-black/30"
                required
                value={addBalanceMethod}
                onChange={(e) => {setAddBalanceMethod(e.target.value); setBalanceMethodData(null)}}
              >
                {appData.enable_upi_withdraw === 1 && (
                  <option value={"upi"}>UPI</option>
                )}
                {appData.enable_bank_withdraw === 1 && (
                  <option value={"bank"}>Bank</option>
                )}
              </select>
            </div>
            {addBalanceMethod === "upi" ? (
              <form onSubmit={_addBalanceUPI}>
                <div className="px-3 text-sm">
                  <div className="flex flex-col">
                    <input
                      className="px-2 py-1 mt-1 text-black border rounded h-9 border-black/30"
                      type="text"
                      placeholder="UPI id"
                      name="upi_id"
                      id="upi_id"
                      key={"upi"}
                      defaultValue={ defaultWithdrawDetails?.upi_id || ""}
                      required
                    />
                  </div>
                </div>
                <button
                  style={{background:"#0098c7"}}
                  type="submit"
                  className="mt-4 ml-1 py-2 px-5 text-sm font-semibold text-white rounded-3xl"
                >
                  Submit
                </button>
              </form>
            ) : (
              <form onSubmit={_addBalanceBank}>
                <div className="px-3 text-sm">
                  <div className="flex flex-col pb-1">
                    <input
                      className="px-2 py-1 mt-1 text-black border rounded h-9 border-black/30"
                      type="text"
                      placeholder="Enter Bank Name"
                      name="bank_name"
                      id="bank_name"
                      key="bankName"
                      defaultValue={defaultWithdrawDetails?.bank_name || ""}
                      required
                    />
                  </div>
                  <div className="flex flex-col pb-1">
                    <input
                      className="px-2 py-1 mt-1 text-black border rounded h-9 border-black/30"
                      type="text"
                      placeholder="Enter Account Holder Name"
                      name="account_holder_name"
                      id="account_holder_name"
                      defaultValue={ defaultWithdrawDetails?.account_holder_name || ""}
                      required
                    />
                  </div>
                  <div className="flex flex-col pb-1">
                    <input
                      className="px-2 py-1 mt-1 text-black border rounded h-9 border-black/30"
                      type="number"
                      placeholder="Enter Account Number"
                      name="account_number"
                      id="account_number"
                      required
                      defaultValue={defaultWithdrawDetails?.account_number || ""}
                    />
                  </div>
                  <div className="flex flex-col">
                    <input
                      className="px-2 py-1 mt-1 text-black border rounded h-9 border-black/30"
                      type="text"
                      placeholder="Enter IFSC Code"
                      name="account_ifsc_code"
                      id="account_ifsc_code"
                      required
                    />
                  </div>
                </div>
                <button
                  style={{background:"#0098c7"}}
                  type="submit"
                  className="mt-4 ml-1 py-2 px-5 text-sm font-semibold text-white rounded-3xl"
                >
                  Submit
                </button>
              </form>
            )}
            <br />
          </div>
        </Modal> */}
            </div>
        </>
    );
};

export default Wallet;
