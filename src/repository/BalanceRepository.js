import Repository from "./Repository";

function withdrawBalance(payload) {
	return Repository.post('/withdraw-balance', {
		amount: payload.amount,
		withdraw_mode: payload.mode,
		...(payload.mode === 'upi' ? {
			upi_name: payload.upiName,
			upi_id: payload.upiId,
		} : {
			bank_name: payload.bankName,
			account_holder_name: payload.accountHolderName,
			account_number: payload.accountNumber,
			account_ifsc_code: payload.accountIFSCCode,
		}),
		...(payload.location || {}),
	});
}

function getWithdrawLocationRequirement() {
	return Repository.get('/withdraw-location-requirement');
}

function updateUserLocation(payload) {
	return Repository.post('/update-user-location', payload);
}

function depositBalance(payload) {
	return Repository.post(
		`/upi-payment-url?amount=${payload.amount}`
	);
}

function depositBalancePayFromUpi(payload) {
	return Repository.post(
		`/pay-from-upi-payment-url?amount=${payload.amount}`
	);
}

function depositBalanceQRCode(payload) {
	return Repository.post(
		`/i-online-pay-upi-payment-url?amount=${payload.amount}`
	);
}

function depositBalancePaymentKaro(payload) {
	return Repository.post(
		`/payment-karo-payment-url?amount=${payload.amount}`
	);
}

function transferBalance(payload) {
	return Repository.post(
		`/transfer-balance?amount=${payload.amount}&phone=${payload.phone}`
	);
}

// Share refreshes from focus, navigation and polling within the same login session.
let balanceRequest;
let balanceToken;
let balanceResponse;
let balanceRefreshedAt = 0;
let balanceRetryAt = 0;
let balanceRateLimitError;

function getUserBalance() {
    const token = localStorage.getItem('authToken');
    if (token !== balanceToken) {
        balanceToken = token;
        balanceRequest = null;
        balanceResponse = null;
        balanceRefreshedAt = 0;
        balanceRetryAt = 0;
        balanceRateLimitError = null;
    }
    if (balanceRequest) return balanceRequest;
    if (Date.now() < balanceRetryAt) return Promise.reject(balanceRateLimitError);
    if (balanceResponse && Date.now() - balanceRefreshedAt < 3000) {
        return Promise.resolve(balanceResponse);
    }
    const request = Repository.get('/get-user-balance', { timeout: 15000 }).then(response => {
        if (balanceToken === token) {
            balanceResponse = response;
            balanceRefreshedAt = Date.now();
        }
        return response;
    }).catch(error => {
        if (balanceToken === token && error.response?.status === 429) {
            const retryAfter = error.response.headers?.['retry-after'];
            const seconds = Number(retryAfter);
            const delay = Number.isFinite(seconds) ? seconds * 1000 : Date.parse(retryAfter) - Date.now();
            balanceRetryAt = Date.now() + Math.max(60000, Number.isFinite(delay) ? delay : 60000);
            balanceRateLimitError = error;
        }
        throw error;
    }).finally(() => {
        if (balanceRequest === request) balanceRequest = null;
    });
    balanceRequest = request;
    return request;
}
function getReferralDetails(payload) {
	return Repository.get(`/get-referral-details`);
}


export {
	withdrawBalance,
	getWithdrawLocationRequirement,
	updateUserLocation,
	transferBalance,
	getUserBalance,
	depositBalance,
	depositBalanceQRCode,
	depositBalancePaymentKaro,
	getReferralDetails,
	depositBalancePayFromUpi

};
