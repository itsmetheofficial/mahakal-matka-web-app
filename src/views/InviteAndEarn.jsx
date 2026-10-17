import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FiArrowUpRight, FiCheck, FiCopy, FiGift, FiLink, FiShare2, FiUsers } from "react-icons/fi";
import { getReferralDetails } from "../repository/BalanceRepository";
import { getReferralLink } from "../utils/referral";

const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

export default function InviteAndEarn() {
  const [referralData, setReferralData] = useState({});
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState("");
  const { appData, user } = useSelector((state) => state.appData.appData);
  const code = referralData?.own_code || user?.own_code || "";
  const referralLink = getReferralLink(code);
  const invitedUsers = referralData?.invited_users || [];

  useEffect(() => {
    let active = true;
    getReferralDetails()
      .then((res) => {
        if (active && res?.data?.error === false) setReferralData(res?.data?.response?.referralDetails || {});
        else if (active) toast.error("Could not load referral details.");
      })
      .catch(() => { if (active) toast.error("Could not load referral details."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const copy = async (value, kind) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(kind);
      toast.success(`${kind} copied`);
    } catch {
      toast.error("Could not copy. Please try again.");
    }
  };

  const share = async () => {
    if (!referralLink) return;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Invite & Earn", text: "Join me on Mahakal Matka with my referral link.", url: referralLink });
      } catch (error) {
        if (error?.name !== "AbortError") toast.error("Could not share. Please try copying the link.");
      }
    } else {
      copy(referralLink, "Link");
    }
  };

  return (
    <main className="min-h-full bg-[#f3f8fa] px-3 pb-20 pt-3 text-[#183747]">
      <section className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#07516e] via-[#08748d] to-[#149ca6] px-5 py-6 text-white shadow-[0_12px_30px_rgba(7,81,110,.22)]">
        <div className="absolute -right-10 -top-14 h-44 w-44 rounded-full border-[28px] border-white/10" />
        <div className="absolute -bottom-20 right-8 h-40 w-40 rounded-full bg-white/10" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold"><FiGift /> INVITE & EARN</span>
          <h1 className="mt-4 font-hindi text-[25px] font-extrabold leading-[1.35]">दोस्तों को बुलाएं,<br />साथ में कमाएं</h1>
          <p className="mt-2 max-w-[295px] text-sm leading-5 text-white/90">Invite friends and earn {appData?.invite_percentage_bet ?? 0}% bet commission as bonus credit. Use it to play; it cannot be withdrawn directly.</p>
          <p className="mt-1 font-hindi text-xs leading-5 text-white/80">आपके दोस्तों की बेट पर कमीशन पाएं।</p>
        </div>
      </section>

      <section className="relative -mt-5 mx-2 grid grid-cols-3 divide-x divide-[#deeaee] rounded-2xl border border-[#e2edf1] bg-white px-2 py-4 text-center shadow-[0_8px_25px_rgba(20,65,84,.1)]" aria-label="Referral summary">
        <div className="px-1"><p className="text-[11px] leading-4 text-slate-500">Today's<br />commission</p><p className="mt-2 text-sm font-extrabold text-[#008eae]">{loading ? "—" : money(referralData?.commission_earned_today)}</p></div>
        <div className="px-1"><p className="text-[11px] leading-4 text-slate-500">Total<br />commission</p><p className="mt-2 text-sm font-extrabold text-[#008eae]">{loading ? "—" : money(referralData?.commission_earned_total)}</p></div>
        <div className="px-1"><p className="text-[11px] leading-4 text-slate-500">Friends<br />invited</p><p className="mt-2 text-sm font-extrabold text-[#183747]">{loading ? "—" : referralData?.total_invited_count ?? 0}</p></div>
      </section>

      <section className="mt-4 rounded-[22px] border border-[#e2edf1] bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#e8f8fb] text-[#008eae]"><FiLink size={20} /></span><div><h2 className="font-bold">Your invite link</h2><p className="text-xs text-slate-500">Referral code is added automatically</p></div></div>
        <div className="mt-4 rounded-xl border border-[#dce9ed] bg-[#f6fafb] px-3 py-3 text-xs text-[#41606e] break-all" aria-label="Referral link">{referralLink || (loading ? "Loading your link..." : "Referral link unavailable")}</div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button type="button" disabled={!referralLink} onClick={() => copy(referralLink, "Link")} className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#0098c7] px-2 text-sm font-bold text-white disabled:opacity-50">{copied === "Link" ? <FiCheck /> : <FiCopy />} Copy link</button>
          <button type="button" disabled={!referralLink} onClick={share} className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-[#0098c7] px-2 text-sm font-bold text-[#008eae] disabled:opacity-50"><FiShare2 /> Share invite</button>
        </div>
        <div className="mt-4 flex items-center justify-between gap-2 border-t border-[#e8f0f2] pt-4"><div><p className="text-[11px] text-slate-500">MY REFERRAL CODE</p><p className="font-extrabold tracking-[.12em] text-[#183747]">{code || "Not available"}</p></div><button type="button" disabled={!code} onClick={() => copy(code, "Code")} className="inline-flex min-h-[40px] items-center gap-2 rounded-xl bg-[#e8f8fb] px-3 text-xs font-bold text-[#008eae] disabled:opacity-50">{copied === "Code" ? <FiCheck /> : <FiCopy />} Copy code</button></div>
      </section>

      <section className="mt-5">
        <div className="mb-3 flex items-center justify-between"><h2 className="flex items-center gap-2 text-base font-extrabold"><FiUsers className="text-[#0098c7]" /> Invited users</h2><span className="rounded-full bg-[#e4f3f7] px-2.5 py-1 text-xs font-bold text-[#008eae]">{loading ? "—" : invitedUsers.length}</span></div>
        {loading ? <div className="rounded-2xl bg-white p-6 text-center text-sm text-slate-500">Loading invited users...</div> : invitedUsers.length ? (
          <div className="space-y-2">{invitedUsers.map((person, index) => <article key={`${person?.name || "user"}-${index}`} className="rounded-2xl border border-[#e2edf1] bg-white p-4 shadow-sm"><div className="flex items-center gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#e8f8fb] font-extrabold text-[#008eae]">{(person?.name || "?").charAt(0).toUpperCase()}</span><p className="min-w-0 truncate font-bold">{person?.name || "N/A"}</p></div><div className="mt-3 grid grid-cols-2 gap-2 border-t border-[#edf2f4] pt-3 text-xs"><div><p className="text-slate-500">Today</p><p className="mt-0.5 font-bold text-[#008eae]">{money(person?.commission_earned_from_them_today)}</p></div><div><p className="text-slate-500">Total earned</p><p className="mt-0.5 flex items-center gap-1 font-bold text-[#008eae]">{money(person?.commission_earned_from_them_total)} <FiArrowUpRight /></p></div></div></article>)}</div>
        ) : <div className="rounded-2xl border border-dashed border-[#bfdae3] bg-white px-5 py-8 text-center"><span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#e8f8fb] text-[#0098c7]"><FiUsers size={23} /></span><p className="mt-3 font-bold">No invites yet</p><p className="mt-1 text-xs text-slate-500">Share your link to invite your first friend.</p></div>}
      </section>
    </main>
  );
}
