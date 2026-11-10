import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  Save, 
  AlertCircle, 
  UserCheck, 
  Building,
  Check,
  IndianRupee
} from 'lucide-react';
import { api } from '../services/api';

export default function AttendanceTracker({ onNavigateToSalary, onDataChanged }) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [employees, setEmployees] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [supervisor, setSupervisor] = useState('Sister Mary (Duty Nurse Supervisor)');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load employees and existing attendance for date
  const loadData = async () => {
    try {
      setLoading(true);
      const [empList, attList] = await Promise.all([
        api.getEmployees(),
        api.getAttendance({ date: selectedDate })
      ]);

      setEmployees(empList.filter(e => e.status !== 'Inactive'));

      const map = {};
      // Initialize with existing records if any
      attList.forEach(a => {
        map[a.empId] = {
          status: a.status,
          shiftHours: a.shiftHours,
          overtimeHours: a.overtimeHours,
          remarks: a.remarks || ''
        };
      });

      // Default remaining to 'Present'
      empList.forEach(e => {
        if (!map[e.empId]) {
          map[e.empId] = {
            status: 'Present',
            shiftHours: 8,
            overtimeHours: 0,
            remarks: 'Regular ward duty'
          };
        }
      });

      setAttendanceMap(map);
    } catch (err) {
      console.error('Error loading attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  const updateStatus = (empId, status) => {
    const current = attendanceMap[empId] || {};
    const shiftHours = status === 'Present' ? 8 : status === 'Half-Day' ? 4 : 0;
    setAttendanceMap({
      ...attendanceMap,
      [empId]: {
        ...current,
        status,
        shiftHours
      }
    });
  };

  const updateOvertime = (empId, hours) => {
    const current = attendanceMap[empId] || {};
    setAttendanceMap({
      ...attendanceMap,
      [empId]: {
        ...current,
        overtimeHours: Math.max(0, Math.min(12, Number(hours)))
      }
    });
  };

  const updateRemarks = (empId, remarks) => {
    const current = attendanceMap[empId] || {};
    setAttendanceMap({
      ...attendanceMap,
      [empId]: {
        ...current,
        remarks
      }
    });
  };

  const handleSaveAll = async () => {
    try {
      setSaving(true);
      const records = Object.entries(attendanceMap).map(([empId, data]) => ({
        empId,
        status: data.status,
        shiftHours: data.shiftHours,
        overtimeHours: data.overtimeHours,
        supervisor,
        remarks: data.remarks
      }));

      await api.bulkMarkAttendance({
        date: selectedDate,
        supervisor,
        records
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      if (onDataChanged) onDataChanged();
    } catch (err) {
      alert('Error saving attendance: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Summaries
  const totalEmployees = employees.length;
  const presentCount = Object.values(attendanceMap).filter(v => v.status === 'Present').length;
  const halfDayCount = Object.values(attendanceMap).filter(v => v.status === 'Half-Day').length;
  const absentCount = Object.values(attendanceMap).filter(v => v.status === 'Absent').length;

  return (
    <div className="attendance-view">
      <div className="section-header">
        <div>
          <h2 className="section-title">Hospital Daily Attendance & Shift Roster</h2>
          <p className="section-subtitle">
            Log daily attendance, shift hours, and overtime for hospital daily wage employees
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-primary" onClick={handleSaveAll} disabled={saving}>
            <Save size={16} /> {saving ? 'Saving Roll-Call...' : 'Save Daily Attendance'}
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div style={{ background: '#d1fae5', border: '1px solid #10b981', color: '#065f46', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle size={18} />
          <span>Attendance successfully logged and stored for {selectedDate}!</span>
        </div>
      )}

      {/* Control bar */}
      <div className="toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={18} color="var(--primary)" />
            <label style={{ fontWeight: 600, fontSize: '0.88rem' }}>Attendance Date:</label>
            <input
              type="date"
              className="input-ctrl"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label style={{ fontWeight: 600, fontSize: '0.88rem' }}>Duty Supervisor:</label>
            <input
              type="text"
              className="input-ctrl"
              style={{ minWidth: '240px' }}
              value={supervisor}
              onChange={(e) => setSupervisor(e.target.value)}
              placeholder="e.g. Sister In-Charge / Duty Admin"
            />
          </div>
        </div>

        {/* Quick metrics on active screen */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span className="badge badge-present">Present: {presentCount}</span>
          <span className="badge badge-halfday">Half-Day: {halfDayCount}</span>
          <span className="badge badge-absent">Absent: {absentCount}</span>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="table-container">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading roster...</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Emp ID</th>
                <th>Employee & Role</th>
                <th>Department</th>
                <th>Daily Rate</th>
                <th>Attendance Status</th>
                <th>Shift Hours</th>
                <th>Overtime (Hrs)</th>
                <th>Duty Remarks</th>
                <th>Est. Daily Wage</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => {
                const current = attendanceMap[emp.empId] || { status: 'Present', shiftHours: 8, overtimeHours: 0, remarks: '' };
                const otHourly = emp.overtimeHourlyRate || Math.round(emp.dailyWageRate / 8 * 1.5);
                const baseEst = current.status === 'Present' ? emp.dailyWageRate : current.status === 'Half-Day' ? emp.dailyWageRate / 2 : 0;
                const otEst = (current.overtimeHours || 0) * otHourly;
                const totalDayEst = baseEst + otEst;

                return (
                  <tr key={emp.empId}>
                    <td style={{ fontFamily: 'monospace', fontWeight: '700', color: '#0369a1' }}>
                      {emp.empId}
                    </td>
                    <td>
                      <div style={{ fontWeight: '700', color: '#0f172a' }}>{emp.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{emp.role}</div>
                    </td>
                    <td>
                      <span className="badge badge-dept">{emp.department}</span>
                    </td>
                    <td style={{ fontWeight: 600, color: '#334155' }}>
                      ₹{emp.dailyWageRate}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button
                          type="button"
                          className={`btn btn-sm ${current.status === 'Present' ? 'btn-success' : 'btn-outline'}`}
                          onClick={() => updateStatus(emp.empId, 'Present')}
                        >
                          Present
                        </button>
                        <button
                          type="button"
                          className={`btn btn-sm ${current.status === 'Half-Day' ? 'btn-secondary' : 'btn-outline'}`}
                          style={current.status === 'Half-Day' ? { background: '#fef3c7', color: '#92400e', borderColor: '#fde68a' } : {}}
                          onClick={() => updateStatus(emp.empId, 'Half-Day')}
                        >
                          Half-Day
                        </button>
                        <button
                          type="button"
                          className={`btn btn-sm ${current.status === 'Absent' ? 'btn-danger' : 'btn-outline'}`}
                          onClick={() => updateStatus(emp.empId, 'Absent')}
                        >
                          Absent
                        </button>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>
                        {current.shiftHours} hrs
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <input
                          type="number"
                          min="0"
                          max="12"
                          className="input-ctrl"
                          style={{ width: '65px', padding: '0.25rem 0.5rem', textAlign: 'center' }}
                          value={current.overtimeHours || 0}
                          onChange={(e) => updateOvertime(emp.empId, e.target.value)}
                        />
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>hrs</span>
                      </div>
                    </td>
                    <td>
                      <input
                        type="text"
                        className="input-ctrl"
                        style={{ width: '180px', padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                        value={current.remarks || ''}
                        onChange={(e) => updateRemarks(emp.empId, e.target.value)}
                        placeholder="e.g. ICU assistance"
                      />
                    </td>
                    <td>
                      <strong style={{ color: '#059669', fontSize: '0.92rem' }}>
                        ₹{totalDayEst}
                      </strong>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer Banner */}
      <div style={{ marginTop: '1.5rem', background: '#e0f2fe', border: '1px solid #bae6fd', borderRadius: '8px', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontWeight: 700, color: '#0369a1', fontSize: '0.95rem' }}>
            Daily Attendance Summary for {selectedDate}
          </div>
          <div style={{ fontSize: '0.82rem', color: '#075985' }}>
            {presentCount} Present &bull; {halfDayCount} Half-Day &bull; {absentCount} Absent. Don't forget to save changes!
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-primary" onClick={handleSaveAll} disabled={saving}>
            <Save size={16} /> Save Attendance
          </button>
          <button className="btn btn-success" onClick={() => onNavigateToSalary && onNavigateToSalary(null)}>
            <IndianRupee size={16} /> Proceed to Pay Today's Wages
          </button>
        </div>
      </div>
    </div>
  );
}
