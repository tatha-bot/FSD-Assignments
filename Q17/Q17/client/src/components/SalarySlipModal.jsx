import React from 'react';
import { 
  Printer, 
  X, 
  CheckCircle2, 
  Building2, 
  ShieldCheck, 
  Download 
} from 'lucide-react';

export default function SalarySlipModal({ payment, onClose }) {
  if (!payment) return null;

  const handlePrint = () => {
    window.print();
  };

  // Convert number to Indian words
  const numberToWords = (num) => {
    const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    const n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return '';
    let str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'Rupees Only' : 'Rupees Only';
    return str;
  };

  const amountInWords = numberToWords(Math.round(payment.netPayable || 0));

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '780px' }}>
        <div className="modal-header no-print">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building2 size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.1rem' }}>Hospital Daily Wage Salary Voucher</h3>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-primary btn-sm" onClick={handlePrint}>
              <Printer size={15} /> Print / Save as PDF
            </button>
            <button 
              onClick={onClose}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="modal-body">
          {/* Printable Voucher Content */}
          <div className="salary-slip-container printable-slip">
            {/* Header */}
            <div className="hospital-slip-header">
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                <Building2 size={26} color="#0284c7" />
                <span className="hospital-slip-title">MEDICARE SUPER-SPECIALITY HOSPITAL</span>
              </div>
              <div className="hospital-slip-subtitle">
                Accredited Multi-Speciality Tertiary Care Healthcare Centre &bull; Reg No: HSP/WB/2026/8941<br />
                124 Medical Campus Road, Central Healthcare District &bull; Phone: (033) 2456-7890
              </div>
              <div className="slip-tag">DAILY WAGE SALARY DISBURSEMENT RECEIPT</div>
            </div>

            {/* Voucher Metadata */}
            <div className="slip-info-grid">
              <div>
                <div><strong>Voucher ID:</strong> {payment.paymentId}</div>
                <div><strong>Transaction Ref:</strong> {payment.transactionReference}</div>
                <div><strong>Disbursal Date:</strong> {new Date(payment.disbursedAt || payment.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                <div><strong>Payment Mode:</strong> {payment.paymentMethod}</div>
              </div>
              <div>
                <div><strong>Employee ID:</strong> {payment.empId}</div>
                <div><strong>Worker Name:</strong> <span style={{ fontSize: '1rem', fontWeight: 800 }}>{payment.employeeName}</span></div>
                <div><strong>Role / Designation:</strong> {payment.role}</div>
                <div><strong>Hospital Ward/Unit:</strong> {payment.department}</div>
              </div>
            </div>

            {/* Attendance & Shift Details */}
            <div style={{ marginBottom: '1rem', fontSize: '0.85rem', background: '#f1f5f9', padding: '0.6rem 0.85rem', borderRadius: '4px', display: 'flex', justifyContent: 'space-between' }}>
              <span><strong>Wage Period:</strong> {payment.startDate} to {payment.endDate} ({payment.periodType})</span>
              <span><strong>Attendance:</strong> {payment.daysPresent} Days Present, {payment.halfDays} Half-Days, {payment.totalOvertimeHours} Overtime Hrs</span>
            </div>

            {/* Itemized Calculation */}
            <table className="slip-table">
              <thead>
                <tr>
                  <th>Description / Wage Component</th>
                  <th>Rate Calculation</th>
                  <th style={{ textAlign: 'right' }}>Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Base Daily Wage (Shifts Worked)</td>
                  <td>
                    {payment.daysPresent} full @ ₹{payment.dailyWageRate} 
                    {payment.halfDays > 0 && ` + ${payment.halfDays} half @ ₹${payment.dailyWageRate/2}`}
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{payment.baseWage}</td>
                </tr>
                {payment.overtimeWage > 0 && (
                  <tr>
                    <td>Overtime Duty Wages</td>
                    <td>{payment.totalOvertimeHours} hours @ ₹{payment.overtimeHourlyRate}/hr</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{payment.overtimeWage}</td>
                  </tr>
                )}
                {payment.hospitalAllowance > 0 && (
                  <tr>
                    <td>Hospital Risk & Ward Duty Allowance</td>
                    <td>Hazard/Night shift allowance</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{payment.hospitalAllowance}</td>
                  </tr>
                )}
                {payment.deductions > 0 && (
                  <tr>
                    <td>Statutory Deductions / Uniform Advance</td>
                    <td>Approved deduction</td>
                    <td style={{ textAlign: 'right', color: '#dc2626', fontWeight: 600 }}>- ₹{payment.deductions}</td>
                  </tr>
                )}
                <tr className="slip-total-row">
                  <td colSpan="2">TOTAL NET SALARY DISBURSED</td>
                  <td style={{ textAlign: 'right' }}>₹{payment.netPayable?.toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>

            {/* Amount in Words */}
            <div style={{ fontSize: '0.85rem', marginBottom: '1.25rem', padding: '0.5rem 0.85rem', background: '#f8fafc', borderLeft: '4px solid #10b981' }}>
              <strong>Amount in Words:</strong> {amountInWords}
            </div>

            {/* Signatures */}
            <div className="slip-signatures">
              <div className="signature-box">
                <div className="signature-line"></div>
                <div>Authorized Signatory</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{payment.disbursedBy || 'Hospital Accounts Officer'}</div>
              </div>

              <div className="signature-box">
                <div className="signature-line"></div>
                <div>Hospital Cashier / Seal</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Medicare Accounts Dept.</div>
              </div>

              <div className="signature-box">
                <div className="signature-line"></div>
                <div>Worker Signature / Thumb Impression</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Received in full & final</div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer no-print">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button className="btn btn-primary" onClick={handlePrint}>
            <Printer size={16} /> Print Official Voucher
          </button>
        </div>
      </div>
    </div>
  );
}
