import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Modal from "./Modal";
import { updateName } from "../repository/AuthRepository";
import { setAuthDataUsersSingleValue } from "../store/features/appData/appDataSlice";

export default function NamePrompt() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.appData.appData.user);
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("");
    const [saving, setSaving] = useState(false);
    const nameInputRef = useRef(null);

    useEffect(() => {
        if (!localStorage.getItem("authToken") || !user?.id || (user.name || "").trim().toLowerCase() !== "user") return;
        const key = `namePromptShown:placeholder:${user.id}`;
        if (sessionStorage.getItem(key)) return;
        sessionStorage.setItem(key, "true");
        setIsOpen(true);
    }, [user?.id, user?.name]);

    const saveName = async (event) => {
        event.preventDefault();
        const trimmedName = name.trim();
        if (!/^[a-zA-Z\s]+$/.test(trimmedName) || trimmedName.length > 50) {
            toast.error("Please enter a valid name (letters only).");
            return;
        }
        setSaving(true);
        try {
            const { data } = await updateName(trimmedName);
            if (data?.error !== false) throw new Error(data?.message || "Could not update name.");
            const savedName = data.response.user.name;
            dispatch(setAuthDataUsersSingleValue({ key: "name", value: savedName }));
            const storedUser = JSON.parse(localStorage.getItem("authUser") || "{}");
            localStorage.setItem("authUser", JSON.stringify({ ...storedUser, name: savedName }));
            setIsOpen(false);
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "Could not update name.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal isOpen={isOpen} toggle={() => setIsOpen(false)} zIndex={60} initialFocusRef={nameInputRef}>
            <form onSubmit={saveName} className="w-[360px] max-w-[90vw] overflow-hidden rounded-2xl bg-white font-poppins">
                <div className="relative bg-gradient-to-br from-sky-500 to-blue-700 px-6 pb-6 pt-7 text-white">
                    <button
                        type="button"
                        aria-label="Close name dialog"
                        onClick={() => setIsOpen(false)}
                        className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                        <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M6 6l12 12M18 6L6 18" />
                        </svg>
                    </button>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
                        <svg aria-hidden="true" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="8" r="3.5" />
                            <path d="M5 20c0-3.5 2.8-6 7-6s7 2.5 7 6" />
                        </svg>
                    </div>
                    <h2 className="pr-7 text-xl font-semibold leading-tight">Please enter your name</h2>
                    <p className="mt-2 text-sm leading-relaxed text-white/90">Make your account feel like yours. Your name will appear in your profile.</p>
                </div>
                <div className="px-6 pb-6 pt-5">
                    <label htmlFor="account-name" className="mb-2 block text-sm font-semibold text-gray-800">Your name</label>
                    <input
                        id="account-name"
                        ref={nameInputRef}
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        maxLength={50}
                        autoComplete="name"
                        className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-sky-100"
                        placeholder="Enter your name"
                    />
                    <button type="submit" disabled={saving} className="mt-5 w-full rounded-xl bg-primary px-4 py-3 font-semibold text-white shadow-md transition hover:bg-sky-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50">
                        {saving ? "Updating..." : "Update name"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
