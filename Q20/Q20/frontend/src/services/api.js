const API_BASE = '/api';

export const bankApi = {
  // Fetch all accounts (Bank Manager / Teller view)
  getAccounts: async () => {
    const res = await fetch(`${API_BASE}/accounts`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch accounts');
    return data;
  },

  // Get single account details
  getAccount: async (accountNumber) => {
    const res = await fetch(`${API_BASE}/accounts/${accountNumber}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch account');
    return data;
  },

  // Authenticate genuine account holder via Account Number + Security PIN
  verifyHolder: async (accountNumber, pin) => {
    const res = await fetch(`${API_BASE}/accounts/verify-holder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountNumber, pin }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Verification failed');
    return data;
  },

  // Open new Savings Account for verified genuine holder
  createAccount: async (accountData) => {
    const res = await fetch(`${API_BASE}/accounts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(accountData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to open account');
    return data;
  },

  // Deposit funds
  deposit: async (accountNumber, pin, amount, description) => {
    const res = await fetch(`${API_BASE}/transactions/deposit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountNumber, pin, amount, description }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Deposit failed');
    return data;
  },

  // Withdraw funds
  withdraw: async (accountNumber, pin, amount, description) => {
    const res = await fetch(`${API_BASE}/transactions/withdraw`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountNumber, pin, amount, description }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Withdrawal failed');
    return data;
  },

  // Fetch transactions / passbook
  getTransactions: async (accountNumber = null) => {
    const url = accountNumber ? `${API_BASE}/transactions?accountNumber=${accountNumber}` : `${API_BASE}/transactions`;
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch transactions');
    return data;
  },

  // Update account status (Active / Frozen)
  updateStatus: async (accountNumber, status) => {
    const res = await fetch(`${API_BASE}/accounts/${accountNumber}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update status');
    return data;
  },

  // Reset demo
  resetDemo: async () => {
    const res = await fetch(`${API_BASE}/accounts/reset`, { method: 'POST' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to reset demo');
    return data;
  },
};
