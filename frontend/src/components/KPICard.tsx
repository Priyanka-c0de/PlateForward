import React from 'react';
import { TrendingUpIcon } from './Icons';

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  changeText?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
  variant?: 'emerald' | 'amber' | 'cyan' | 'indigo';
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  unit,
  changeText,
  isPositive = true,
  icon,
  variant = 'emerald',
}) => {
  return (
    <div className={`kpi-card kpi-card-${variant}`}>
      <div className="kpi-card-header">
        <span className="kpi-card-title">{title}</span>
        <div className={`kpi-icon-bubble kpi-icon-${variant}`}>
          {icon}
        </div>
      </div>
      <div className="kpi-card-body">
        <div className="kpi-value-group">
          <span className="kpi-card-value">{value}</span>
          {unit && <span className="kpi-card-unit">{unit}</span>}
        </div>
        {changeText && (
          <div className="kpi-trend-row">
            <span className={`kpi-trend-pill ${isPositive ? 'trend-up' : 'trend-down'}`}>
              <TrendingUpIcon className="w-3.5 h-3.5" />
              {changeText}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
