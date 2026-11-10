import React, { useState } from 'react';
import { UserPlus, ShieldCheck, CheckCircle2, AlertCircle, X, Sparkles } from 'lucide-react';
import { bankApi } from '../services/api';

export default function OpenAccountModal({ isOpen, onClose, onAccountCreated }) {
  const [formData, setFormData] = useState({
    holderName: '',
    email: '',
    phone: '',
    governmentId: '',
    pin: '',
    initialDeposit: 500,
    accountType: 'High-Yield Savings',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newlyCreated, setNewlyCreated] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.holderName.trim()) {
      return setError('Please provide the full legal name of the account holder.');
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      return setError('Please provide a valid email address.');
    }
    if (!formData.governmentId.trim()) {
      return setError('Government ID / Passport / National ID is mandatory for genuine holder KYC.');
    }
    if (!formData.pin || formData.pin.length < 4) {
      return setError('Please set a secure 4-digit Security PIN for authorizing transactions.');
    }

    const minDeposit = 100.0;
    if (Number(formData.initialDeposit) < minDeposit) {
      return setError(`Opening a Savings Account requires a minimum initial deposit of $${minDeposit.toFixed(2)}.`);
    }

    try {
      setLoading(true);
      const res = await bankApi.createAccount(formData);
      setNewlyCreated(res.data);
      if (onAccountCreated) {
        onAccountCreated(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to open savings account.');
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
              <UserPlus size={20} />
            </div>
            <div>
              <h3>Open New Savings Account</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                KYC-Verified Savings Account Onboarding
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
          {newlyCreated ? (
            <div style={{ textAlign: 'center', padding: '24px 8px' }}>
              <CheckCircle2 size={52} color="#10b981" style={{ margin: '0 auto 14px auto' }} />
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '6px' }}>
                Account Successfully Opened!
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
                Welcome to TrustBank, <strong>{newlyCreated.holderName}</strong>. Your savings account is active and verified.
              </p>

              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid var(--border)',
                  padding: '16px',
                  borderRadius: '12px',
                  marginBottom: '24px',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Account Number:</span>
                  <strong className="mono" style={{ color: '#059669', fontSize: '1.1rem' }}>
                    {newlyCreated.accountNumber}
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Initial Balance:</span>
                  <strong className="mono">${Number(newlyCreated.balance).toFixed(2)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Account Type:</span>
                  <strong>{newlyCreated.accountType}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>KYC Status:</span>
                  <span style={{ color: '#059669', fontWeight: 700, fontSize: '0.85rem' }}>
                    ✓ Verified Genuine Holder
                  </span>
                </div>
              </div>

              <button
                className="btn-open-acc"
                style={{ margin: '0 auto', width: '100%', justifyContent: 'center' }}
                onClick={onClose}
              >
                Go to My Account Dashboard
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <div className="form-field">
                <label>Full Legal Holder Name *</label>
                <input
                  type="text"
                  name="holderName"
                  placeholder="e.g. Jordan Miller"
                  value={formData.holderName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-field">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="jordan@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '12px' }}>
                <div className="form-field">
                  <label>Government KYC ID / Passport *</label>
                  <input
                    type="text"
                    name="governmentId"
                    placeholder="e.g. P9812401 or SSN/PAN"
                    value={formData.governmentId}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-field">
                  <label>4-Digit PIN *</label>
                  <input
                    type="password"
                    name="pin"
                    maxLength="6"
                    placeholder="••••"
                    value={formData.pin}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-field">
                  <label>Initial Opening Deposit ($) *</label>
                  <input
                    type="number"
                    name="initialDeposit"
                    min="100"
                    step="0.01"
                    placeholder="Min $100.00"
                    value={formData.initialDeposit}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Savings Account Type</label>
                  <select name="accountType" value={formData.accountType} onChange={handleChange}>
                    <option value="High-Yield Savings">High-Yield Savings (3.85% APY)</option>
                    <option value="Standard Savings">Standard Savings (2.50% APY)</option>
                    <option value="Student Savings">Student Savings (3.50% APY)</option>
                  </select>
                </div>
              </div>

              <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                * All TrustBank savings accounts require a mandatory minimum balance of <strong>$100.00</strong> to remain open.
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="filter-btn" onClick={onClose} disabled={loading}>
                  Cancel
                </button>
                <button type="submit" className="btn-open-acc" disabled={loading}>
                  <ShieldCheck size={16} />
                  {loading ? 'Creating Account...' : 'Open & Verify Account'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
