import React, { useState } from 'react';
import { createNeed } from '../api';
import { RecipientNeed } from '../types';
import { CrossIcon, MapPinIcon } from './Icons';
import { Language, translations } from '../i18n';

interface NeedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  language: Language;
}

export const NeedModal: React.FC<NeedModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  language,
}) => {
  const t = translations[language];

  const [recipientOrg, setRecipientOrg] = useState('');
  const [foodCategory, setFoodCategory] = useState('Vegetables');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('kg');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [lat, setLat] = useState<number | undefined>(undefined);
  const [lng, setLng] = useState<number | undefined>(undefined);
  const [locating, setLocating] = useState(false);
  const [requiredDate, setRequiredDate] = useState('');
  const [priority, setPriority] = useState('normal');
  const [priorityReason, setPriorityReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleGetGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported by browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const latitude = Number(pos.coords.latitude.toFixed(5));
        const longitude = Number(pos.coords.longitude.toFixed(5));
        setLat(latitude);
        setLng(longitude);
        if (!deliveryLocation) {
          setDeliveryLocation(`Delivery Shelter (${latitude.toFixed(3)}, ${longitude.toFixed(3)})`);
        }
        setLocating(false);
      },
      () => {
        alert('Could not retrieve GPS coordinates. You can type location manually.');
        setLocating(false);
      },
      { timeout: 8000 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientOrg || !quantity || !deliveryLocation) {
      setError('Please fill in recipient organization, quantity, and delivery location.');
      return;
    }
    setSubmitting(true);
    setError('');

    try {
      const payload: Partial<RecipientNeed> = {
        recipient_org: recipientOrg,
        food_category: foodCategory,
        quantity: parseFloat(quantity),
        unit,
        delivery_location: deliveryLocation,
        latitude: lat || 28.6280,
        longitude: lng || 77.3649,
        required_date: requiredDate ? new Date(requiredDate).toISOString() : undefined,
        priority,
        priority_reason: priorityReason || undefined,
        verification_status: 'verified',
        fulfillment_status: 'open',
      };
      await createNeed(payload);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.detail || err.message || 'Failed to create recipient need');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <div className="modal-header">
          <h3 className="modal-title">{t.contactNgo}</h3>
          <button onClick={onClose} className="modal-close-btn">
            <CrossIcon className="w-5 h-5" />
          </button>
        </div>

        {error && <div className="modal-error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form max-h-96 overflow-y-auto">
          <div className="form-group">
            <label className="form-label">{t.recipientOrg} *</label>
            <input
              type="text"
              required
              placeholder="e.g. Hope Food Bank, City Care Shelter"
              value={recipientOrg}
              onChange={(e) => setRecipientOrg(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label className="form-label">{t.category} *</label>
              <select
                value={foodCategory}
                onChange={(e) => setFoodCategory(e.target.value)}
                className="form-select"
              >
                <option value="Vegetables">Vegetables</option>
                <option value="Fruits">Fruits</option>
                <option value="Grains">Grains & Bread</option>
                <option value="Dairy">Dairy Products</option>
                <option value="Cooked Meals">Cooked Meals</option>
                <option value="Bakery">Bakery & Pastries</option>
                <option value="Canned Goods">Canned Goods</option>
              </select>
            </div>

            <div className="form-group w-32">
              <label className="form-label">{t.quantity} *</label>
              <input
                type="number"
                step="any"
                min="0.1"
                required
                placeholder="40"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group w-24">
              <label className="form-label">{t.unit} *</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="form-select"
              >
                <option value="kg">kg</option>
                <option value="units">units</option>
                <option value="portions">portions</option>
                <option value="liters">liters</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <div className="flex justify-between items-center">
              <label className="form-label">{t.location} *</label>
              <button
                type="button"
                onClick={handleGetGPS}
                disabled={locating}
                className="btn-gps-detect"
              >
                <MapPinIcon className="w-3.5 h-3.5 text-emerald-600" />
                <span>{locating ? 'Locating...' : 'Get GPS'}</span>
              </button>
            </div>
            <input
              type="text"
              required
              placeholder="e.g. Sector 62, Noida / Mayur Vihar"
              value={deliveryLocation}
              onChange={(e) => setDeliveryLocation(e.target.value)}
              className="form-input"
            />
            {lat && lng && (
              <span className="text-xs text-emerald-700 font-mono mt-0.5">
                Coords: {lat}, {lng}
              </span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label className="form-label">Required Date</label>
              <input
                type="datetime-local"
                value={requiredDate}
                onChange={(e) => setRequiredDate(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group flex-1">
              <label className="form-label">{t.priority} *</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="form-select"
              >
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Beneficiary Details / Reason</label>
            <input
              type="text"
              placeholder="e.g. Serving 120 evening meals to community shelter"
              value={priorityReason}
              onChange={(e) => setPriorityReason(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="btn btn-secondary"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
            >
              {submitting ? t.loading : t.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
