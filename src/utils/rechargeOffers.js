import Repository from '../repository/Repository';

// Keep offers across wallet visits; a page reload starts a fresh cache.
const cache = new Map();
const keyFor = userId => `${userId}:${localStorage.getItem('authToken') || ''}`;
const recordFor = userId => {
  const key = keyFor(userId);
  if (!cache.has(key)) cache.set(key, { data: null, request: null, recharged: false });
  return cache.get(key);
};
const eligibleData = record => record.data && record.recharged && record.data.self?.first_only
  ? { ...record.data, self: { ...record.data.self, eligible: false, percentage: 0 } }
  : record.data;

export const cachedRechargeOffers = userId => userId ? eligibleData(recordFor(userId)) : null;
export const markSuccessfulRecharge = userId => {
  const record = recordFor(userId);
  record.recharged = true;
  return eligibleData(record);
};
export function loadRechargeOffers(userId) {
  const record = recordFor(userId);
  if (record.data) return Promise.resolve(eligibleData(record));
  if (!record.request) {
    record.request = Repository.get('/wallet/recharge-offers').then(({ data }) => {
      if (data.error) throw new Error(data.message);
      record.data = data.response;
      return eligibleData(record);
    }).catch(error => {
      record.request = null;
      throw error;
    });
  }
  return record.request;
}
