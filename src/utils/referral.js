export const getReferralLink = (code) => {
  if (!code) return "";
  const origin = (process.env.REACT_APP_SHARE_ORIGIN || window.location.origin).replace(/\/$/, "");
  return `${origin}/auth/login?referralCode=${encodeURIComponent(code)}`;
};
