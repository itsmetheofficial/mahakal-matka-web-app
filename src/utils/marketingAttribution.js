// Attribution is optional: an unavailable SDK or blocked storage must not stop login.
export function getMarketingAttribution() {
    let campaignKey = null;
    let trackingRef = null;
    try {
        const value = window.MarketingD360?.getCampaignKey?.();
        if (typeof value === "string" && /^[a-z][a-z0-9_%-]{0,63}$/.test(value)) {
            campaignKey = value;
        }
    } catch {
        // Continue without attribution.
    }
    if (campaignKey) {
        try {
            const value = window.MarketingD360?.getTrackingReference?.();
            if (typeof value === "string" && value.trim() && value.length <= 2048 && !Array.from(value).some(char => char.charCodeAt(0) < 32 || char.charCodeAt(0) > 126)) {
                trackingRef = value;
            }
        } catch {
            // Keep a valid campaign even when the reference cannot be read.
        }
    }
    return { campaign_key: campaignKey, tracking_ref: trackingRef };
}
