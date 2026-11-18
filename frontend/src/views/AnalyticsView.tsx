import React, { useState, useEffect } from 'react';
import {
  AnalyticsSummary,
  CategoryBreakdown,
  TrendData,
  WasteObservation,
} from '../types';
import { fetchWaste } from '../api';
import { AnalyticsIcon, LeafIcon, TrendingUpIcon } from '../components/Icons';
import { Language, translations } from '../i18n';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

interface AnalyticsViewProps {
  summary: AnalyticsSummary | null;
  categoryData: CategoryBreakdown[];
  trendData: TrendData[];
  loading: boolean;
  onRefresh: () => void;
  language: Language;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  summary,
  categoryData,
  trendData,
  loading,
  onRefresh,
  language,
}) => {
  const t = translations[language];

  const [wasteRecords, setWasteRecords] = useState<WasteObservation[]>([]);
  const [wasteLoading, setWasteLoading] = useState(false);

  useEffect(() => {
    setWasteLoading(true);
    fetchWaste()
      .then((res) => setWasteRecords(res.data))
      .catch((err) => console.error('Failed to load waste records', err))
      .finally(() => setWasteLoading(false));
  }, []);

  const totalSurplus = summary?.total_surplus || 0;
  const totalNeed = summary?.total_need || 0;
  const totalWaste = summary?.total_waste || 0;

  // Impact calculations
  const co2AvoidedKg = Math.round(totalSurplus * 2.5); // 2.5kg CO2e per kg food saved
  const waterSavedLiters = Math.round(totalSurplus * 290); // ~290L water per kg food
  const financialValue = Math.round(totalSurplus * 35); // ₹35 / kg average market value

  // Sample data fallback if category breakdown has 0 items
  const chartCategoryData =
    categoryData && categoryData.length > 0
      ? categoryData
      : [
          { category: 'Vegetables', surplus: 100, need: 80 },
          { category: 'Fruits', surplus: 50, need: 30 },
          { category: 'Grains', surplus: 80, need: 60 },
          { category: 'Dairy', surplus: 30, need: 25 },
          { category: 'Cooked Meals', surplus: 45, need: 50 },
        ];

  const chartTrend =
    trendData && trendData.length > 0
      ? trendData
      : [
          { date: 'Day 1', total: 40 },
          { date: 'Day 5', total: 65 },
          { date: 'Day 10', total: 55 },
          { date: 'Day 15', total: 90 },
          { date: 'Day 20', total: 85 },
          { date: 'Day 25', total: 110 },
          { date: 'Day 30', total: 140 },
        ];

  return (
    <div className="view-content-wrapper">
      {/* Header */}
      <div className="view-header-row">
        <div>
          <h2 className="view-title">{t.navAnalytics}</h2>
          <p className="view-subtitle">
            Quantitative environmental intelligence, surplus-to-demand balance, and waste diversion metrics
          </p>
        </div>
      </div>

      {/* Environmental Impact Counter Row */}
      <div className="impact-stats-row">
        <div className="impact-box bg-emerald-50 border-emerald-200">
          <div className="impact-icon-circle bg-emerald-100 text-emerald-700">🌱</div>
          <div>
            <span className="impact-metric-value">{co2AvoidedKg.toLocaleString()} kg</span>
            <span className="impact-metric-label">CO₂e Emissions Averted</span>
          </div>
        </div>

        <div className="impact-box bg-blue-50 border-blue-200">
          <div className="impact-icon-circle bg-blue-100 text-blue-700">💧</div>
          <div>
            <span className="impact-metric-value">{waterSavedLiters.toLocaleString()} L</span>
            <span className="impact-metric-label">Freshwater Footprint Saved</span>
          </div>
        </div>

        <div className="impact-box bg-amber-50 border-amber-200">
          <div className="impact-icon-circle bg-amber-100 text-amber-700">₹</div>
          <div>
            <span className="impact-metric-value">₹ {financialValue.toLocaleString()}</span>
            <span className="impact-metric-label">Economic Value Diverted</span>
          </div>
        </div>

        <div className="impact-box bg-purple-50 border-purple-200">
          <div className="impact-icon-circle bg-purple-100 text-purple-700">🍱</div>
          <div>
            <span className="impact-metric-value">{Math.round(totalSurplus * 2.2).toLocaleString()}</span>
            <span className="impact-metric-label">{t.kpiMealsProvided}</span>
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="analytics-dual-charts-grid">
        {/* Category Supply vs Demand Bar Chart */}
        <div className="dashboard-card">
          <div className="card-header-row">
            <div>
              <h3 className="card-section-title">{t.categoryBreakdownTitle}</h3>
              <p className="card-section-subtitle">{t.categoryBreakdownSubtitle}</p>
            </div>
          </div>
          <div className="chart-container-box">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartCategoryData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="category" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} unit="kg" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Legend />
                <Bar dataKey="surplus" name="Surplus Available (kg)" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="need" name="Recipient Need (kg)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 30-Day Trend Area Chart */}
        <div className="dashboard-card">
          <div className="card-header-row">
            <div>
              <h3 className="card-section-title">{t.surplusTrendTitle}</h3>
              <p className="card-section-subtitle">Surplus accumulation timeline</p>
            </div>
            <span className="trend-stat-badge">30-day window</span>
          </div>
          <div className="chart-container-box">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartTrend} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="analyticsTrendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} unit="kg" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  name="Volume (kg)"
                  stroke="#059669"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#analyticsTrendGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Waste Observations Table */}
      <div className="data-table-card mt-6">
        <div className="card-header-row p-4 border-b border-gray-100">
          <div>
            <h3 className="card-section-title">Waste Observations Data Log</h3>
            <p className="card-section-subtitle">Urban waste generation checkpoints and audit reports</p>
          </div>
        </div>
        {wasteRecords.length === 0 ? (
          <div className="empty-state-small p-6">
            <p className="text-gray-500">No raw waste observation records logged yet.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="enterprise-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Source</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Location</th>
                  <th>Classification</th>
                </tr>
              </thead>
              <tbody>
                {wasteRecords.map((w) => (
                  <tr key={w.id}>
                    <td className="text-gray-400 font-mono text-xs">#{w.id}</td>
                    <td className="font-semibold text-gray-900">{w.reporting_source}</td>
                    <td>{w.food_category}</td>
                    <td className="font-bold text-amber-700">{w.quantity} {w.unit}</td>
                    <td>{w.source_location}</td>
                    <td>{w.waste_classification || 'Avoidable'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
