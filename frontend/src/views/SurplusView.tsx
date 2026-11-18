import React, { useState } from 'react';
import { SurplusOffer } from '../types';
import { PlusIcon, SurplusIcon, CrossIcon } from '../components/Icons';
import { Language, translations } from '../i18n';
import { deleteSurplus } from '../api';

interface SurplusViewProps {
  surpluses: SurplusOffer[];
  loading: boolean;
  onRefresh: () => void;
  onOpenAdd: () => void;
  language: Language;
}

export const SurplusView: React.FC<SurplusViewProps> = ({
  surpluses,
  loading,
  onRefresh,
  onOpenAdd,
  language,
}) => {
  const t = translations[language];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const categories = ['All', 'Vegetables', 'Fruits', 'Grains', 'Dairy', 'Cooked Meals', 'Bakery'];

  const filteredSurpluses = surpluses.filter((item) => {
    const matchesSearch =
      item.donor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.food_category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pickup_location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || item.food_category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this surplus offer?')) return;
    setDeletingId(id);
    try {
      await deleteSurplus(id);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to delete surplus offer');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="view-content-wrapper">
      {/* Top Header */}
      <div className="view-header-row">
        <div>
          <h2 className="view-title">{t.navSurplus}</h2>
          <p className="view-subtitle">{t.surplusInventorySubtitle}</p>
        </div>
        <button onClick={onOpenAdd} className="btn btn-primary">
          <PlusIcon className="w-4 h-4" />
          <span>{t.addSurplus}</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="filter-controls-row">
        <div className="filter-search-box">
          <input
            type="text"
            placeholder="Filter by donor name, food type, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-dropdown-box">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'All' ? 'All Categories' : c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Data */}
      <div className="data-table-card">
        {loading ? (
          <div className="loading-state">{t.loading}</div>
        ) : filteredSurpluses.length === 0 ? (
          <div className="empty-state-large">
            <SurplusIcon className="w-12 h-12 text-gray-300 mb-3" />
            <h4 className="font-semibold text-gray-700">{t.noData}</h4>
            <p className="text-sm text-gray-500 mt-1">No surplus offers match the current criteria.</p>
            <button onClick={onOpenAdd} className="btn btn-primary mt-4">
              <PlusIcon className="w-4 h-4" />
              <span>{t.addSurplus}</span>
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="enterprise-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>{t.donorName}</th>
                  <th>{t.category}</th>
                  <th>{t.quantity}</th>
                  <th>{t.location}</th>
                  <th>{t.deadline}</th>
                  <th>{t.status}</th>
                  <th>Verification</th>
                  <th>{t.actions}</th>
                </tr>
              </thead>
              <tbody>
                {filteredSurpluses.map((item) => (
                  <tr key={item.id}>
                    <td className="text-gray-400 font-mono text-xs">#{item.id}</td>
                    <td className="font-semibold text-gray-900">{item.donor}</td>
                    <td>
                      <span className="category-pill">{item.food_category}</span>
                    </td>
                    <td className="font-bold text-emerald-800">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="text-gray-600 text-sm">📍 {item.pickup_location}</td>
                    <td className="text-gray-500 text-xs">
                      {item.collection_deadline
                        ? new Date(item.collection_deadline).toLocaleDateString()
                        : 'Immediate'}
                    </td>
                    <td>
                      <span
                        className={`item-badge ${
                          item.status === 'pending'
                            ? 'badge-pending'
                            : item.status === 'claimed'
                            ? 'badge-ready'
                            : 'badge-pending'
                        }`}
                      >
                        {item.status || 'pending'}
                      </span>
                    </td>
                    <td>
                      <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {item.verification_status || 'verified'}
                      </span>
                    </td>
                    <td>
                      {item.id && (
                        <button
                          onClick={() => handleDelete(item.id!)}
                          disabled={deletingId === item.id}
                          className="btn-danger-outline"
                          title={t.deleteBtn}
                        >
                          <CrossIcon className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
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
