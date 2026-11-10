import React, { useState } from 'react';
import { ArrowUpRight, ShieldAlert, AlertTriangle, AlertCircle, X, ShieldCheck } from 'lucide-react';
import { bankApi } from '../services/api';

export default function WithdrawModal({ account, isOpen, onClose, onSuccess }) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('ATM / Online Withdrawal');
  const [pin, setPin] = useState(account?.plainPinForDemo || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !account) return null;

  const minBalance = account.minimumBalance || 100.0;
  const availableToWithdraw = Math.max(0, account.balance - minBalance);
  const numAmount = Number(amount) || 0;
  const projectedBalance = account.balance - numAmount;

  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (numAmount <= 0) {
      return setError('Please enter a valid withdrawal amount greater than $0.00');
    }

    if (numAmount > availableToWithdraw) {
      return setError(
        `Insufficient funds. Your Savings Account requires maintaining a mandatory minimum balance of $${minBalance.toFixed(
          2
        )}. Maximum you can withdraw is $${availableToWithdraw.toFixed(2)}.`
      );
    }

    if (!pin || pin.length < 4) {
      return setError('Please enter your 4-digit Security PIN to authorize this withdrawal.');
    }

    try {
      setLoading(true);
      const res = await bankApi.withdraw(account.accountNumber, pin, numAmount, description);
      onSuccess(res.message, res.data.newBalance);
      onClose();
    } catch (err) {
      setError(err.message || 'Withdrawal could not be processed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '6px', borderRadius: '8px' }}>
              <ArrowUpRight size={20} />
            </div>
            <div>
              <h3>Withdraw from Savings</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Account: {account.accountNumber} ({account.holderName})
              </p>
            </div>
          </div>
          <button
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Minimum Balance Rule Notice */}
          <div className="balance-limit-info">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span>Available to Withdraw:</span>
              <strong className="mono">${availableToWithdraw.toFixed(2)}</strong>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#1e3a8a' }}>
              * A mandatory minimum balance of <strong>${minBalance.toFixed(2)}</strong> must remain in your savings account at all times.
            </div>
          </div>

          {error && (
            <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleWithdrawSubmit}>
            {/* Amount */}
            <div className="form-field">
              <label>Withdrawal Amount (USD) *</label>
              <input
                type="number"
                step="0.01"
                min="1"
                max={availableToWithdraw}
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                autoFocus
              />
            </div>

            {/* Quick chips */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {[20, 50, 100, 200, 500].map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => setAmount(val.toString())}
                  disabled={val > availableToWithdraw}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid var(--border)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: val <= availableToWithdraw ? 'pointer' : 'not-allowed',
                    opacity: val <= availableToWithdraw ? 1 : 0.5,
                  }}
                >
                  ${val}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setAmount(availableToWithdraw.toFixed(2))}
                style={{
                  background: '#f1f5f9',
                  border: '1px solid #94a3b8',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#0f172a',
                  cursor: 'pointer',
                }}
              >
                Max Available (${availableToWithdraw.toFixed(2)})
              </button>
            </div>

            {/* Description */}
            <div className="form-field">
              <label>Remarks / Withdrawal Purpose</label>
              <input
                type="text"
                placeholder="e.g. Utility Bills, Medical, Cash Expense"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Genuine Holder PIN verification */}
            <div className="form-field">
              <label>
                Security Authorization PIN *{' '}
                <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#059669' }}>
                  (Demo PIN: {account.plainPinForDemo || '1234'})
                </span>
              </label>
              <input
                type="password"
                maxLength="6"
                placeholder="••••"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                required
              />
            </div>

            {/* Projected Remaining Balance preview */}
            <div
              style={{
                background: projectedBalance >= minBalance ? '#f8fafc' : '#fef2f2',
                border: '1px solid ' + (projectedBalance >= minBalance ? '#e2e8f0' : '#fecaca'),
                padding: '12px 14px',
                borderRadius: '8px',
                marginBottom: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.875rem',
              }}
            >
              <span style={{ color: projectedBalance >= minBalance ? '#334155' : '#b91c1c' }}>
                Remaining Balance after Withdrawal:
              </span>
              <strong
                className="mono"
                style={{ color: projectedBalance >= minBalance ? '#0f172a' : '#b91c1c' }}
              >
                ${projectedBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" className="filter-btn" onClick={onClose} disabled={loading}>
                Cancel
              </button>
              <button
                type="submit"
                className="action-btn-withdraw"
                style={{ flex: 'none', padding: '10px 24px' }}
                disabled={loading || numAmount > availableToWithdraw}
              >
                <ArrowUpRight size={16} />
                {loading ? 'Authorizing Withdrawal...' : `Withdraw $${numAmount > 0 ? numAmount.toFixed(2) : '0.00'}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
