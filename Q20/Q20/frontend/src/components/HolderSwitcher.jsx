import React, { useState } from 'react';
import { ShieldCheck, Users, KeyRound, Search, CheckCircle2 } from 'lucide-react';

export default function HolderSwitcher({
  accounts,
  currentAccount,
  onSelectAccount,
  onVerifyAndSwitch,
}) {
  const [lookupAccNum, setLookupAccNum] = useState('');
  const [lookupPin, setLookupPin] = useState('');
  const [showLookupModal, setShowLookupModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLookupSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      setLoading(true);
      await onVerifyAndSwitch(lookupAccNum.trim(), lookupPin.trim());
      setShowLookupModal(false);
      setLookupAccNum('');
      setLookupPin('');
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check Account Number and PIN.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="holder-switcher-bar">
      <div className="container holder-switcher-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={16} color="#34d399" />
          <span style={{ fontWeight: 600, color: '#94a3b8' }}>Verified Genuine Holders:</span>
          <div className="demo-pills">
            {accounts.slice(0, 4).map((acc) => (
              <button
                key={acc.accountNumber}
                className={`demo-pill ${currentAccount?.accountNumber === acc.accountNumber ? 'active' : ''}`}
                onClick={() => onSelectAccount(acc)}
              >
                <span>{acc.holderName}</span>
                <span className="mono" style={{ opacity: 0.8, fontSize: '0.7rem' }}>
                  ({acc.plainPinForDemo ? `PIN: ${acc.plainPinForDemo}` : 'Verified'})
                </span>
              </button>
            ))}
          </div>
        </div>

        <button
          className="demo-pill"
          style={{ background: '#0f172a', borderColor: '#334155' }}
          onClick={() => setShowLookupModal(true)}
        >
          <Search size={13} />
          <span>Authenticate by Account # & PIN</span>
        </button>
      </div>

      {/* Account Verification Modal */}
      {showLookupModal && (
        <div className="modal-backdrop" onClick={() => setShowLookupModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Genuine Account Holder Login</h3>
              <button
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                onClick={() => setShowLookupModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Verify identity by providing the unique Savings Account Number and 4-Digit Security PIN.
              </p>

              {errorMsg && (
                <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px' }}>
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleLookupSubmit}>
                <div className="form-field">
                  <label>Savings Account Number</label>
                  <input
                    type="text"
                    placeholder="e.g. SB-10029384"
                    value={lookupAccNum}
                    onChange={(e) => setLookupAccNum(e.target.value)}
                    required
                  />
                </div>

                <div className="form-field">
                  <label>4-Digit Security PIN</label>
                  <input
                    type="password"
                    maxLength="6"
                    placeholder="••••"
                    value={lookupPin}
                    onChange={(e) => setLookupPin(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                  <button
                    type="button"
                    className="filter-btn"
                    onClick={() => setShowLookupModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-open-acc" disabled={loading}>
                    <KeyRound size={15} />
                    {loading ? 'Verifying...' : 'Verify & Load Account'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
