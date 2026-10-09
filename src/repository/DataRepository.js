import Repository from "./Repository";

async function getAppData() {
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
