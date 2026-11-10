import React, { useState } from 'react';
import { ArrowDownLeft, ShieldCheck, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { bankApi } from '../services/api';

const QUICK_AMOUNTS = [50, 100, 250, 500, 1000, 2500];

export default function DepositModal({ account, isOpen, onClose, onSuccess }) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('Cash Deposit to Savings');
  const [pin, setPin] = useState(account?.plainPinForDemo || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !account) return null;

  const numAmount = Number(amount) || 0;
  const projectedBalance = account.balance + numAmount;

  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (numAmount <= 0) {
      return setError('Please enter a valid deposit amount greater than $0.00');
    }
    if (!pin || pin.length < 4) {
      return setError('Please enter your 4-digit Security PIN to authenticate this deposit.');
    }

    try {
      setLoading(true);
      const res = await bankApi.deposit(account.accountNumber, pin, numAmount, description);
      onSuccess(res.message, res.data.newBalance);
      onClose();
    } catch (err) {
      setError(err.message || 'Deposit could not be completed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ background: '#ecfdf5', color: '#047857', padding: '6px', borderRadius: '8px' }}>
              <ArrowDownLeft size={20} />
            </div>
            <div>
              <h3>Deposit into Savings</h3>
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
          {/* Security Banner */}
          <div className="pin-security-banner">
            <ShieldCheck size={20} color="#059669" />
            <div>
              <strong>Genuine Account Holder Verification</strong>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Funds will be deposited immediately into your high-yield savings account balance upon PIN verification.
              </div>
            </div>
          </div>

          {error && (
            <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleDepositSubmit}>
            {/* Amount */}
            <div className="form-field">
              <label>Deposit Amount (USD) *</label>
              <input
                type="number"
                step="0.01"
                min="1"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                autoFocus
              />
            </div>

            {/* Quick preset chips */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {QUICK_AMOUNTS.map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => setAmount(val.toString())}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid var(--border)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  +${val}
                </button>
              ))}
            </div>

            {/* Description */}
            <div className="form-field">
              <label>Remarks / Purpose of Deposit</label>
              <input
                type="text"
                placeholder="e.g. Monthly Savings, Dividend, Bonus"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* PIN Authentication */}
            <div className="form-field">
              <label>
                4-Digit Security PIN *{' '}
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

            {/* Projected Balance preview */}
            <div
              style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                padding: '12px 14px',
                borderRadius: '8px',
                marginBottom: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.875rem',
              }}
            >
              <span style={{ color: '#166534' }}>Projected New Balance:</span>
              <strong className="mono" style={{ color: '#15803d' }}>
                ${projectedBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" className="filter-btn" onClick={onClose} disabled={loading}>
                Cancel
              </button>
              <button
                type="submit"
                className="action-btn-deposit"
                style={{ flex: 'none', padding: '10px 24px' }}
                disabled={loading}
              >
                <ArrowDownLeft size={16} />
                {loading ? 'Processing Deposit...' : `Deposit $${numAmount > 0 ? numAmount.toFixed(2) : '0.00'}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
