import React from 'react';
import { SurplusOffer, RecipientNeed, Match, AnalyticsSummary } from '../types';
import { ReportsIcon, UploadIcon } from '../components/Icons';
import { Language, translations } from '../i18n';

interface ReportsViewProps {
  summary: AnalyticsSummary | null;
  surpluses: SurplusOffer[];
  needs: RecipientNeed[];
  matches: Match[];
  onOpenImport: () => void;
  language: Language;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  summary,
  surpluses,
  needs,
  matches,
  onOpenImport,
  language,
}) => {
  const t = translations[language];

  const handleExportJSON = () => {
    const reportData = {
      title: "Urban Food Waste Intelligence Capstone Audit Report",
      generated_at: new Date().toISOString(),
      summary: summary || {},
      surplus_offers_count: surpluses.length,
      recipient_needs_count: needs.length,
      generated_matches_count: matches.length,
      surplus_inventory: surpluses,
      recipient_needs: needs,
      matches: matches,
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `food_waste_intelligence_report_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Donor", "Category", "Quantity", "Unit", "Location", "Status"];
    const rows = surpluses.map(s => [
      s.id,
      `"${s.donor}"`,
      `"${s.food_category}"`,
      s.quantity,
      `"${s.unit}"`,
      `"${s.pickup_location}"`,
      `"${s.status || 'pending'}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `surplus_inventory_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="view-content-wrapper">
      {/* Header */}
      <div className="view-header-row">
        <div>
          <h2 className="view-title">{t.navReports}</h2>
          <p className="view-subtitle">
            Executive intelligence reports, automated database audits, and CSV/Excel batch pipeline
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={onOpenImport} className="btn btn-primary">
            <UploadIcon className="w-4 h-4" />
            <span>{t.importDataset}</span>
          </button>
        </div>
      </div>

      {/* Grid of Report Actions */}
      <div className="reports-cards-grid">
        {/* Card 1: Executive Audit Export */}
        <div className="report-action-card">
          <div className="report-card-icon-wrap bg-emerald-100 text-emerald-800">
            <ReportsIcon className="w-6 h-6" />
          </div>
          <h3 className="report-card-title">Executive Intelligence Audit</h3>
          <p className="report-card-desc">
            Export a comprehensive JSON snapshot containing all surplus inventories, active recipient requests, and matching allocation logs.
          </p>
          <div className="report-card-actions">
            <button onClick={handleExportJSON} className="btn btn-outline">
              Download Full JSON Audit
            </button>
          </div>
        </div>

        {/* Card 2: Inventory CSV Export */}
        <div className="report-action-card">
          <div className="report-card-icon-wrap bg-blue-100 text-blue-800">
            <ReportsIcon className="w-6 h-6" />
          </div>
          <h3 className="report-card-title">Surplus Inventory CSV</h3>
          <p className="report-card-desc">
            Download the active surplus food catalog formatted as a standard CSV spreadsheet for offline warehouse and fleet dispatch.
          </p>
          <div className="report-card-actions">
            <button onClick={handleExportCSV} className="btn btn-outline">
              Export Inventory CSV
            </button>
          </div>
        </div>

        {/* Card 3: Batch Data Import */}
        <div className="report-action-card">
          <div className="report-card-icon-wrap bg-purple-100 text-purple-800">
            <UploadIcon className="w-6 h-6" />
          </div>
          <h3 className="report-card-title">Batch Dataset Pipeline</h3>
          <p className="report-card-desc">
            Ingest bulk records from supermarkets, hotels, or NGOs via FastAPI's validated CSV/Excel upload endpoints.
          </p>
          <div className="report-card-actions">
            <button onClick={onOpenImport} className="btn btn-primary">
              Launch Import Wizard
            </button>
          </div>
        </div>
      </div>

      {/* Live System Diagnostics */}
      <div className="data-table-card mt-6 p-6">
        <h3 className="card-section-title mb-4">Live Platform Metrics & Provenance</h3>
        <div className="diagnostics-grid">
          <div className="diagnostic-stat-item">
            <span className="text-sm text-gray-500">FastAPI Endpoints</span>
            <span className="font-bold text-gray-900 text-lg">15 Active Endpoints</span>
          </div>
          <div className="diagnostic-stat-item">
            <span className="text-sm text-gray-500">Database Engine</span>
            <span className="font-bold text-gray-900 text-lg">SQLite (SQLModel / SQLAlchemy)</span>
          </div>
          <div className="diagnostic-stat-item">
            <span className="text-sm text-gray-500">Matching Algorithm</span>
            <span className="font-bold text-gray-900 text-lg">Deterministic Multi-Factor Scorer</span>
          </div>
          <div className="diagnostic-stat-item">
            <span className="text-sm text-gray-500">Regional Languages</span>
            <span className="font-bold text-gray-900 text-lg">English, हिन्दी, தமிழ், മലയാളം, ಕನ್ನಡ, తెలుగు</span>
          </div>
        </div>
      </div>
    </div>
  );
};
