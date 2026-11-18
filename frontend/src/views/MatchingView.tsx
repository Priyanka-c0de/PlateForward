import React, { useState } from 'react';
import { Match, SurplusOffer, RecipientNeed } from '../types';
import { MatchingIcon, CheckIcon, CrossIcon, RefreshIcon } from '../components/Icons';
import { Language, translations } from '../i18n';

interface MatchingViewProps {
  matches: Match[];
  surpluses: SurplusOffer[];
  needs: RecipientNeed[];
  loading: boolean;
  onRefresh: () => void;
  onRunMatch: () => void;
  onDecideMatch: (id: number, decision: 'approved' | 'rejected') => void;
  language: Language;
}

export const MatchingView: React.FC<MatchingViewProps> = ({
  matches,
  surpluses,
  needs,
  loading,
  onRefresh,
  onRunMatch,
  onDecideMatch,
  language,
}) => {
  const t = translations[language];
  const [filterDecision, setFilterDecision] = useState('All');
  const [actingId, setActingId] = useState<number | null>(null);

  const filteredMatches = matches.filter((m) => {
    if (filterDecision === 'All') return true;
    return m.decision?.toLowerCase() === filterDecision.toLowerCase();
  });

  const handleDecision = async (id: number, decision: 'approved' | 'rejected') => {
    setActingId(id);
    try {
      await onDecideMatch(id, decision);
    } finally {
      setActingId(null);
    }
  };

  // Find linked surplus and need details for rich presentation
  const getMatchContext = (match: Match) => {
    const surplus = surpluses.find((s) => s.id === match.surplus_offer_id);
    const need = needs.find((n) => n.id === match.recipient_need_id);
    return { surplus, need };
  };

  return (
    <div className="view-content-wrapper">
      {/* Header */}
      <div className="view-header-row">
        <div>
          <h2 className="view-title">{t.navMatching}</h2>
          <p className="view-subtitle">
            Rule-based multi-factor allocation engine pairing surplus supply with community food demand
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={onRunMatch} className="btn btn-primary">
            <MatchingIcon className="w-4 h-4" />
            <span>{t.runSmartMatch}</span>
          </button>
        </div>
      </div>

      {/* Matching Engine Criteria Banner */}
      <div className="algorithm-info-banner">
        <div className="algorithm-info-header">
          <MatchingIcon className="w-5 h-5 text-emerald-700" />
          <h4 className="font-semibold text-emerald-950">Matching Engine Logic (0 - 100 Score)</h4>
        </div>
        <div className="algorithm-pills-row">
          <span className="algo-pill">🍱 Food Category (+30)</span>
          <span className="algo-pill">⚖️ Quantity Match (+20)</span>
          <span className="algo-pill">⏳ Deadline Proximity (+20)</span>
          <span className="algo-pill">🚨 Priority Urgency (+20)</span>
          <span className="algo-pill">📍 Location Overlap (+10)</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-controls-row">
        <div className="flex gap-2">
          {['All', 'proposed', 'approved', 'rejected'].map((dec) => (
            <button
              key={dec}
              onClick={() => setFilterDecision(dec)}
              className={`filter-tab-pill ${filterDecision === dec ? 'filter-tab-active' : ''}`}
            >
              {dec === 'All' ? 'All Matches' : dec.charAt(0).toUpperCase() + dec.slice(1)} (
              {dec === 'All'
                ? matches.length
                : matches.filter((m) => m.decision?.toLowerCase() === dec.toLowerCase()).length}
              )
            </button>
          ))}
        </div>
      </div>

      {/* Matches Grid */}
      {loading ? (
        <div className="loading-state">{t.loading}</div>
      ) : filteredMatches.length === 0 ? (
        <div className="empty-state-large">
          <MatchingIcon className="w-12 h-12 text-gray-300 mb-3" />
          <h4 className="font-semibold text-gray-700">{t.noData}</h4>
          <p className="text-sm text-gray-500 mt-1">
            No match recommendations found. Click below to compute compatibility matches.
          </p>
          <button onClick={onRunMatch} className="btn btn-primary mt-4">
            <MatchingIcon className="w-4 h-4" />
            <span>{t.runSmartMatch}</span>
          </button>
        </div>
      ) : (
        <div className="match-cards-grid">
          {filteredMatches.map((match) => {
            const { surplus, need } = getMatchContext(match);
            const score = match.compatibility_score || 80;
            const isApproved = match.decision === 'approved';
            const isRejected = match.decision === 'rejected';

            return (
              <div key={match.id} className="match-card">
                <div className="match-card-top">
                  <div className="match-meta">
                    <span className="match-id-badge">Match #{match.id}</span>
                    <span
                      className={`item-badge ${
                        isApproved ? 'badge-ready' : isRejected ? 'badge-urgent' : 'badge-pending'
                      }`}
                    >
                      {isApproved
                        ? t.statusApproved
                        : isRejected
                        ? t.statusRejected
                        : t.statusPending}
                    </span>
                  </div>

                  {/* Compatibility Score meter */}
                  <div className="compatibility-gauge">
                    <span className="gauge-score">{score}%</span>
                    <span className="gauge-label">{t.score}</span>
                  </div>
                </div>

                {/* Score bar */}
                <div className="score-bar-track">
                  <div
                    className={`score-bar-fill ${
                      score >= 70 ? 'fill-high' : score >= 40 ? 'fill-medium' : 'fill-low'
                    }`}
                    style={{ width: `${score}%` }}
                  />
                </div>

                {/* Parties Details */}
                <div className="match-parties-grid">
                  <div className="party-box surplus-side">
                    <span className="party-type-label">📦 Surplus Donor</span>
                    <span className="party-name">{surplus?.donor || `Offer #${match.surplus_offer_id}`}</span>
                    <span className="party-detail">
                      {surplus?.food_category || 'Category Match'} • {surplus?.pickup_location || 'Collection Point'}
                    </span>
                  </div>

                  <div className="party-divider">➔</div>

                  <div className="party-box need-side">
                    <span className="party-type-label">🤝 Recipient NGO</span>
                    <span className="party-name">{need?.recipient_org || `Need #${match.recipient_need_id}`}</span>
                    <span className="party-detail">
                      {need?.food_category || 'Requested'} • {need?.delivery_location || 'Destination'}
                    </span>
                  </div>
                </div>

                {/* Proposed Allocation */}
                <div className="match-allocation-row">
                  <span className="allocation-label">Proposed Quantity Allocation:</span>
                  <span className="allocation-val">{match.proposed_quantity} kg</span>
                </div>

                {/* Recommendation explanation */}
                <div className="match-explanation-box">
                  <span className="font-semibold text-xs text-gray-700">Reason: </span>
                  <span className="text-xs text-gray-600">{match.recommendation_explanation}</span>
                </div>

                {/* Decision Actions */}
                <div className="match-actions-footer">
                  {match.decision === 'proposed' && match.id ? (
                    <>
                      <button
                        onClick={() => handleDecision(match.id!, 'approved')}
                        disabled={actingId === match.id}
                        className="btn-action-approve"
                      >
                        <CheckIcon className="w-4 h-4" />
                        <span>{t.approve} Match</span>
                      </button>
                      <button
                        onClick={() => handleDecision(match.id!, 'rejected')}
                        disabled={actingId === match.id}
                        className="btn-action-reject"
                      >
                        <CrossIcon className="w-4 h-4" />
                        <span>{t.reject}</span>
                      </button>
                    </>
                  ) : (
                    <div className="decision-completed-note">
                      Decision recorded: <strong className="capitalize">{match.decision}</strong>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
