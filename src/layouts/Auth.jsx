import React, { useState, useEffect } from "react";
import Modal from "../components/Modal";
import { sendLoginOtp, verifyLoginOtp } from "../repository/AuthRepository";
import Repository from "../repository/Repository";
import { toast } from "react-toastify";
import { Outlet, useNavigate } from "react-router-dom";
import Logo from "../assets/imgs/Logo.png";
import { getAppData } from '../repository/DataRepository';
import { setAppData } from '../store/features/appData/appDataSlice';
import { useDispatch, useSelector } from 'react-redux';
import flowConfig from '../Data/flow.json';

// Function to call Android app callback on login success
function loginSuccess(userNumber) {
  console.log('called login success callback');
  if (window.AndroidApp && window.AndroidApp.onLoginSuccess) {
    window.AndroidApp.onLoginSuccess(userNumber);
  }
}

const Auth = ({ isOpen, toggle }) => {

  const [modalStep, setModalStep] = useState("enterNumber");
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOTP] = useState("");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [shouldOpenModal, setShouldOpenModal] = useState(false);
  const navigate = useNavigate();
  let dispatch = useDispatch();
  const [error, setError] = useState('');
  const { appData } = useSelector((state) => state.appData.appData);

  useEffect(() => {
    if (flowConfig.openMobileNumberModal) {
      setShouldOpenModal(true);
    } else {
      const token = localStorage.getItem("authToken");
      if (token !== null) {
        navigate("/");
      } else {
        // navigate("/");
        // navigate("/auth/login");
      }
    }
  }, [navigate]);

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();

    if (!phone || phone.trim().length === 0) {
      toast.error("Phone number should not be empty.");
      return;
    }

    setLoading(true);
    try {
      const payload = { phone };
      const { data } = await sendLoginOtp(payload);
      if (data.error === false) {
        setModalStep("verifyOtp");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();

    if (!otp || otp.trim().length === 0) {
      toast.error("OTP should not be empty.");
      return;
    }

    setLoading(true);
    try {
      const payload = { phone, otp };
      const { data } = await verifyLoginOtp(payload);

      if (data.error === false) {
        const { token, user } = data.response;
        Repository.defaults.headers.Authorization = `Bearer ${token}`;
        localStorage.setItem("authToken", token);
        localStorage.setItem("authUser", JSON.stringify(user));
        localStorage.removeItem("authMenu");

        // Call login success callback for Android app
        loginSuccess(phone);

        toggle();
        if (data.response.token) {
          setIsOpenModal(true);
        }
        const fetchAppDataPromise = getAppData();

        const [appDataResponse] = await Promise.all([fetchAppDataPromise]);

        if (appDataResponse?.data?.error === false) {
          dispatch(setAppData(appDataResponse.data.response));
          navigate('/')
        } else {
          setError(appDataResponse?.data?.message);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Failed to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleModalToggle = () => {
    if (isOpen) {
      localStorage.setItem("authMenu", 0);
    } else {
      localStorage.setItem("authMenu", 1);
    }
    toggle();
  };

  if (flowConfig.openMobileNumberModal) {
    return (
      <div className="font-poppins overflow-hidden relative max-w-[480px] w-full mx-auto">
        <Modal isOpen={isOpen} toggle={handleModalToggle}>
          <div className="font-semibold relative text-black bg-white rounded-xl pb-12">
            <div className="flex justify-end p-3">
              <button onClick={handleModalToggle}>
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-3 text-center text-md">
              {modalStep === "enterNumber" && (
                <div className="mt-0 text-center">
                  <p className="text-3xl font-extrabold text-[#4482fb] mb-2">
                    Get 10 Rs Free Bonus
                  </p>
                  <p
                    style={{
                      width: "90%",
                      margin: "auto",
                      marginTop: "10px",
                      borderBottom: "1px solid #404040",
                    }}
                  ></p>
                  <p className="w-full flex justify-start mt-4 text-lg font-bold">
                    Enter Mobile Number
                  </p>
                  <div className="relative w-full">
                    <span className="absolute top-1/2 left-3 transform -translate-y-1/2 text-lg text-gray-500">+91</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      placeholder="1234564578"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-0 pl-[48px] border rounded-md w-full p-3 text-lg bg-[#f8f8f8]"
                      style={{
                        appearance: 'textfield',
                        MozAppearance: 'textfield',
                      }}
                    />
                  </div>

                  <button
                    className="mt-8 px-4 py-2 bg-blue-500 text-white rounded-xl"
                    onClick={handlePhoneSubmit}
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Create Your Account"}
                  </button>
                </div>
              )}

              {modalStep === "verifyOtp" && (
                <div className="mt-0 text-center">
                  <p className="text-3xl font-extrabold text-[#4482fb] mb-2">
                    Verify OTP
                  </p>
                  <p
                    style={{
                      width: "90%",
                      margin: "auto",
                      marginTop: "10px",
                      borderBottom: "1px solid #404040",
                    }}
                  ></p>
                  <p className="w-full flex justify-start mt-4 text-lg font-bold">
                    Enter OTP
                  </p>
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOTP(e.target.value)}
                    className="mt-2 pl-[8px] border rounded-md w-full p-3 text-lg bg-[#f8f8f8]"
                    style={{
                      appearance: 'textfield',
                      MozAppearance: 'textfield',
                    }}
                  />
                  <button
                    className="mt-8 px-4 py-2 bg-blue-500 text-white rounded-xl"
                    onClick={handleOTPSubmit}
                    disabled={loading}
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </Modal>

        <Modal isOpen={isOpenModal} toggle={() => setIsOpenModal(false)}>
          <div className='font-semibold relative text-black bg-white rounded-xl'>
            <img src={Logo} className="w-20 h-20 absolute left-1/2 z-9 -top-10 border-4 border-white rounded-full -translate-x-1/2" />
            <div className='flex justify-end p-3'>
              <button onClick={() => setIsOpenModal(false)}>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='1.5'
                  stroke='currentColor'
                  className='w-6 h-6'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M6 18 18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>
            <div className='p-3 text-center text-md'>
              <h3 className="text-orange text-2xl">Important</h3>
              <div>
                {appData.info_dialog_1_message}
              </div>
              <div className="pt-3">
                {appData.info_dialog_1_bottom_text}
              </div>
              <a href={appData.info_dialog_1_url} target="_blank" className="mt-8 inline-block bg-primary py-1 px-8 text-white rounded-3xl">
                <span className="mr-2">🚀</span>Click me!
              </a>
            </div>
          </div>
        </Modal>
      </div>
    );
  } else {
    // Second logic (redirect based on token)
    return (
      <div className="font-poppins overflow-hidden relative max-w-[480px] w-full mx-auto">
        <Outlet />
      </div>
    );
  }
};

export default Auth;
