import React, { useEffect, useRef, useState } from "react";
import Logo from "../assets/imgs/Logo.png";
import { sendLoginOtp, verifyLoginOtp, verifyLoginMPin } from "../repository/AuthRepository";
import Repository from "../repository/Repository";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { useNavigate, useSearchParams } from "react-router-dom";
import BannerLogo from "../assets/imgs/banner_login_page.jpg";
import { getAppData } from "../repository/DataRepository";
import { useDispatch, useSelector } from "react-redux";
import { setAppData } from "../store/features/appData/appDataSlice";

// Function to call Android app callback on login success
function loginSuccess(userNumber) {
    if (window.AndroidApp && window.AndroidApp.onLoginSuccess) {
        window.AndroidApp.onLoginSuccess(userNumber);
    }
}

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { appData } = useSelector((state) => state.appData.appData);
    let [searchParams] = useSearchParams();
    let [loading, setLoading] = useState();
    let [isOTPScreen, setOTPScreen] = useState(false);
    let [isMpinScreen, setMpinScreen] = useState(false);
    let [isMpinSet, setIsMpinSet] = useState(false);
    let [isNewUser, setIsNewUser] = useState(false)
    let [phone, setPhone] = useState("");
    let [otp, setOTP] = useState("");
    let [mpin, setMpin] = useState("");
    let [newMpin, setNewMpin] = useState("");
    let [referralCode, setRefferalCode] = useState(searchParams?.get("referralCode") || "")
    let [promoType, setPromoType] = useState(localStorage.getItem("campaign_code_v2") || "")

    const phoneInputRef = useRef(null);
    const otpInputRef = useRef(null);
    const mpinInputRef = useRef(null);

    useEffect(() => {
        phoneInputRef.current?.focus();
    }, []);

    const handlePhoneSubmit = async (e) => {
        e.preventDefault();

        // Validate phone number length
        if (phone.length !== 10) {
            toast.error("Mobile number must be exactly 10 digits");
            return;
        }

        setLoading(true);
        try {
            let payload = {
                phone,
            };
            if (promoType?.trim()?.length > 0) {
                payload.promo_type = promoType;
            }
            let { data } = await sendLoginOtp(payload);
            if (data.error === false) {
                if (data?.response?.newUser) {
                    setIsNewUser(true)
                }
                // Check if MPIN is set
                if (data?.response?.isMpinSet) {
                    setIsMpinSet(true);
                    setMpinScreen(true);
                    setTimeout(() => {
                        mpinInputRef.current?.focus();
                    }, 100);
                } else {
                    setOTPScreen(true);
                    setTimeout(() => {
                        otpInputRef.current?.focus();
                    }, 100);
                }
            } else {
                toast.error(data.message);
            }
        } catch {
            toast.error("Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    const handleOTPSubmit = async (e) => {
        e.preventDefault();

        // Validate OTP length
        if (otp.length !== 4) {
            toast.error("OTP must be exactly 4 digits");
            return;
        }

        // Validate new MPIN - required if MPIN is not set
        if (!isMpinSet) {
            if (!newMpin || newMpin.trim().length === 0) {
                toast.error("Please set your MPIN");
                return;
            }
            if (newMpin.length !== 6) {
                toast.error("MPIN must be exactly 6 digits");
                return;
            }
        }

        setLoading(true);
        try {
            let payload = {
                phone,
                otp
            };
            if (referralCode?.trim()?.length > 0) {
                payload.referralCode = referralCode
            }
            // Add MPIN if user wants to set it
            if (newMpin?.trim()?.length > 0) {
                payload.mpin = newMpin;
            }
            let { data } = await verifyLoginOtp(payload);
            if (data.error === false) {
                // Call login success callback for Android app
                loginSuccess(phone);

                let { token, user } = data.response;
                Repository.defaults.headers.Authorization = "Bearer " + token;
                localStorage.setItem("authToken", token);
                localStorage.setItem("authUser", JSON.stringify(user));
                localStorage.setItem("welcomeStatus", true);
                localStorage.setItem("withdraw_details", JSON.stringify(user?.withdraw_details));

                // Clear promo_type after successful login
                localStorage.removeItem("campaign_code_v2");
                localStorage.removeItem("promo_type");

                navigate("/");
                let response = await getAppData();
                if (response?.data?.response) {
                    dispatch(setAppData(response?.data?.response));
                }
            } else {
                toast.error(data?.message || "Something went wrong!");
            }
        } catch {
        } finally {
            setLoading(false);
        }
    };

    const handleMPINSubmit = async (e) => {
        e.preventDefault();

        // Validate MPIN length
        if (mpin.length !== 6) {
            toast.error("MPIN must be exactly 6 digits");
            return;
        }

        setLoading(true);
        try {
            let payload = {
                phone,
                mpin
            };
            let { data } = await verifyLoginMPin(payload);
            if (data.error === false) {
                // Call login success callback for Android app
                loginSuccess(phone);

                let { token, user } = data.response;
                Repository.defaults.headers.Authorization = "Bearer " + token;
                localStorage.setItem("authToken", token);
                localStorage.setItem("authUser", JSON.stringify(user));
                localStorage.setItem("welcomeStatus", true);
                localStorage.setItem("withdraw_details", JSON.stringify(user?.withdraw_details));

                // Clear promo_type after successful login
                localStorage.removeItem("campaign_code_v2");
                localStorage.removeItem("promo_type");

                navigate("/");
                let response = await getAppData();
                if (response?.data?.response) {
                    dispatch(setAppData(response?.data?.response));
                }
            } else {
                toast.error(data?.message || "Something went wrong!");
            }
        } catch {
        } finally {
            setLoading(false);
        }
    };

    const handleSwitchToOTP = async () => {
        setLoading(true);
        try {
            let payload = {
                phone,
                otp_asked: true
            };
            if (promoType?.trim()?.length > 0) {
                payload.promo_type = promoType;
            }
            let { data } = await sendLoginOtp(payload);
            if (data.error === false) {
                setMpinScreen(false);
                setOTPScreen(true);
                setMpin("");
                toast.success("OTP sent successfully!");
                setTimeout(() => {
                    otpInputRef.current?.focus();
                }, 100);
            } else {
                toast.error(data.message);
            }
        } catch {
            toast.error("Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    const handleSwitchToMPIN = () => {
        setOTPScreen(false);
        setMpinScreen(true);
        setOTP("");
        setNewMpin("");
        setTimeout(() => {
            mpinInputRef.current?.focus();
        }, 100);
    };

    return (
        <div
            style={{
                background:
                    "linear-gradient(153deg,rgba(0,212,255,1) 0% , rgba(0,191,254,1) 35%,rgb(0 200 255) 100% )",
            }}
            className="h-[100vh] p-3 overflow-auto"
        >


            <div className="flex justify-center mb-3 mt-3 h-auto">
                {/* <img
                    src={Logo}
                    alt="Logo"
                    width={80}
                    style={{ display: "block" }}
                /> */}
                <img src={BannerLogo} alt="banner" style={{ display: "block", width: "100%" }} />

            </div>
            <div className="relative flex flex-col p-5 mt-6 rounded-md" style={{ border: "1px solid #fff" }}>
                <p style={{ textAlign: "center", fontSize: "22px", color: "#fff", margin: "0 0 0" }}>Login</p>

                <form onSubmit={handlePhoneSubmit}>
                    <div className="flex flex-col w-full">
                        <label style={{ color: "#fff", fontSize: "18px" }}>Mobile Number</label>
                        <input
                            ref={phoneInputRef}
                            className="block w-full h-10 px-2 py-1 mt-1 text-black border rounded border-black/40"
                            type="tel"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                            maxLength={10}
                            placeholder="Enter Mobile Number"
                            disabled={isOTPScreen || isMpinScreen}
                        />
                    </div>
                    {
                        !isOTPScreen && !isMpinScreen ?
                            <button
                                type="submit"
                                disabled={loading}
                                className="block w-full p-3 mt-2 font-semibold text-white rounded-md bg-[#006b9fd6]"
                            >
                                {loading ? <Spinner /> : "Send OTP"}
                            </button>
                            : null
                    }
                </form>

                {/* MPIN Login Screen */}
                {
                    isMpinScreen ?
                        <form onSubmit={handleMPINSubmit} style={{ marginTop: 10 }}>
                            <div className="flex flex-col w-full">
                                <label style={{ color: "#fff", fontSize: "18px" }}>Enter MPIN</label>
                                <input
                                    ref={mpinInputRef}
                                    className="block w-full h-10 px-2 py-1 mt-1 text-black border rounded border-black/40"
                                    type="password"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    value={mpin}
                                    onChange={(e) => {
                                        // Only allow numbers and max 6 digits
                                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                        setMpin(value);
                                    }}
                                    maxLength={6}
                                    placeholder="Enter 6-digit MPIN"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="block w-full p-3 mt-4 font-semibold text-white rounded-md bg-[#006b9fd6] shadow-md"
                            >
                                {loading ? <Spinner /> : "Login with MPIN"}
                            </button>
                            <button
                                type="button"
                                onClick={handleSwitchToOTP}
                                disabled={loading}
                                className="block w-full p-2 mt-3 text-sm text-white rounded-md bg-[#00000030] border border-white/50 hover:bg-[#00000045] transition-all"
                            >
                                {loading ? <Spinner /> : "Login using OTP instead"}
                            </button>
                        </form>
                        : null
                }

                {/* OTP Login Screen */}
                {
                    isOTPScreen ?
                        <form onSubmit={handleOTPSubmit} style={{ marginTop: 10 }}>
                            <div className="flex flex-col w-full">
                                <label style={{ color: "#fff", fontSize: "18px" }}>OTP</label>
                                <input
                                    ref={otpInputRef}
                                    className="block w-full h-10 px-2 py-1 mt-1 text-black border rounded border-black/40"
                                    type="number"
                                    inputMode="numeric"
                                    value={otp}
                                    onChange={(e) => {
                                        // Only allow numbers and max 4 digits
                                        const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                                        setOTP(value);
                                    }}
                                    maxLength={4}
                                    placeholder="Enter 4-digit OTP"
                                />
                            </div>
                            {/* Set MPIN field for users who don't have MPIN */}
                            {
                                !isMpinSet ?
                                    <div className="flex flex-col w-full mt-3">
                                        <label style={{ color: "#fff", fontSize: "18px" }}>Set MPIN</label>
                                        <input
                                            className="block w-full h-10 px-2 py-1 mt-1 text-black border rounded border-black/40"
                                            type="password"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            value={newMpin}
                                            onChange={(e) => {
                                                // Only allow numbers and max 6 digits
                                                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                                setNewMpin(value);
                                            }}
                                            maxLength={6}
                                            placeholder="Enter 6-digit MPIN"
                                        />
                                        <p style={{ color: "#fff", fontSize: "12px", marginTop: "5px" }}>
                                            Set a 6-digit MPIN for faster login next time
                                        </p>
                                    </div>
                                    : null
                            }
                            {
                                isNewUser ?
                                    <div className="flex flex-col w-full mt-3">
                                        <label style={{ color: "#fff", fontSize: "18px" }}>Referral Code (Optional)</label>
                                        <input
                                            className="block w-full h-10 px-2 py-1 mt-1 text-black border rounded border-black/40"
                                            type="text"
                                            value={referralCode}
                                            onChange={(e) => setRefferalCode(e.target.value)}
                                            placeholder="Enter Referral Code"
                                        />
                                    </div>

                                    : null
                            }
                            <button
                                type="submit"
                                disabled={loading}
                                className="block w-full p-3 mt-4 font-semibold text-white rounded-md bg-[#006b9fd6] shadow-md"
                            >
                                {loading ? <Spinner /> : isNewUser ? "Register" : "Login with OTP"}
                            </button>
                            {/* Show switch to MPIN button only if MPIN is set */}
                            {
                                isMpinSet ?
                                    <button
                                        type="button"
                                        onClick={handleSwitchToMPIN}
                                        disabled={loading}
                                        className="block w-full p-2 mt-3 text-sm text-white rounded-md bg-[#00000030] border border-white/50 hover:bg-[#00000045] transition-all"
                                    >
                                        Login using MPIN instead
                                    </button>
                                    : null
                            }
                        </form>
                        : null
                }

            </div>

            {/* Support Section */}
            {(!!appData?.whatsapp_enable || (appData?.telegram_chat_link && appData?.telegram_chat_link.trim() !== "")) && (
                <div className="mt-5 text-center">
                    <p className="text-white text-sm mb-3">For any Problem, Contact us</p>
                    <div className="flex justify-center items-center gap-3">
                        {!!appData?.whatsapp_enable && (
                            <a
                                href={appData?.whatsapp_number}
                                className="inline-flex items-center gap-1 px-4 py-2.5 rounded-full bg-[#2ed838] text-white text-sm font-semibold hover:bg-[#25c230] transition-colors duration-200 shadow-sm"
                            >
                                <i className="fab fa-whatsapp" style={{ fontSize: "15px" }}></i>
                                <span>WhatsApp</span>
                            </a>
                        )}
                        {appData?.telegram_chat_link && appData?.telegram_chat_link.trim() !== "" && (
                            <a
                                href={appData?.telegram_chat_link}
                                className="inline-flex items-center gap-1 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white text-sm font-semibold hover:shadow-lg transition-all duration-200 shadow-sm"
                            >
                                <i className="fab fa-telegram text-white" style={{ fontSize: "18px" }}></i>
                                <span>Telegram</span>
                            </a>
                        )}
                    </div>
                </div>
            )}

            {/* <p style={{textAlign:"center",fontSize:"16px",color:"#fff", margin:"30px 0 15px"}}>Download App</p>
                <div style={{display:"flex",justifyContent:"space-around",alignItems:"top"}}>
                    <a href={appData?.app_update_link} className="android-button">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={20} style={{marginRight:"10px"}}>
                            <g>
                                <path fill="#00F076" d="M17,14.5l4.2-4.5L4.9,1.2C4.8,1.1,4.6,1.1,4.3,1L17,14.5z"/>
                                <path fill="#FFC900" d="M23,21l5.9-3.2c0.7-0.4,1.1-1,1.1-1.8s-0.4-1.5-1.1-1.8L23,11l-4.7,5L23,21z"/>
                                <path fill="#00D6FF" d="M2.4,1.9C2.1,2.2,2,2.6,2,3V29c0,0.4,0.1,0.8,0.4,1.2L15.6,16L2.4,1.9z"/>
                                <path fill="#FF3A44" d="M17,17.5L4.3,31c0.2,0,0.4-0.1,0.6-0.2L21.2,22L17,17.5z"/>
                            </g>
                        </svg> 
                        Play Store
                    </a>
                    <a className="android-button">
                        <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" width={22} style={{marginRight:"10px"}}>
                            <circle cx="16" cy="16" r="14" fill="url(#grad)"/>
                            <path d="M18.4468 8.65403C18.7494 8.12586 18.5685 7.45126 18.0428 7.14727C17.5171 6.84328 16.8456 7.02502 16.543 7.55318L16.0153 8.47442L15.4875 7.55318C15.1849 7.02502 14.5134 6.84328 13.9877 7.14727C13.462 7.45126 13.2811 8.12586 13.5837 8.65403L14.748 10.6864L11.0652 17.1149H8.09831C7.49173 17.1149 7 17.6089 7 18.2183C7 18.8277 7.49173 19.3217 8.09831 19.3217H18.4324C18.523 19.0825 18.6184 18.6721 18.5169 18.2949C18.3644 17.7279 17.8 17.1149 16.8542 17.1149H13.5997L18.4468 8.65403Z" fill="white"/>
                            <path d="M11.6364 20.5419C11.449 20.3328 11.0292 19.9987 10.661 19.8888C10.0997 19.7211 9.67413 19.8263 9.45942 19.9179L8.64132 21.346C8.33874 21.8741 8.51963 22.5487 9.04535 22.8527C9.57107 23.1567 10.2425 22.975 10.5451 22.4468L11.6364 20.5419Z" fill="white"/>
                            <path d="M22.2295 19.3217H23.9017C24.5083 19.3217 25 18.8277 25 18.2183C25 17.6089 24.5083 17.1149 23.9017 17.1149H20.9653L17.6575 11.3411C17.4118 11.5757 16.9407 12.175 16.8695 12.8545C16.778 13.728 16.9152 14.4636 17.3271 15.1839C18.7118 17.6056 20.0987 20.0262 21.4854 22.4468C21.788 22.975 22.4594 23.1567 22.9852 22.8527C23.5109 22.5487 23.6918 21.8741 23.3892 21.346L22.2295 19.3217Z" fill="white"/>
                            <defs>
                                <linearGradient id="grad" x1="16" y1="2" x2="16" y2="30">
                                <stop stopColor="#2AC9FA"/>
                                <stop offset="1" stopColor="#1F65EB"/>
                                </linearGradient>
                            </defs>
                        </svg>

                    App Store
                    </a>

                </div>
                <p style={{textAlign:"center",fontSize:"16px",color:"#fff", margin:"10px 0 0"}}>Or</p>
                <InstallButton />


                <p style={{textAlign:"center",fontSize:"16px",color:"#fff", margin:"50px 0 20px"}}>How to download?</p>
            <div style={{display:"flex",justifyContent:"space-around",alignItems:"top"}}>

                <a href={appData.video_link_android} style={{fontSize:"14px",color:"#fff",textDecoration:"underline"}}>
                    For Android click here
                </a>
                <a href={appData.video_link_iphone} style={{fontSize:"14px",color:"#fff",textDecoration:"underline"}}>
                    For Iphone click here
                </a> 
            </div>*/}
        </div>
    );
};

export default Login;
