import React from 'react';
import { Search, MapPin, Briefcase, Users, CheckCircle, Sparkles } from 'lucide-react';

export default function HeroBanner({
  searchKeyword,
  setSearchKeyword,
  locationFilter,
  setLocationFilter,
  jobTypeFilter,
  setJobTypeFilter,
  onSearchSubmit,
  totalVacancies,
  totalJobs,
}) {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-pill">
          <Sparkles size={14} />
          <span>Real-time Career & Vacancy Portal</span>
        </div>

        <h2 className="hero-title">
          Explore Open Vacancies & <span>Apply Directly</span> in Seconds
        </h2>

        <p className="hero-subtitle">
          Discover vetted engineering, design, marketing, and leadership vacancies.
          Recruiters can list open positions and track applicants seamlessly.
        </p>

        {/* Live Search & Filter Bar */}
        <form
          className="search-bar-card"
          onSubmit={(e) => {
            e.preventDefault();
            onSearchSubmit();
          }}
        >
          <div className="search-input-group">
            <Search size={18} color="#94a3b8" />
            <input
              type="text"
              placeholder="Job title, tech stack, or keyword..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>

          <div className="search-input-group">
            <MapPin size={18} color="#94a3b8" />
            <input
              type="text"
              placeholder="City, State, or 'Remote'..."
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
          </div>

          <div className="search-input-group" style={{ flex: '0 1 180px' }}>
            <Briefcase size={18} color="#94a3b8" />
            <select
              value={jobTypeFilter}
              onChange={(e) => setJobTypeFilter(e.target.value)}
            >
              <option value="All">All Job Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Remote">Remote</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <button type="submit" className="search-btn">
            <Search size={16} />
            Find Jobs
          </button>
        </form>

        {/* Stats Row */}
        <div className="metrics-row">
          <div className="metric-item">
            <CheckCircle size={18} color="#10b981" />
            <span>
              <strong className="metric-number">{totalJobs}</strong> Active Listings
            </span>
          </div>

          <div className="metric-item">
            <Users size={18} color="#3b82f6" />
            <span>
              <strong className="metric-number">{totalVacancies}</strong> Open Vacancy Seats
            </span>
          </div>

          <div className="metric-item">
            <Sparkles size={18} color="#f59e0b" />
            <span>Fast-track Recruiter Review</span>
          </div>
        </div>
      </div>
    </section>
  );
}
