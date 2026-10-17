jest.mock('axios', () => ({ get: jest.fn() }));
import { walletAmounts, money } from './wallet';
import reducer, { setWalletBalances, setAuthDataUsersSingleValue } from '../store/features/appData/appDataSlice';

test('cash and bonus combine without trusting an outdated total', () => {
  expect(walletAmounts({ balance: '1000.00', bonus_balance: '500.00', total_balance: '9999.00' })).toEqual({ cash: 1000, bonus: 500, total: 1500 });
  expect(walletAmounts()).toEqual({ cash: 0, bonus: 0, total: 0 });
});

test('legacy users retain their cash and receive zero bonus', () => {
  expect(walletAmounts({ balance: '1000.00' })).toEqual({ cash: 1000, bonus: 0, total: 1000 });
});

test('a mixed-funded bet response updates all wallet figures together', () => {
  const state = { appData: { user: { id: 1, balance: 1000, bonus_balance: 10, total_balance: 1010 } } };
  const after = reducer(state, setWalletBalances({ balance: '910.00', cash_balance: '910.00', bonus_balance: '0.00', total_balance: '910.00' }));
  const compatible = reducer(after, setAuthDataUsersSingleValue({ key: 'balance', value: '910.00' }));
  expect(walletAmounts(compatible.appData.user)).toEqual({ cash: 910, bonus: 0, total: 910 });
});

test('cash updates preserve promotional funds and refresh the total', () => {
  const state = { appData: { user: { balance: 1000, cash_balance: 1000, bonus_balance: 500, total_balance: 1500 } } };
  const after = reducer(state, setAuthDataUsersSingleValue({ key: 'balance', value: 200 }));
  expect(walletAmounts(after.appData.user)).toEqual({ cash: 200, bonus: 500, total: 700 });
  expect(money(1234.5)).toBe('1,234.50');
});
