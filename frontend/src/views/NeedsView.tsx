import React, { useState } from 'react';
import { RecipientNeed } from '../types';
import { PlusIcon, NeedsIcon, CrossIcon } from '../components/Icons';
import { Language, translations } from '../i18n';
import { deleteNeed } from '../api';

interface NeedsViewProps {
  needs: RecipientNeed[];
  loading: boolean;
  onRefresh: () => void;
  onOpenAdd: () => void;
  language: Language;
}

export const NeedsView: React.FC<NeedsViewProps> = ({
  needs,
  loading,
  onRefresh,
  onOpenAdd,
  language,
}) => {
  const t = translations[language];
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const filteredNeeds = needs.filter((item) => {
    const matchesSearch =
      item.recipient_org.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.food_category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.delivery_location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPriority =
      priorityFilter === 'All' || item.priority?.toLowerCase() === priorityFilter.toLowerCase();

    return matchesSearch && matchesPriority;
  });

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this recipient need request?')) return;
    setDeletingId(id);
    try {
      await deleteNeed(id);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to delete recipient need');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="view-content-wrapper">
      {/* Top Header */}
      <div className="view-header-row">
        <div>
          <h2 className="view-title">{t.navNeeds}</h2>
          <p className="view-subtitle">Registered non-profit NGOs, food banks, and shelters requesting surplus food</p>
        </div>
        <button onClick={onOpenAdd} className="btn btn-primary">
          <PlusIcon className="w-4 h-4" />
          <span>{t.contactNgo}</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="filter-controls-row">
        <div className="filter-search-box">
          <input
            type="text"
            placeholder="Search recipient organization, category, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-dropdown-box">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="filter-select"
          >
            <option value="All">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="normal">Normal</option>
          </select>
        </div>
      </div>

      {/* Table Data */}
      <div className="data-table-card">
        {loading ? (
          <div className="loading-state">{t.loading}</div>
        ) : filteredNeeds.length === 0 ? (
          <div className="empty-state-large">
            <NeedsIcon className="w-12 h-12 text-gray-300 mb-3" />
            <h4 className="font-semibold text-gray-700">{t.noData}</h4>
            <p className="text-sm text-gray-500 mt-1">No recipient need requests registered.</p>
            <button onClick={onOpenAdd} className="btn btn-primary mt-4">
              <PlusIcon className="w-4 h-4" />
              <span>{t.contactNgo}</span>
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="enterprise-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>{t.recipientOrg}</th>
                  <th>{t.category}</th>
                  <th>{t.quantity}</th>
                  <th>{t.location}</th>
                  <th>{t.priority}</th>
                  <th>Fulfillment</th>
                  <th>{t.actions}</th>
                </tr>
              </thead>
              <tbody>
                {filteredNeeds.map((item) => (
                  <tr key={item.id}>
                    <td className="text-gray-400 font-mono text-xs">#{item.id}</td>
                    <td className="font-semibold text-gray-900">{item.recipient_org}</td>
                    <td>
                      <span className="category-pill">{item.food_category}</span>
                    </td>
                    <td className="font-bold text-cyan-800">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="text-gray-600 text-sm">📍 {item.delivery_location}</td>
                    <td>
                      <span
                        className={`item-badge ${
                          item.priority?.toLowerCase() === 'urgent'
                            ? 'badge-urgent'
                            : item.priority?.toLowerCase() === 'high'
                            ? 'badge-high'
                            : 'badge-pending'
                        }`}
                      >
                        {item.priority || 'normal'}
                      </span>
                    </td>
                    <td>
                      <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        {item.fulfillment_status || 'open'}
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
