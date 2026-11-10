import React, { useState } from 'react';
import {
  BookOpen,
  ArrowDownLeft,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  Calendar,
  FileSpreadsheet,
} from 'lucide-react';

export default function PassbookLedger({ transactions, accountNumber }) {
  const [filterType, setFilterType] = useState('ALL');

  const filtered = transactions.filter((t) => {
    if (filterType === 'DEPOSITS') return t.type === 'Deposit' || t.type === 'Initial_Deposit';
    if (filterType === 'WITHDRAWALS') return t.type === 'Withdrawal';
    return true;
  });

  const totalDeposits = transactions
    .filter((t) => t.type === 'Deposit' || t.type === 'Initial_Deposit')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalWithdrawals = transactions
    .filter((t) => t.type === 'Withdrawal')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  return (
    <div className="ledger-card">
      <div className="ledger-header">
        <div>
          <div className="ledger-title">
            <BookOpen size={20} color="#059669" />
            <span>Savings Account Passbook & Transaction Ledger</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Permanent record of verified deposits, withdrawals, and balance updates for {accountNumber}.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="filter-btn-group">
          <button
            className={`filter-btn ${filterType === 'ALL' ? 'active' : ''}`}
            onClick={() => setFilterType('ALL')}
          >
            All Activity ({transactions.length})
          </button>
          <button
            className={`filter-btn ${filterType === 'DEPOSITS' ? 'active' : ''}`}
            onClick={() => setFilterType('DEPOSITS')}
          >
            Deposits (+${totalDeposits.toFixed(2)})
          </button>
          <button
            className={`filter-btn ${filterType === 'WITHDRAWALS' ? 'active' : ''}`}
            onClick={() => setFilterType('WITHDRAWALS')}
          >
            Withdrawals (-${totalWithdrawals.toFixed(2)})
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <FileSpreadsheet size={36} style={{ margin: '0 auto 10px auto', opacity: 0.5 }} />
          <p style={{ fontWeight: 600 }}>No transactions recorded for this filter.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="ledger-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Transaction Ref</th>
                <th>Type</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Balance After</th>
                <th>Authorization</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((txn) => {
                const isDeposit = txn.type === 'Deposit' || txn.type === 'Initial_Deposit';
                return (
                  <tr key={txn._id || txn.transactionId}>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                        {new Date(txn.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {new Date(txn.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>

                    <td className="mono" style={{ fontSize: '0.8rem', color: '#475569' }}>
                      {txn.transactionId}
                    </td>

                    <td>
                      {txn.type === 'Deposit' && (
                        <span className="type-badge type-deposit">
                          <ArrowDownLeft size={12} /> Deposit
                        </span>
                      )}
                      {txn.type === 'Withdrawal' && (
                        <span className="type-badge type-withdrawal">
                          <ArrowUpRight size={12} /> Withdrawal
                        </span>
                      )}
                      {txn.type === 'Initial_Deposit' && (
                        <span className="type-badge type-initial">
                          <CheckCircle2 size={12} /> Account Opening
                        </span>
                      )}
                    </td>

                    <td style={{ fontSize: '0.875rem' }}>
                      {txn.description}
                    </td>

                    <td className="mono">
                      <span className={isDeposit ? 'amount-plus' : 'amount-minus'}>
                        {isDeposit ? '+' : '-'}${Number(txn.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </td>

                    <td className="mono" style={{ fontWeight: 700 }}>
                      ${Number(txn.balanceAfter).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    <td>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          background: '#f1f5f9',
                          color: '#334155',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          display: 'inline-block',
                          maxWidth: '190px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                        title={txn.initiatedBy}
                      >
                        {txn.initiatedBy}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
