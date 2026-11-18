import React from 'react';
import {
  DashboardIcon,
  SurplusIcon,
  NeedsIcon,
  MatchingIcon,
  AnalyticsIcon,
  ReportsIcon,
  GlobeIcon,
  LeafIcon,
  MapPinIcon,
  DatabaseIcon,
  ShieldLockIcon,
} from './Icons';
import { Language, translations } from '../i18n';
import { User } from '../types';

export enum Tab {
  Dashboard = 'Dashboard',
  NearbyMap = 'Nearby Food & Map',
  Surplus = 'Surplus Offers',
  Needs = 'Recipient Needs',
  Matching = 'Smart Matching',
  Analytics = 'Waste Analytics',
  Reports = 'Reports & Import',
  DatabaseAdmin = 'Database Admin',
}

interface SidebarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  surplusCount: number;
  needsCount: number;
  matchesCount: number;
  currentUser: User | null;
  onOpenAuth: () => void;
  onSignOut: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  surplusCount,
  needsCount,
  matchesCount,
  currentUser,
  onOpenAuth,
  onSignOut,
}) => {
  const t = translations[language];
  const isAdmin = currentUser?.role === 'Administrator';

  const navItems = [
    { id: Tab.Dashboard, label: t.navDashboard, icon: <DashboardIcon /> },
    { id: Tab.NearbyMap, label: t.navNearbyMap, icon: <MapPinIcon /> },
    { id: Tab.Surplus, label: t.navSurplus, icon: <SurplusIcon />, badge: surplusCount },
    { id: Tab.Needs, label: t.navNeeds, icon: <NeedsIcon />, badge: needsCount },
    { id: Tab.Matching, label: t.navMatching, icon: <MatchingIcon />, badge: matchesCount },
    { id: Tab.Analytics, label: t.navAnalytics, icon: <AnalyticsIcon /> },
    { id: Tab.Reports, label: t.navReports, icon: <ReportsIcon /> },
    { id: Tab.DatabaseAdmin, label: t.navDatabaseAdmin, icon: <DatabaseIcon />, adminOnly: true },
  ];

  return (
    <aside className="sidebar">
      {/* Brand logo */}
      <div className="sidebar-brand">
        <div className="brand-logo-container">
          <div className="brand-icon-box">
            <LeafIcon className="brand-leaf-icon" />
          </div>
          <div>
            <h1 className="brand-title">PlateForward</h1>
            <p className="brand-subtitle">Urban Food Waste Intelligence</p>
          </div>
        </div>
      </div>

      {/* Language Selector */}
      <div className="language-selector-box">
        <div className="language-selector-label">
          <GlobeIcon className="globe-icon" />
          <span>Language / மொழி / भाषा</span>
        </div>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          className="language-dropdown"
        >
          <option value="en">English (EN)</option>
          <option value="hi">हिन्दी (Hindi)</option>
          <option value="ta">தமிழ் (Tamil)</option>
          <option value="ml">മലയാളം (Malayalam)</option>
          <option value="kn">ಕನ್ನಡ (Kannada)</option>
          <option value="te">తెలుగు (Telugu)</option>
        </select>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`nav-button ${isActive ? 'nav-button-active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {item.adminOnly && (
                <span className="nav-badge bg-amber-500 text-slate-900 text-[10px] font-bold">
                  ADMIN
                </span>
              )}
              {typeof item.badge === 'number' && item.badge > 0 && (
                <span className={`nav-badge ${isActive ? 'nav-badge-active' : ''}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User profile section */}
      <div className="sidebar-footer">
        {currentUser ? (
          <div className="user-profile-card">
            <div className="user-avatar">
              <span>{currentUser.full_name.slice(0, 2).toUpperCase()}</span>
              <span className="online-indicator" />
            </div>
            <div className="user-info flex-1 min-w-0">
              <span className="user-name truncate">{currentUser.full_name}</span>
              <span className="user-role flex items-center gap-1">
                {currentUser.role === 'Administrator' && '👑 '}
                {currentUser.role}
              </span>
            </div>
            <button
              onClick={onSignOut}
              className="text-xs text-red-400 hover:text-red-300 font-medium"
              title="Sign Out"
            >
              Sign out
            </button>
          </div>
        ) : (
          <div className="p-2">
            <button
              onClick={onOpenAuth}
              className="btn btn-primary w-full text-xs font-bold py-2"
            >
              Sign In / Register
            </button>
          </div>
        )}

        <div className="system-status-indicator">
          <span className="status-dot-pulse" />
          <span>FastAPI • Connected</span>
        </div>
      </div>
    </aside>
  );
};
