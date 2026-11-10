import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import JobCard from './components/JobCard';
import JobDetailsModal from './components/JobDetailsModal';
import ApplyModal from './components/ApplyModal';
import PostJobModal from './components/PostJobModal';
import RecruiterDashboard from './components/RecruiterDashboard';
import { jobApi } from './services/api';
import { Briefcase, AlertCircle, CheckCircle, SlidersHorizontal, RefreshCw } from 'lucide-react';

const CATEGORIES = ['All', 'Engineering', 'Design', 'Marketing', 'Product', 'Sales', 'Support'];

export default function App() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('vacancies'); // 'vacancies' or 'dashboard'

  // Search & Filter State
  const [searchKeyword, setSearchKeyword] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'vacancies'

  // Modals
  const [detailsModalJob, setDetailsModalJob] = useState(null);
  const [applyModalJob, setApplyModalJob] = useState(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Fetch Jobs
  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await jobApi.getJobs({
        search: searchKeyword,
        location: locationFilter,
        jobType: jobTypeFilter,
        category: selectedCategory,
      });
      setJobs(res.data || []);
    } catch (err) {
      console.error(err);
      setError('Could not connect to backend API. Please make sure the backend server is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [selectedCategory, jobTypeFilter]);

  // Seed sample data
  const handleSeedDemo = async () => {
    try {
      setLoading(true);
      const res = await jobApi.seedJobs();
      setJobs(res.data || []);
      showToast('Loaded 6 demo vacancies across engineering, design & marketing!');
    } catch (err) {
      showToast('Error seeding demo data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handlers for job state changes
  const handleJobCreated = (newJob) => {
    setJobs((prev) => [newJob, ...prev]);
    showToast(`Vacancy "${newJob.title}" posted successfully!`);
  };

  const handleJobUpdated = (updatedJob) => {
    setJobs((prev) => prev.map((j) => (j._id === updatedJob._id ? updatedJob : j)));
  };

  const handleJobDeleted = (deletedId) => {
    setJobs((prev) => prev.filter((j) => j._id !== deletedId));
  };

  const handleApplicationSuccess = (application) => {
    showToast(`Application successfully sent for review! Reference: ${application._id}`);
    fetchJobs(); // refresh application count
  };

  // Compute metrics
  const totalOpenVacancies = jobs.reduce((sum, j) => sum + (Number(j.vacanciesCount) || 1), 0);

  // Filtered & Sorted Jobs
  const displayedJobs = [...jobs].sort((a, b) => {
    if (sortBy === 'vacancies') {
      return (b.vacanciesCount || 1) - (a.vacanciesCount || 1);
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPostModal={() => setIsPostModalOpen(true)}
        onSeedDemo={handleSeedDemo}
        jobCount={jobs.length}
      />

      {/* Global Toast */}
      {toastMessage && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 120 }}>
          <div className="alert-toast alert-success" style={{ boxShadow: 'var(--shadow-lg)' }}>
            <CheckCircle size={18} />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {activeTab === 'vacancies' ? (
        <main style={{ flex: 1 }}>
          {/* Hero Banner */}
          <HeroBanner
            searchKeyword={searchKeyword}
            setSearchKeyword={setSearchKeyword}
            locationFilter={locationFilter}
            setLocationFilter={setLocationFilter}
            jobTypeFilter={jobTypeFilter}
            setJobTypeFilter={setJobTypeFilter}
            onSearchSubmit={fetchJobs}
            totalVacancies={totalOpenVacancies}
            totalJobs={jobs.length}
          />

          <div className="container">
            {/* Filter Pills & Sort Bar */}
            <div className="filters-bar">
              <div className="category-pills">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <SlidersHorizontal size={16} color="var(--text-muted)" />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Sort by:</span>
                <select
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--surface-border)',
                    background: '#fff',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                  }}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="vacancies">Highest Vacancies Count</option>
                </select>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="alert-toast alert-error" style={{ margin: '20px 0' }}>
                <AlertCircle size={20} />
                <span>{error}</span>
                <button
                  onClick={fetchJobs}
                  style={{
                    marginLeft: 'auto',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                  }}
                >
                  Retry
                </button>
              </div>
            )}

            {/* Loading Indicator */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                <RefreshCw size={36} className="animate-spin" style={{ margin: '0 auto 12px auto' }} />
                <p style={{ fontWeight: 600 }}>Fetching open vacancies...</p>
              </div>
            ) : displayedJobs.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  background: 'var(--surface)',
                  border: '1px dashed var(--surface-border)',
                  borderRadius: '16px',
                  padding: '60px 20px',
                  margin: '20px 0 60px 0',
                }}
              >
                <Briefcase size={44} style={{ margin: '0 auto 12px auto', color: '#94a3b8' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '6px' }}>
                  No Vacancies Match Your Filter
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '18px' }}>
                  Try resetting your keyword or selecting "All" categories.
                </p>
                <button
                  className="search-btn"
                  style={{ margin: '0 auto' }}
                  onClick={() => {
                    setSearchKeyword('');
                    setLocationFilter('');
                    setJobTypeFilter('All');
                    setSelectedCategory('All');
                    fetchJobs();
                  }}
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="jobs-grid">
                {displayedJobs.map((job) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    onSelectDetails={(j) => setDetailsModalJob(j)}
                    onApplyNow={(j) => setApplyModalJob(j)}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      ) : (
        <main style={{ flex: 1 }}>
          <RecruiterDashboard
            jobs={jobs}
            onJobUpdated={handleJobUpdated}
            onJobDeleted={handleJobDeleted}
            onRefreshJobs={fetchJobs}
          />
        </main>
      )}

      {/* Footer */}
      <footer
        style={{
          background: '#0f172a',
          color: '#94a3b8',
          padding: '30px 0',
          borderTop: '1px solid #1e293b',
          fontSize: '0.875rem',
          marginTop: 'auto',
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <strong style={{ color: '#ffffff' }}>OpportunityHub</strong> — Full-Stack MERN Job Portal
          </div>
          <div>
            Built with MongoDB, Express, React & Node.js • Supports Vacancy Listings, Real-time Filters & Direct Applications
          </div>
        </div>
      </footer>

      {/* Modals */}
      <JobDetailsModal
        job={detailsModalJob}
        onClose={() => setDetailsModalJob(null)}
        onApplyNow={(j) => setApplyModalJob(j)}
      />

      <ApplyModal
        job={applyModalJob}
        onClose={() => setApplyModalJob(null)}
        onApplicationSuccess={handleApplicationSuccess}
      />

      <PostJobModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onJobCreated={handleJobCreated}
      />
    </div>
  );
}
