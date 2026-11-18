import React, { useState, useEffect, useMemo } from 'react';
import {
  AdminOverview,
  User,
  SurplusOffer,
  RecipientNeed,
  WasteObservation,
  Match,
} from '../types';
import {
  fetchAdminOverview,
  fetchAdminUsers,
  updateAdminUser,
  deleteAdminUser,
  deleteSurplus,
  deleteNeed,
  deleteWaste,
  fetchWaste,
} from '../api';
import {
  DatabaseIcon,
  ShieldLockIcon,
  RefreshIcon,
  DownloadIcon,
  EyeIcon,
  EditIcon,
  CrossIcon,
  CheckIcon,
} from '../components/Icons';
import { Language, translations } from '../i18n';

interface DatabaseManagementViewProps {
  currentUser: User | null;
  surpluses: SurplusOffer[];
  needs: RecipientNeed[];
  matches: Match[];
  onRefreshAll: () => void;
  language: Language;
}

type TableTab = 'users' | 'surplus' | 'needs' | 'waste' | 'matches';

export const DatabaseManagementView: React.FC<DatabaseManagementViewProps> = ({
  currentUser,
  surpluses,
  needs,
  matches,
  onRefreshAll,
  language,
}) => {
  const t = translations[language];

  // Active sub-tab
  const [activeTab, setActiveTab] = useState<TableTab>('users');

  // Overview metrics
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [overviewLoading, setOverviewLoading] = useState(false);

  // Users data
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // Waste records
  const [wasteLogs, setWasteLogs] = useState<WasteObservation[]>([]);

  // Search & Filter & Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Sorting
  const [sortField, setSortField] = useState<string>('id');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // Modals for Record Inspector and User Edit
  const [inspectRecord, setInspectRecord] = useState<{ title: string; data: any } | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editRole, setEditRole] = useState<string>('Food Recipient');
  const [editActive, setEditActive] = useState<boolean>(true);

  const isAdmin = currentUser?.role === 'Administrator';

  // Load Admin Data
  const loadAdminData = async () => {
    setOverviewLoading(true);
    setUsersLoading(true);
    try {
      const [overviewRes, usersRes, wasteRes] = await Promise.allSettled([
        fetchAdminOverview(),
        fetchAdminUsers({ limit: 100 }),
        fetchWaste(),
      ]);

      if (overviewRes.status === 'fulfilled') setOverview(overviewRes.value.data);
      if (usersRes.status === 'fulfilled') setUsers(usersRes.value.data);
      if (wasteRes.status === 'fulfilled') setWasteLogs(wasteRes.value.data);
    } catch (err) {
      console.error('Failed to load admin dashboard data', err);
    } finally {
      setOverviewLoading(false);
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Handle User Edit Submit
  const handleSaveUserEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      await updateAdminUser(editingUser.id, { role: editRole as any, is_active: editActive });
      setEditingUser(null);
      loadAdminData();
    } catch (err: any) {
      alert(err?.response?.data?.detail || err.message || 'Failed to update user');
    }
  };

  // Handle Delete User
  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm(t.deleteUserConfirm)) return;
    try {
      await deleteAdminUser(userId);
      loadAdminData();
    } catch (err: any) {
      alert(err?.response?.data?.detail || err.message || 'Failed to delete user');
    }
  };

  // CSV Export for active table
  const handleExportTableCSV = () => {
    let rows: any[] = [];
    let headers: string[] = [];

    if (activeTab === 'users') {
      headers = ['ID', 'Full Name', 'Email', 'Role', 'Organization', 'Location', 'Active', 'Created At'];
      rows = users.map(u => [u.id, `"${u.full_name}"`, `"${u.email}"`, `"${u.role}"`, `"${u.organization_name || ''}"`, `"${u.location}"`, u.is_active, u.created_at]);
    } else if (activeTab === 'surplus') {
      headers = ['ID', 'Donor', 'Category', 'Quantity', 'Unit', 'Location', 'Status', 'Deadline'];
      rows = surpluses.map(s => [s.id, `"${s.donor}"`, `"${s.food_category}"`, s.quantity, `"${s.unit}"`, `"${s.pickup_location}"`, `"${s.status || 'pending'}"`, `"${s.collection_deadline || ''}"`]);
    } else if (activeTab === 'needs') {
      headers = ['ID', 'Recipient Org', 'Category', 'Quantity', 'Unit', 'Location', 'Priority', 'Fulfillment'];
      rows = needs.map(n => [n.id, `"${n.recipient_org}"`, `"${n.food_category}"`, n.quantity, `"${n.unit}"`, `"${n.delivery_location}"`, `"${n.priority}"`, `"${n.fulfillment_status}"`]);
    } else if (activeTab === 'waste') {
      headers = ['ID', 'Source', 'Category', 'Quantity', 'Unit', 'Location', 'Classification'];
      rows = wasteLogs.map(w => [w.id, `"${w.reporting_source}"`, `"${w.food_category}"`, w.quantity, `"${w.unit}"`, `"${w.source_location}"`, `"${w.waste_classification || 'Avoidable'}"`]);
    } else {
      headers = ['ID', 'Surplus ID', 'Need ID', 'Proposed Qty', 'Score', 'Decision', 'Status'];
      rows = matches.map(m => [m.id, m.surplus_offer_id, m.recipient_need_id, m.proposed_quantity, m.compatibility_score, `"${m.decision}"`, `"${m.status}"`]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `${activeTab}_database_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered & Paginated Records
  const currentRecords = useMemo(() => {
    let list: any[] = [];
    if (activeTab === 'users') list = users;
    else if (activeTab === 'surplus') list = surpluses;
    else if (activeTab === 'needs') list = needs;
    else if (activeTab === 'waste') list = wasteLogs;
    else if (activeTab === 'matches') list = matches;

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      list = list.filter(item => JSON.stringify(item).toLowerCase().includes(term));
    }

    // Status filter
    if (statusFilter !== 'All') {
      list = list.filter(item => {
        const val = item.status || item.fulfillment_status || item.decision || (item.is_active ? 'Active' : 'Inactive');
        return String(val).toLowerCase() === statusFilter.toLowerCase();
      });
    }

    // Sorting
    list = [...list].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (aVal === bVal) return 0;
      if (aVal === undefined || aVal === null) return 1;
      if (bVal === undefined || bVal === null) return -1;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortAsc ? aVal - bVal : bVal - aVal;
      }
      return sortAsc ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal));
    });

    return list;
  }, [activeTab, users, surpluses, needs, wasteLogs, matches, searchTerm, statusFilter, sortField, sortAsc]);

  const totalPages = Math.ceil(currentRecords.length / pageSize) || 1;
  const paginatedList = currentRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSort = (field: string) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="view-content-wrapper">
      {/* Header */}
      <div className="view-header-row">
        <div>
          <div className="flex items-center gap-2">
            <ShieldLockIcon className="w-6 h-6 text-emerald-600" />
            <h2 className="view-title">{t.adminTitle}</h2>
          </div>
          <p className="view-subtitle">{t.adminSubtitle}</p>
        </div>

        <div className="flex gap-2">
          <button onClick={handleExportTableCSV} className="btn btn-secondary">
            <DownloadIcon className="w-4 h-4" />
            <span>{t.exportCsv}</span>
          </button>
          <button onClick={() => { loadAdminData(); onRefreshAll(); }} className="btn btn-primary">
            <RefreshIcon className="w-4 h-4" />
            <span>{t.refreshData}</span>
          </button>
        </div>
      </div>

      {/* 1. Database Overview KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card kpi-card-emerald">
          <div className="kpi-card-header">
            <span className="kpi-card-title">Registered Accounts</span>
            <div className="kpi-icon-bubble kpi-icon-emerald"><DatabaseIcon className="w-5 h-5 text-emerald-700" /></div>
          </div>
          <div className="kpi-value-group">
            <span className="kpi-card-value">{overview?.total_users ?? users.length}</span>
            <span className="kpi-card-unit">Users</span>
          </div>
        </div>

        <div className="kpi-card kpi-card-amber">
          <div className="kpi-card-header">
            <span className="kpi-card-title">Surplus Offers Logged</span>
            <div className="kpi-icon-bubble kpi-icon-amber"><DatabaseIcon className="w-5 h-5 text-amber-700" /></div>
          </div>
          <div className="kpi-value-group">
            <span className="kpi-card-value">{overview?.total_surplus_offers ?? surpluses.length}</span>
            <span className="kpi-card-unit">Records</span>
          </div>
        </div>

        <div className="kpi-card kpi-card-cyan">
          <div className="kpi-card-header">
            <span className="kpi-card-title">Recipient Food Needs</span>
            <div className="kpi-icon-bubble kpi-icon-cyan"><DatabaseIcon className="w-5 h-5 text-cyan-700" /></div>
          </div>
          <div className="kpi-value-group">
            <span className="kpi-card-value">{overview?.total_recipient_needs ?? needs.length}</span>
            <span className="kpi-card-unit">Requests</span>
          </div>
        </div>

        <div className="kpi-card kpi-card-indigo">
          <div className="kpi-card-header">
            <span className="kpi-card-title">Total Matches Generated</span>
            <div className="kpi-icon-bubble kpi-icon-indigo"><DatabaseIcon className="w-5 h-5 text-indigo-700" /></div>
          </div>
          <div className="kpi-value-group">
            <span className="kpi-card-value">{overview?.total_matches ?? matches.length}</span>
            <span className="kpi-card-unit">Allocations</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            ✅ {overview?.approved_matches ?? 0} approved • ⏳ {overview?.pending_matches ?? 0} pending
          </div>
        </div>
      </div>

      {/* 2. Table Selection Tabs */}
      <div className="admin-table-tabs">
        <button
          onClick={() => { setActiveTab('users'); setCurrentPage(1); setSearchTerm(''); }}
          className={`admin-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
        >
          👤 Users ({users.length})
        </button>
        <button
          onClick={() => { setActiveTab('surplus'); setCurrentPage(1); setSearchTerm(''); }}
          className={`admin-tab-btn ${activeTab === 'surplus' ? 'active' : ''}`}
        >
          📦 Surplus Offers ({surpluses.length})
        </button>
        <button
          onClick={() => { setActiveTab('needs'); setCurrentPage(1); setSearchTerm(''); }}
          className={`admin-tab-btn ${activeTab === 'needs' ? 'active' : ''}`}
        >
          🤝 Recipient Needs ({needs.length})
        </button>
        <button
          onClick={() => { setActiveTab('waste'); setCurrentPage(1); setSearchTerm(''); }}
          className={`admin-tab-btn ${activeTab === 'waste' ? 'active' : ''}`}
        >
          📊 Waste Logs ({wasteLogs.length})
        </button>
        <button
          onClick={() => { setActiveTab('matches'); setCurrentPage(1); setSearchTerm(''); }}
          className={`admin-tab-btn ${activeTab === 'matches' ? 'active' : ''}`}
        >
          ⚡ Matches ({matches.length})
        </button>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="filter-controls-row">
        <div className="filter-search-box">
          <input
            type="text"
            placeholder={`Search across ${activeTab} records...`}
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="filter-input"
          />
        </div>

        <div className="filter-dropdown-box">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="filter-select"
          >
            <option value="All">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="claimed">Claimed</option>
            <option value="open">Open</option>
            <option value="active">Active</option>
          </select>
        </div>
      </div>

      {/* 4. Table Rendering */}
      <div className="data-table-card">
        <div className="table-responsive">
          <table className="enterprise-table">
            <thead>
              {activeTab === 'users' && (
                <tr>
                  <th onClick={() => toggleSort('id')} className="cursor-pointer">ID {sortField === 'id' ? (sortAsc ? '▲' : '▼') : ''}</th>
                  <th onClick={() => toggleSort('full_name')} className="cursor-pointer">Full Name</th>
                  <th onClick={() => toggleSort('email')} className="cursor-pointer">Email</th>
                  <th onClick={() => toggleSort('role')} className="cursor-pointer">Role</th>
                  <th>Organization</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              )}

              {activeTab === 'surplus' && (
                <tr>
                  <th onClick={() => toggleSort('id')} className="cursor-pointer">ID</th>
                  <th onClick={() => toggleSort('donor')} className="cursor-pointer">Donor</th>
                  <th onClick={() => toggleSort('food_category')} className="cursor-pointer">Category</th>
                  <th onClick={() => toggleSort('quantity')} className="cursor-pointer">Quantity</th>
                  <th>Location & GPS</th>
                  <th>Deadline</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              )}

              {activeTab === 'needs' && (
                <tr>
                  <th onClick={() => toggleSort('id')} className="cursor-pointer">ID</th>
                  <th onClick={() => toggleSort('recipient_org')} className="cursor-pointer">Organization</th>
                  <th onClick={() => toggleSort('food_category')} className="cursor-pointer">Category</th>
                  <th onClick={() => toggleSort('quantity')} className="cursor-pointer">Quantity</th>
                  <th>Delivery Location</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              )}

              {activeTab === 'waste' && (
                <tr>
                  <th onClick={() => toggleSort('id')} className="cursor-pointer">ID</th>
                  <th>Reporting Source</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Location</th>
                  <th>Classification</th>
                  <th>Actions</th>
                </tr>
              )}

              {activeTab === 'matches' && (
                <tr>
                  <th onClick={() => toggleSort('id')} className="cursor-pointer">Match ID</th>
                  <th>Surplus ID</th>
                  <th>Need ID</th>
                  <th>Proposed Qty</th>
                  <th>Score</th>
                  <th>Decision</th>
                  <th>Actions</th>
                </tr>
              )}
            </thead>

            <tbody>
              {paginatedList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center p-8 text-gray-500">
                    No database records found matching criteria.
                  </td>
                </tr>
              ) : (
                paginatedList.map((item: any) => (
                  <tr key={item.id}>
                    {activeTab === 'users' && (
                      <>
                        <td className="font-mono text-xs text-gray-400">#{item.id}</td>
                        <td className="font-semibold text-gray-900">{item.full_name}</td>
                        <td className="text-gray-600 text-sm">{item.email}</td>
                        <td>
                          <span className={`item-badge ${item.role === 'Administrator' ? 'badge-urgent' : item.role === 'Food Donor' ? 'badge-ready' : 'badge-pending'}`}>
                            {item.role}
                          </span>
                        </td>
                        <td className="text-sm">{item.organization_name || '—'}</td>
                        <td className="text-sm text-gray-600">{item.location || '—'}</td>
                        <td>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${item.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                            {item.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setInspectRecord({ title: `User #${item.id}: ${item.full_name}`, data: item })}
                              className="btn-icon-action"
                              title="Inspect Record"
                            >
                              <EyeIcon className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => { setEditingUser(item); setEditRole(item.role); setEditActive(item.is_active); }}
                              className="btn-icon-action"
                              title="Edit User"
                            >
                              <EditIcon className="w-3.5 h-3.5" />
                            </button>
                            {item.id !== currentUser?.id && (
                              <button
                                onClick={() => handleDeleteUser(item.id)}
                                className="btn-icon-action text-red-600"
                                title="Delete User"
                              >
                                <CrossIcon className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </>
                    )}

                    {activeTab === 'surplus' && (
                      <>
                        <td className="font-mono text-xs text-gray-400">#{item.id}</td>
                        <td className="font-semibold text-gray-900">{item.donor}</td>
                        <td><span className="category-pill">{item.food_category}</span></td>
                        <td className="font-bold text-emerald-800">{item.quantity} {item.unit}</td>
                        <td className="text-sm text-gray-600">
                          {item.pickup_location} {item.latitude ? `(${item.latitude.toFixed(2)}, ${item.longitude.toFixed(2)})` : ''}
                        </td>
                        <td className="text-xs text-gray-500">
                          {item.collection_deadline ? new Date(item.collection_deadline).toLocaleDateString() : 'Immediate'}
                        </td>
                        <td>
                          <span className="item-badge badge-ready">{item.status || 'pending'}</span>
                        </td>
                        <td>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setInspectRecord({ title: `Surplus Offer #${item.id}: ${item.donor}`, data: item })}
                              className="btn-icon-action"
                              title="Inspect Details"
                            >
                              <EyeIcon className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={async () => {
                                if (window.confirm('Delete surplus offer record?')) {
                                  await deleteSurplus(item.id);
                                  onRefreshAll();
                                }
                              }}
                              className="btn-icon-action text-red-600"
                              title="Delete Record"
                            >
                              <CrossIcon className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </>
                    )}

                    {activeTab === 'needs' && (
                      <>
                        <td className="font-mono text-xs text-gray-400">#{item.id}</td>
                        <td className="font-semibold text-gray-900">{item.recipient_org}</td>
                        <td><span className="category-pill">{item.food_category}</span></td>
                        <td className="font-bold text-cyan-800">{item.quantity} {item.unit}</td>
                        <td className="text-sm text-gray-600">{item.delivery_location}</td>
                        <td>
                          <span className={`item-badge ${item.priority === 'urgent' ? 'badge-urgent' : item.priority === 'high' ? 'badge-high' : 'badge-pending'}`}>
                            {item.priority || 'normal'}
                          </span>
                        </td>
                        <td>
                          <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            {item.fulfillment_status || 'open'}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setInspectRecord({ title: `Recipient Need #${item.id}: ${item.recipient_org}`, data: item })}
                              className="btn-icon-action"
                              title="Inspect Details"
                            >
                              <EyeIcon className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={async () => {
                                if (window.confirm('Delete recipient need request?')) {
                                  await deleteNeed(item.id);
                                  onRefreshAll();
                                }
                              }}
                              className="btn-icon-action text-red-600"
                              title="Delete Record"
                            >
                              <CrossIcon className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </>
                    )}

                    {activeTab === 'waste' && (
                      <>
                        <td className="font-mono text-xs text-gray-400">#{item.id}</td>
                        <td className="font-semibold text-gray-900">{item.reporting_source}</td>
                        <td>{item.food_category}</td>
                        <td className="font-bold text-amber-700">{item.quantity} {item.unit}</td>
                        <td className="text-sm text-gray-600">{item.source_location}</td>
                        <td>{item.waste_classification || 'Avoidable'}</td>
                        <td>
                          <button
                            onClick={() => setInspectRecord({ title: `Waste Observation #${item.id}`, data: item })}
                            className="btn-icon-action"
                            title="Inspect Details"
                          >
                            <EyeIcon className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </>
                    )}

                    {activeTab === 'matches' && (
                      <>
                        <td className="font-mono text-xs font-bold text-indigo-700">#{item.id}</td>
                        <td>Offer #{item.surplus_offer_id}</td>
                        <td>Need #{item.recipient_need_id}</td>
                        <td className="font-bold">{item.proposed_quantity} kg</td>
                        <td className="font-bold text-emerald-700">{item.compatibility_score || 85}%</td>
                        <td>
                          <span className={`item-badge ${item.decision === 'approved' ? 'badge-ready' : item.decision === 'rejected' ? 'badge-urgent' : 'badge-pending'}`}>
                            {item.decision}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => setInspectRecord({ title: `Match Record #${item.id}`, data: item })}
                            className="btn-icon-action"
                            title="Inspect Details"
                          >
                            <EyeIcon className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="table-pagination-bar">
          <span className="text-xs text-gray-500">
            Showing {paginatedList.length} of {currentRecords.length} records (Page {currentPage} of {totalPages})
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="pagination-nav-btn"
            >
              ◀ Prev
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="pagination-nav-btn"
            >
              Next ▶
            </button>
          </div>
        </div>
      </div>

      {/* 5. Record Inspector Modal */}
      {inspectRecord && (
        <div className="modal-backdrop">
          <div className="modal-container">
            <div className="modal-header">
              <h3 className="modal-title font-mono text-base">{inspectRecord.title}</h3>
              <button onClick={() => setInspectRecord(null)} className="modal-close-btn">
                <CrossIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="record-inspector-grid">
                {Object.entries(inspectRecord.data).map(([key, value]) => {
                  if (key.includes('password') || key.includes('token')) return null;
                  return (
                    <div key={key} className="record-inspector-row">
                      <span className="inspector-key">{key}:</span>
                      <span className="inspector-val">{String(value ?? '—')}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="modal-actions p-4 border-t border-gray-100">
              <button onClick={() => setInspectRecord(null)} className="btn btn-secondary">
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. User Edit Modal */}
      {editingUser && (
        <div className="modal-backdrop">
          <div className="modal-container">
            <div className="modal-header">
              <h3 className="modal-title">Edit User: {editingUser.full_name}</h3>
              <button onClick={() => setEditingUser(null)} className="modal-close-btn">
                <CrossIcon className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveUserEdit} className="modal-form">
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="text" disabled value={editingUser.email} className="form-input bg-gray-100" />
              </div>

              <div className="form-group">
                <label className="form-label">Role</label>
                <select value={editRole} onChange={(e) => setEditRole(e.target.value)} className="form-select">
                  <option value="Food Recipient">Food Recipient (NGO/Shelter)</option>
                  <option value="Food Donor">Food Donor (Restaurant/Store)</option>
                  <option value="Administrator">Administrator</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Account Status</label>
                <div className="flex gap-4 mt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input type="radio" checked={editActive} onChange={() => setEditActive(true)} />
                    Active
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input type="radio" checked={!editActive} onChange={() => setEditActive(false)} />
                    Inactive / Suspended
                  </label>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setEditingUser(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
