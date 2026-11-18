import React from 'react';
import { PlusIcon, RefreshIcon, GlobeIcon, UserIcon, MapPinIcon } from './Icons';
import { Language, translations } from '../i18n';
import { User } from '../types';

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  onAddSurplus: () => void;
  onRefresh: () => void;
  refreshing: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onNavigateToNearby?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  setLanguage,
  onAddSurplus,
  onRefresh,
  refreshing,
  searchQuery,
  setSearchQuery,
  currentUser,
  onOpenAuth,
  onNavigateToNearby,
}) => {
  const t = translations[language];

  return (
    <header className="app-header">
      {/* Search Input */}
      <div className="header-search-wrapper">
        <svg className="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search surplus items, recipients, categories, locations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="header-search-input"
        />
      </div>

      {/* Header Actions */}
      <div className="header-actions">
        {/* Nearby Quick Button */}
        {onNavigateToNearby && (
          <button
            onClick={onNavigateToNearby}
            className="header-action-button btn-secondary flex items-center gap-1.5"
            title="Nearby Food & Map"
          >
            <MapPinIcon className="w-4 h-4 text-emerald-600" />
            <span className="hidden-mobile font-semibold">Nearby Map</span>
          </button>
        )}

        {/* Quick Language Switcher */}
        <div className="header-lang-wrapper">
          <GlobeIcon className="header-lang-icon" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="header-lang-select"
          >
            <option value="en">English (EN)</option>
            <option value="hi">हिन्दी (HI)</option>
            <option value="ta">தமிழ் (TA)</option>
            <option value="ml">മലയാളം (ML)</option>
            <option value="kn">ಕನ್ನಡ (KN)</option>
            <option value="te">తెలుగు (TE)</option>
          </select>
        </div>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="header-action-button btn-secondary"
          title={t.refreshData}
        >
          <RefreshIcon className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span className="hidden-mobile">{t.refreshData}</span>
        </button>

        {/* Add Surplus Button */}
        <button
          onClick={onAddSurplus}
          className="header-action-button btn-primary"
        >
          <PlusIcon className="w-4 h-4" />
          <span>{t.addSurplus}</span>
        </button>

        {/* User Account Button */}
        {currentUser ? (
          <div className="header-user-badge">
            <span className="user-initials-circle">
              {currentUser.full_name.slice(0, 2).toUpperCase()}
            </span>
            <span className="hidden-mobile font-semibold text-xs text-slate-800">
              {currentUser.full_name.split(' ')[0]}
            </span>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="header-action-button btn-secondary"
          >
            <UserIcon className="w-4 h-4 text-emerald-700" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
