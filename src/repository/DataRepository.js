import Repository from "./Repository";

let cachedAppData = null;
let cachedToken = null;
let pendingAppData = null;

// Keep the backend response for this running app session. A reload starts fresh.
// Explicit refreshes still update profile, payment and notification information.
async function getAppData({ forceRefresh = false } = {}) {
    const token = localStorage.getItem("authToken");
    if (token !== cachedToken) {
        cachedToken = token;
        cachedAppData = null;
        pendingAppData = null;
    }
    if (!forceRefresh && cachedAppData) return cachedAppData;
    if (!forceRefresh && pendingAppData) return pendingAppData;

    const request = loadAppData().then(response => {
        if (token === cachedToken && response?.data?.error === false) {
            cachedAppData = response;
        }
        return response;
    });
    pendingAppData = request;
    try {
        return await request;
    } finally {
        if (pendingAppData === request) pendingAppData = null;
    }
}

async function loadAppData() {
    const lastReadNotificationId = Number(localStorage.getItem("lastReadNotificationId")) || 0;
    const response = await Repository.get(`/get-app-data`, {
        params: { last_read_notification_id: lastReadNotificationId }
    });

    // Existing visitors only have a count. Preserve their current unread badge
    // until they view notifications, then switch to the stable ID cursor.
    if (!localStorage.getItem("lastReadNotificationId") && response?.data?.error === false) {
        const appData = response.data.response?.appData;
        const total = Number(appData?.notification_count) || 0;
        const readCount = Math.max(0, Number(localStorage.getItem("readNotifications")) || 0);
        appData.unread_notification_count = Math.max(0, total - readCount);
        if (readCount >= total) {
            localStorage.setItem("lastReadNotificationId", String(appData?.last_notification?.id || 0));
        }
    }

    return response;
}

export {
    getAppData
};
