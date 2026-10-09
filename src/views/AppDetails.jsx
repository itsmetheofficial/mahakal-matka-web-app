import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { FiFileText, FiHash, FiShield, FiSmartphone } from "react-icons/fi";
import Logo from "../assets/imgs/Logo.png";

const AppDetails = () => {
  const { appData } = useSelector((state) => state.appData.appData);

  useEffect(() => { document.title = "App Details | Mahakal Matka"; }, []);

  const details = [
    { label: "TM Application", value: appData?.tm_no, icon: FiFileText },
    { label: "ARN Number", value: appData?.arn_no, icon: FiHash },
    { label: "Provisional ID", value: appData?.provisoinal_id, icon: FiSmartphone },
  ];

  return (
    <main className="min-h-full bg-[#f3f8fa] px-3 pb-20 pt-3 text-[#183747]">
      <section className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#007fa7] to-[#18b5cf] px-5 py-6 text-white shadow-[0_12px_30px_rgba(0,111,154,.2)]">
        <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full border-[28px] border-white/10" />
        <div className="relative flex items-center gap-4">
          <div className="grid h-[76px] w-[76px] shrink-0 place-items-center overflow-hidden rounded-full border-[3px] border-white bg-[#ffcf27] p-1 shadow-lg"><img src={Logo} alt="Mahakal Matka" className="h-full w-full object-contain" /></div>
          <div><span className="text-[11px] font-bold tracking-widest text-white/80">MAHAKAL MATKA</span><h1 className="mt-1 text-[22px] font-extrabold leading-tight">App details</h1><p className="mt-1 text-xs text-white/85">Your application information</p></div>
        </div>
      </section>

      <section className="mt-4 space-y-3" aria-label="Application details">
        {details.map(({ label, value, icon: Icon }) => <div key={label} className="flex items-center gap-3 rounded-2xl border border-[#e2edf1] bg-white p-4 shadow-sm"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#e8f8fb] text-[#0098c7]"><Icon size={22} strokeWidth={1.8} /></span><div className="min-w-0"><p className="text-xs font-medium text-slate-500">{label}</p><p className="mt-0.5 break-all text-base font-extrabold text-[#183747]">{value || "N/A"}</p></div></div>)}
      </section>

      <div className="mt-4 flex gap-3 rounded-2xl border border-[#d5eaf0] bg-[#e8f8fb] p-4"><FiShield className="mt-0.5 shrink-0 text-[#008eae]" size={20} /><div><p className="text-sm font-bold">Application information</p><p className="mt-1 text-xs leading-5 text-[#476474]">These identifiers are provided for your reference.</p></div></div>
    </main>
  );
};

export default AppDetails;
