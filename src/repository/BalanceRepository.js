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

function getUserBalance(payload) {
	return Repository.get(`/get-user-balance`);
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
