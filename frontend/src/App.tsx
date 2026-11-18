import React, { useState, useEffect, useCallback } from 'react';
import {
  fetchSurpluses,
  fetchNeeds,
  fetchAnalyticsSummary,
  fetchAnalyticsCategory,
  fetchAnalyticsTrend,
  generateMatches,
  fetchMatches,
  decideMatch,
  fetchCurrentUser,
} from './api';
import {
  SurplusOffer,
  RecipientNeed,
  AnalyticsSummary,
  CategoryBreakdown,
  TrendData,
  Match,
  User,
} from './types';
import { Language, translations } from './i18n';
import { Sidebar, Tab } from './components/Sidebar';
import { Header } from './components/Header';
import { SurplusModal } from './components/SurplusModal';
import { NeedModal } from './components/NeedModal';
import { ImportModal } from './components/ImportModal';
import { AuthModal } from './components/AuthModal';

import { DashboardView } from './views/DashboardView';
import { SurplusView } from './views/SurplusView';
import { NeedsView } from './views/NeedsView';
import { MatchingView } from './views/MatchingView';
import { AnalyticsView } from './views/AnalyticsView';
import { ReportsView } from './views/ReportsView';
import { NearbyMapView } from './views/NearbyMapView';
import { DatabaseManagementView } from './views/DatabaseManagementView';

import './App.css';

export default function App() {
  // Navigation & Language
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Dashboard);
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('urban_food_lang');
    return (saved as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('urban_food_lang', lang);
  };

  // User Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('urban_food_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Modals state
  const [isSurplusModalOpen, setIsSurplusModalOpen] = useState(false);
  const [isNeedModalOpen, setIsNeedModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Search & Global state
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Data state
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [surpluses, setSurpluses] = useState<SurplusOffer[]>([]);
  const [needs, setNeeds] = useState<RecipientNeed[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryBreakdown[]>([]);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // Verify current user session on startup
  useEffect(() => {
    const token = localStorage.getItem('urban_food_token');
    if (token) {
      fetchCurrentUser()
        .then((res) => {
          setCurrentUser(res.data);
          localStorage.setItem('urban_food_user', JSON.stringify(res.data));
        })
        .catch(() => {
          // Token invalid or expired
          localStorage.removeItem('urban_food_token');
          localStorage.removeItem('urban_food_user');
          setCurrentUser(null);
        });
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('urban_food_token');
    localStorage.removeItem('urban_food_user');
    setCurrentUser(null);
    showNotification('Signed out successfully.');
    if (activeTab === Tab.DatabaseAdmin) {
      setActiveTab(Tab.Dashboard);
    }
  };

  // Load all live backend data
  const loadAllData = useCallback(async () => {
    setRefreshing(true);
    try {
      const [surplusRes, needsRes, matchesRes, summaryRes, categoryRes, trendRes] =
        await Promise.allSettled([
          fetchSurpluses(),
          fetchNeeds(),
          fetchMatches(),
          fetchAnalyticsSummary(),
          fetchAnalyticsCategory(),
          fetchAnalyticsTrend('surplus', 30),
        ]);

      if (surplusRes.status === 'fulfilled') setSurpluses(surplusRes.value.data);
      if (needsRes.status === 'fulfilled') setNeeds(needsRes.value.data);
      if (matchesRes.status === 'fulfilled') setMatches(matchesRes.value.data);
      if (summaryRes.status === 'fulfilled') setSummary(summaryRes.value.data);
      if (categoryRes.status === 'fulfilled') setCategoryData(categoryRes.value.data);
      if (trendRes.status === 'fulfilled') setTrendData(trendRes.value.data);
    } catch (err: any) {
      console.error('Error fetching data from FastAPI backend', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Run matching engine
  const handleRunMatch = async () => {
    const t = translations[language];
    showNotification(t.generatingMatches);
    try {
      const res = await generateMatches();
      showNotification(`${t.generateSuccess} (${res.data.length} matches)`);
      const [matchesRes, summaryRes] = await Promise.all([fetchMatches(), fetchAnalyticsSummary()]);
      setMatches(matchesRes.data);
      setSummary(summaryRes.data);
    } catch (err: any) {
      alert(err?.response?.data?.detail || err.message || 'Failed to generate matches');
    }
  };

  // Decide match (approve / reject)
  const handleDecideMatch = async (id: number, decision: 'approved' | 'rejected') => {
    try {
      await decideMatch(id, decision);
      showNotification(`Match #${id} successfully marked as ${decision}!`);
      const [matchesRes, summaryRes, surplusRes, needsRes] = await Promise.all([
        fetchMatches(),
        fetchAnalyticsSummary(),
        fetchSurpluses(),
        fetchNeeds(),
      ]);
      setMatches(matchesRes.data);
      setSummary(summaryRes.data);
      setSurpluses(surplusRes.data);
      setNeeds(needsRes.data);
    } catch (err: any) {
      alert(err?.response?.data?.detail || err.message || 'Failed to update match decision');
    }
  };

  return (
    <div className="app-shell">
      {/* Toast Notification */}
      {notification && (
        <div className="toast-notification">
          <span>{notification}</span>
        </div>
      )}

      {/* Dark Green Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
        surplusCount={surpluses.length}
        needsCount={needs.length}
        matchesCount={matches.length}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onSignOut={handleSignOut}
      />

      {/* Main Workspace */}
      <div className="main-content-layout">
        <Header
          language={language}
          setLanguage={setLanguage}
          onAddSurplus={() => setIsSurplusModalOpen(true)}
          onRefresh={loadAllData}
          refreshing={refreshing}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          currentUser={currentUser}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onNavigateToNearby={() => setActiveTab(Tab.NearbyMap)}
        />

        <main className="main-page-container">
          {activeTab === Tab.Dashboard && (
            <DashboardView
              language={language}
              summary={summary}
              surpluses={surpluses}
              needs={needs}
              matches={matches}
              categoryData={categoryData}
              trendData={trendData}
              loading={loading}
              onNavigate={setActiveTab}
              onOpenAddSurplus={() => setIsSurplusModalOpen(true)}
              onOpenAddNeed={() => setIsNeedModalOpen(true)}
              onRunMatch={handleRunMatch}
              onDecideMatch={handleDecideMatch}
              onOpenImport={() => setIsImportModalOpen(true)}
            />
          )}

          {activeTab === Tab.NearbyMap && (
            <NearbyMapView
              currentUser={currentUser}
              language={language}
            />
          )}

          {activeTab === Tab.DatabaseAdmin && (
            <DatabaseManagementView
              currentUser={currentUser}
              surpluses={surpluses}
              needs={needs}
              matches={matches}
              onRefreshAll={loadAllData}
              language={language}
            />
          )}

          {activeTab === Tab.Surplus && (
            <SurplusView
              surpluses={surpluses}
              loading={loading}
              onRefresh={loadAllData}
              onOpenAdd={() => setIsSurplusModalOpen(true)}
              language={language}
            />
          )}

          {activeTab === Tab.Needs && (
            <NeedsView
              needs={needs}
              loading={loading}
              onRefresh={loadAllData}
              onOpenAdd={() => setIsNeedModalOpen(true)}
              language={language}
            />
          )}

          {activeTab === Tab.Matching && (
            <MatchingView
              matches={matches}
              surpluses={surpluses}
              needs={needs}
              loading={loading}
              onRefresh={loadAllData}
              onRunMatch={handleRunMatch}
              onDecideMatch={handleDecideMatch}
              language={language}
            />
          )}

          {activeTab === Tab.Analytics && (
            <AnalyticsView
              summary={summary}
              categoryData={categoryData}
              trendData={trendData}
              loading={loading}
              onRefresh={loadAllData}
              language={language}
            />
          )}

          {activeTab === Tab.Reports && (
            <ReportsView
              summary={summary}
              surpluses={surpluses}
              needs={needs}
              matches={matches}
              onOpenImport={() => setIsImportModalOpen(true)}
              language={language}
            />
          )}
        </main>
      </div>

      {/* Auth Modal (Login / Register / Forgot Password) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          showNotification(`Welcome back, ${user.full_name}!`);
        }}
        language={language}
      />

      {/* Real-data Creation Modals */}
      <SurplusModal
        isOpen={isSurplusModalOpen}
        onClose={() => setIsSurplusModalOpen(false)}
        onSuccess={() => {
          showNotification('Surplus offer created successfully!');
          loadAllData();
        }}
        language={language}
      />

      <NeedModal
        isOpen={isNeedModalOpen}
        onClose={() => setIsNeedModalOpen(false)}
        onSuccess={() => {
          showNotification('Recipient need created successfully!');
          loadAllData();
        }}
        language={language}
      />

      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={() => {
          showNotification('Dataset imported successfully!');
          loadAllData();
        }}
        language={language}
      />
    </div>
  );
}
