import React, { useState } from 'react';
import {
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowDownLeft,
  ArrowUpRight,
  AlertTriangle,
  Lock,
  Copy,
  Check,
} from 'lucide-react';

export default function AccountSummaryCard({
  account,
  onOpenDeposit,
  onOpenWithdraw,
}) {
  const [showBalance, setShowBalance] = useState(true);
  const [copied, setCopied] = useState(false);

  if (!account) return null;

  const minBalance = account.minimumBalance || 100.0;
  const availableToWithdraw = Math.max(0, account.balance - minBalance);
  const isFrozen = account.status === 'Frozen';

  const handleCopyAcc = () => {
    navigator.clipboard.writeText(account.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className="account-hero-card">
        <div className="card-top-row">
          <div>
            <div className="holder-badge-group">
              <h2 className="holder-title">{account.holderName}</h2>
              {account.kycVerified && (
                <span className="kyc-badge">
                  <ShieldCheck size={14} />
                  KYC Genuine Verified
                </span>
              )}
              {isFrozen && (
                <span
                  style={{
                    background: 'rgba(239, 68, 68, 0.25)',
                    color: '#fca5a5',
                    padding: '3px 9px',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  Account Frozen
                </span>
              )}
            </div>

            <div className="account-number-pill">
              <span>Savings Account:</span>
              <strong className="mono" style={{ color: '#f8fafc', letterSpacing: '0.05em' }}>
                {account.accountNumber}
              </strong>
              <button
                onClick={handleCopyAcc}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
                title="Copy Account Number"
              >
                {copied ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block' }}>Account Type</span>
            <strong style={{ fontSize: '1rem', color: '#6ee7b7' }}>{account.accountType}</strong>
          </div>
        </div>

        {/* Balance Display */}
        <div className="balance-showcase">
          <div className="balance-label">
            <span>Current Total Savings Balance</span>
            <button
              onClick={() => setShowBalance(!showBalance)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
              title={showBalance ? 'Hide balance' : 'Show balance'}
            >
              {showBalance ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          <div className="balance-amount mono">
            {showBalance ? (
              <>
                ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                <span className="apy-tag">{account.interestRate}% APY</span>
              </>
            ) : (
              '••••••••••'
            )}
          </div>
        </div>

        {/* Financial Rules & Metadata Row */}
        <div className="account-meta-stats">
          <div className="meta-stat">
            <span>Available for Withdrawal: </span>
            <strong className="mono">
              ${availableToWithdraw.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </strong>
          </div>

          <div className="meta-stat">
            <span>Mandatory Minimum Balance: </span>
            <strong className="mono">${minBalance.toFixed(2)}</strong>
          </div>

          <div className="meta-stat">
            <span>Daily Withdrawal Limit: </span>
            <strong className="mono">${(account.dailyWithdrawalLimit || 5000).toFixed(2)}</strong>
          </div>

          <div className="meta-stat">
            <span>Government KYC ID: </span>
            <strong>{account.governmentId}</strong>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="quick-actions-bar">
        <button
          className="action-btn-deposit"
          onClick={onOpenDeposit}
          disabled={isFrozen}
        >
          <ArrowDownLeft size={20} />
          <span>Deposit Money</span>
        </button>

        <button
          className="action-btn-withdraw"
          onClick={onOpenWithdraw}
          disabled={isFrozen}
        >
          <ArrowUpRight size={20} />
          <span>Withdraw Money</span>
        </button>
      </div>
    </div>
  );
}
