import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HolderSwitcher from './components/HolderSwitcher';
import AccountSummaryCard from './components/AccountSummaryCard';
import DepositModal from './components/DepositModal';
import WithdrawModal from './components/WithdrawModal';
import PassbookLedger from './components/PassbookLedger';
import OpenAccountModal from './components/OpenAccountModal';
import BankManagerDashboard from './components/BankManagerDashboard';
import { bankApi } from './services/api';
import { CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState('customer'); // 'customer' | 'admin'
  const [accounts, setAccounts] = useState([]);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isOpenAccountOpen, setIsOpenAccountOpen] = useState(false);

  // Toast Notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch all accounts
  const loadAccounts = async (preferredAccNumber = null) => {
    try {
      setLoading(true);
      setError('');
      const res = await bankApi.getAccounts();
      const list = res.data || [];
      setAccounts(list);

      if (list.length > 0) {
        if (preferredAccNumber) {
          const match = list.find((a) => a.accountNumber === preferredAccNumber);
          setCurrentAccount(match || list[0]);
        } else if (!currentAccount) {
          setCurrentAccount(list[0]);
        } else {
          // Keep current updated
          const match = list.find((a) => a.accountNumber === currentAccount.accountNumber);
          setCurrentAccount(match || list[0]);
        }
      }
    } catch (err) {
      console.error(err);
      setError('Could not connect to Banking API. Ensure the backend server is running on port 5001.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch transactions for current account
  const loadTransactions = async (accountNumber) => {
    if (!accountNumber) return;
    try {
      const res = await bankApi.getTransactions(accountNumber);
      setTransactions(res.data || []);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  useEffect(() => {
    if (currentAccount?.accountNumber) {
      loadTransactions(currentAccount.accountNumber);
    }
  }, [currentAccount?.accountNumber]);

  // Account selection from switcher
  const handleSelectAccount = (acc) => {
    setCurrentAccount(acc);
    setActiveView('customer');
  };

  // Authenticate by PIN and switch
  const handleVerifyAndSwitch = async (accountNumber, pin) => {
    const res = await bankApi.verifyHolder(accountNumber, pin);
    setCurrentAccount(res.data);
    setActiveView('customer');
    showToast(`Welcome back, ${res.data.holderName}! Authentication verified.`);
  };

  // Callback on successful deposit
  const handleDepositSuccess = (message, newBalance) => {
    showToast(message, 'success');
    setCurrentAccount((prev) => (prev ? { ...prev, balance: newBalance } : prev));
    loadAccounts(currentAccount.accountNumber);
    loadTransactions(currentAccount.accountNumber);
  };

  // Callback on successful withdrawal
  const handleWithdrawSuccess = (message, newBalance) => {
    showToast(message, 'success');
    setCurrentAccount((prev) => (prev ? { ...prev, balance: newBalance } : prev));
    loadAccounts(currentAccount.accountNumber);
    loadTransactions(currentAccount.accountNumber);
  };

  // Account creation callback
  const handleAccountCreated = (newAcc) => {
    loadAccounts(newAcc.accountNumber);
    setCurrentAccount(newAcc);
    setActiveView('customer');
    showToast(`Savings Account ${newAcc.accountNumber} opened for ${newAcc.holderName}!`);
  };

  // Status toggle callback from Admin
  const handleAccountStatusChanged = (updatedAcc) => {
    setAccounts((prev) =>
      prev.map((a) => (a.accountNumber === updatedAcc.accountNumber ? updatedAcc : a))
    );
    if (currentAccount?.accountNumber === updatedAcc.accountNumber) {
      setCurrentAccount(updatedAcc);
    }
    showToast(`Account status updated to ${updatedAcc.status}`);
  };

  // Reset demo
  const handleResetDemo = async () => {
    try {
      setLoading(true);
      await bankApi.resetDemo();
      await loadAccounts();
      showToast('Reset banking ledger and demo accounts successfully!');
    } catch (err) {
      showToast('Error resetting demo: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenAccountModal={() => setIsOpenAccountOpen(true)}
        onResetDemo={handleResetDemo}
      />

      {/* Account Switcher Bar */}
      <HolderSwitcher
        accounts={accounts}
        currentAccount={currentAccount}
        onSelectAccount={handleSelectAccount}
        onVerifyAndSwitch={handleVerifyAndSwitch}
      />

      {/* Global Toast */}
      {toast && (
        <div className={`toast-box ${toast.type === 'error' ? 'toast-error' : 'toast-success'}`}>
          {toast.type === 'error' ? <AlertCircle size={18} color="#ef4444" /> : <CheckCircle2 size={18} color="#10b981" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main Content */}
      <main className="container" style={{ flex: 1 }}>
        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '16px', borderRadius: '10px', margin: '20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
            <button
              onClick={() => loadAccounts()}
              style={{ background: '#b91c1c', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer' }}
            >
              Retry
            </button>
          </div>
        )}

        {loading && !currentAccount ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
            <RefreshCw size={36} className="animate-spin" style={{ margin: '0 auto 12px auto' }} />
            <p style={{ fontWeight: 600 }}>Securing Bank Ledger Connection...</p>
          </div>
        ) : activeView === 'customer' ? (
          <div>
            {/* Account Summary & Action Card */}
            <AccountSummaryCard
              account={currentAccount}
              onOpenDeposit={() => setIsDepositOpen(true)}
              onOpenWithdraw={() => setIsWithdrawOpen(true)}
            />

            {/* Passbook Ledger */}
            <PassbookLedger
              transactions={transactions}
              accountNumber={currentAccount?.accountNumber}
            />
          </div>
        ) : (
          /* Bank Manager Dashboard */
          <BankManagerDashboard
            accounts={accounts}
            onSelectAccount={handleSelectAccount}
            onAccountStatusChanged={handleAccountStatusChanged}
            onRefreshData={loadAccounts}
          />
        )}
      </main>

      {/* Footer */}
      <footer style={{ background: '#0f172a', color: '#94a3b8', padding: '24px 0', borderTop: '1px solid #1e293b', fontSize: '0.825rem' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <strong style={{ color: '#fff' }}>TrustBank</strong> — MERN Savings Account Deposit & Withdrawal System
          </div>
          <div>
            Enforcing Mandatory $100 Savings Minimum Balance & Security PIN Verification for Genuine Holders
          </div>
        </div>
      </footer>

      {/* Modals */}
      <DepositModal
        account={currentAccount}
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        onSuccess={handleDepositSuccess}
      />

      <WithdrawModal
        account={currentAccount}
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        onSuccess={handleWithdrawSuccess}
      />

      <OpenAccountModal
        isOpen={isOpenAccountOpen}
        onClose={() => setIsOpenAccountOpen(false)}
        onAccountCreated={handleAccountCreated}
      />
    </div>
  );
}
