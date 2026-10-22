import { walletAmounts } from '../utils/wallet';
import { useContext, useEffect, useState } from "react";
import Logo from "../assets/imgs/Logo.png";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../repository/AuthRepository";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { getAppData } from "../repository/DataRepository";
import { setAppData } from "../store/features/appData/appDataSlice";
import { ModalContext } from "../context/ModalContext";
import { Switch } from "@headlessui/react";

const EditProfile = () => {
    let dispatch = useDispatch();

    let { user } = useSelector((state) => state.appData.appData);

    let { toggleSuccessModalOpen, setSuccessMessage } = useContext(ModalContext)

    let [email, setEmail] = useState("");
    let [dob, setDob] = useState("");
    let [name, setName] = useState("");
    let [receiveNotification, setReceiveNotification] = useState(false);
    let [mpin, setMpin] = useState("");

    let [loading, setLoading] = useState(false);

    const fetchAppData = async () => {
        let { data } = await getAppData({ forceRefresh: true });

        if (!data?.error) {
            dispatch(setAppData(data?.response));
        }
    }

    useEffect(() => {
        setName(user?.name);
        setReceiveNotification(user?.general_noti);
    }, [user]);

    const handleProfileSubmit = async (e) => {
        e.preventDefault();

        // Validate MPIN if provided
        if (mpin && mpin.trim().length > 0) {
            if (mpin.length !== 6) {
                toast.error("MPIN must be exactly 6 digits");
                return;
            }
        }

        setLoading(true);
        try {
            let payload = {
                name,
                general_noti: receiveNotification
            };
            // Add MPIN if user wants to change it
            if (mpin && mpin.trim().length > 0) {
                payload.mpin = mpin;
            }
            let { data } = await updateProfile(payload);
            if (data?.error === false) {
                toggleSuccessModalOpen();
                setSuccessMessage(data?.message)
                fetchAppData();
                // Clear MPIN field after successful update
                setMpin("");
            } else {
                toast.error(data?.message);
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="flex flex-col items-center p-3 pb-12 bg-primary">
                <div className="w-32 h-32 overflow-hidden rounded-full">
                    <img src={Logo} alt="Logo" className="w-full h-full" />
                </div>
            </div>
            <div className="p-8 pt-10 -mt-5 bg-white rounded-3xl">
                {/* <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-2 px-3 font-bold text-center text-white rounded-md bg-greenLight">
                        Balance: {walletAmounts(user).total}
                    </div>
                    <div className="p-2 px-3 font-bold text-center text-white rounded-md bg-greenLight">
                        Bonus: {user?.bonus}
                    </div>
                </div> */}
                <form onSubmit={handleProfileSubmit} className="text-xs">
                    <div className="flex flex-col mt-4">
                        <label className="text-sm font-semibold">Name</label>
                        <input
                            type="text"
                            className="py-2 mt-1 border-b outline-0 focus:border-primary"
                            placeholder="Your Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        ></input>
                    </div>
                    <div className="flex flex-col mt-4">
                        <label className="text-sm font-semibold">Change MPIN (Optional)</label>
                        <input
                            type="password"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            className="py-2 mt-1 border-b outline-0 focus:border-primary"
                            placeholder="Enter new 6-digit MPIN"
                            value={mpin}
                            onChange={(e) => {
                                // Only allow numbers and max 6 digits
                                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                setMpin(value);
                            }}
                            maxLength={6}
                        ></input>
                        <p className="text-xs text-gray-500 mt-1">
                            Leave blank to keep your current MPIN
                        </p>
                    </div>
                    <div className="flex flex-col mt-4 mb-6">
                        <label className="text-sm font-semibold mb-2">Receive Notifications</label>
                        <Switch
                            checked={receiveNotification}
                            onChange={setReceiveNotification}
                            className={`${receiveNotification ? 'bg-green-600' : 'bg-gray-300'}
                                relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
                        >
                            <span
                                className={`${receiveNotification ? 'translate-x-6' : 'translate-x-1'}
                                inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                            />
                        </Switch>
                    </div>
                    {/* <div className="flex flex-col mt-3">
            <label className="text-sm font-semibold">Date Of Birth</label>
            <input
              type="date"
              className="py-2 mt-1 border-b outline-0 focus:border-primary"
              placeholder="Your DOB"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            ></input>
          </div>
          <div className="flex flex-col mt-3">
            <label className="text-sm font-semibold">Email</label>
            <input
              type="email"
              className="py-2 mt-1 border-b outline-0 focus:border-primary"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
          </div> */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="block w-full px-3 py-2 mt-3 h-10 text-sm font-semibold text-white rounded-lg bg-primary"
                    >
                        {loading ? <Spinner /> : "Save"}
                    </button>
                </form>
            </div>
        </>
    );
};

export default EditProfile;
