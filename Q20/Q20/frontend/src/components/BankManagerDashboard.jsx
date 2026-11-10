import React, { useState, useEffect } from 'react';
import {
  Landmark,
  ShieldCheck,
  ShieldAlert,
  ArrowDownLeft,
  ArrowUpRight,
  Users,
  Search,
  ExternalLink,
  Lock,
  Unlock,
} from 'lucide-react';
import { bankApi } from '../services/api';

export default function BankManagerDashboard({
  accounts,
  onSelectAccount,
  onAccountStatusChanged,
  onRefreshData,
}) {
  const [globalTransactions, setGlobalTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingTxns, setLoadingTxns] = useState(false);

  useEffect(() => {
    const fetchGlobalTxns = async () => {
      try {
        setLoadingTxns(true);
        const res = await bankApi.getTransactions();
        setGlobalTransactions(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingTxns(false);
      }
    };
    fetchGlobalTxns();
  }, []);

  const totalBankReserves = accounts.reduce((sum, a) => sum + Number(a.balance), 0);
  const totalDepositsVolume = globalTransactions
    .filter((t) => t.type === 'Deposit' || t.type === 'Initial_Deposit')
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const totalWithdrawalsVolume = globalTransactions
    .filter((t) => t.type === 'Withdrawal')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const filteredAccounts = accounts.filter(
    (a) =>
      a.holderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.accountNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleFreeze = async (account) => {
    const nextStatus = account.status === 'Active' ? 'Frozen' : 'Active';
    try {
      const res = await bankApi.updateStatus(account.accountNumber, nextStatus);
      onAccountStatusChanged(res.data);
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  return (
    <div style={{ paddingBottom: '60px' }}>
      <div style={{ margin: '24px 0 20px 0' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Bank Manager & Teller Audit Portal</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Real-time institutional oversight of customer savings accounts, KYC genuineness, and fund flows.
        </p>
      </div>

      {/* Institutional Metrics Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        <div style={{ background: '#0f172a', color: '#fff', padding: '20px', borderRadius: '12px' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>
            Total Customer Savings Reserves
          </span>
          <div className="mono" style={{ fontSize: '1.85rem', fontWeight: 800, color: '#34d399', margin: '4px 0' }}>
            ${totalBankReserves.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>Across {accounts.length} verified accounts</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid var(--border)', padding: '20px', borderRadius: '12px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Total Deposits Processed
          </span>
          <div className="mono" style={{ fontSize: '1.85rem', fontWeight: 800, color: '#059669', margin: '4px 0' }}>
            +${totalDepositsVolume.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified Genuine Deposits</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid var(--border)', padding: '20px', borderRadius: '12px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Total Withdrawals Handled
          </span>
          <div className="mono" style={{ fontSize: '1.85rem', fontWeight: 800, color: '#dc2626', margin: '4px 0' }}>
            -${totalWithdrawalsVolume.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PIN-Authenticated Withdrawals</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid var(--border)', padding: '20px', borderRadius: '12px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            KYC Verification Rate
          </span>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#2563eb', margin: '4px 0' }}>
            100% Genuine
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>All holders KYC authenticated</div>
        </div>
      </div>

      {/* Accounts List Table */}
      <div className="ledger-card" style={{ marginBottom: '32px' }}>
        <div className="ledger-header">
          <div className="ledger-title">
            <Users size={20} color="#059669" />
            <span>Customer Savings Accounts Directory</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search by name, account #, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border)',
                fontSize: '0.85rem',
                minWidth: '240px',
              }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="ledger-table">
            <thead>
              <tr>
                <th>Account Holder</th>
                <th>Account Number</th>
                <th>Account Type</th>
                <th>Current Balance</th>
                <th>KYC Document ID</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.map((acc) => (
                <tr key={acc.accountNumber}>
                  <td>
                    <strong style={{ display: 'block' }}>{acc.holderName}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{acc.email}</span>
                  </td>

                  <td className="mono" style={{ fontWeight: 700, color: '#0f172a' }}>
                    {acc.accountNumber}
                  </td>

                  <td>
                    <span style={{ fontSize: '0.85rem' }}>{acc.accountType}</span>
                    <span style={{ fontSize: '0.75rem', color: '#059669', display: 'block', fontWeight: 600 }}>
                      {acc.interestRate}% APY
                    </span>
                  </td>

                  <td className="mono" style={{ fontWeight: 800, fontSize: '0.95rem' }}>
                    ${Number(acc.balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>

                  <td>
                    <span
                      style={{
                        background: '#ecfdf5',
                        color: '#047857',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}
                    >
                      ✓ {acc.governmentId}
                    </span>
                  </td>

                  <td>
                    <span
                      style={{
                        background: acc.status === 'Active' ? '#ecfdf5' : '#fee2e2',
                        color: acc.status === 'Active' ? '#047857' : '#b91c1c',
                        padding: '3px 8px',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                      }}
                    >
                      ● {acc.status}
                    </span>
                  </td>

                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => onSelectAccount(acc)}
                        className="filter-btn"
                        style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                        title="View and transact as this account holder"
                      >
                        Select Account
                      </button>

                      <button
                        onClick={() => handleToggleFreeze(acc)}
                        className="filter-btn"
                        style={{
                          padding: '4px 8px',
                          color: acc.status === 'Active' ? '#b91c1c' : '#047857',
                        }}
                        title={acc.status === 'Active' ? 'Freeze Account' : 'Activate Account'}
                      >
                        {acc.status === 'Active' ? <Lock size={13} /> : <Unlock size={13} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
