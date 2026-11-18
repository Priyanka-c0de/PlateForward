import React, { useState } from 'react';
import { createSurplus } from '../api';
import { SurplusOffer } from '../types';
import { CrossIcon, MapPinIcon } from './Icons';
import { Language, translations } from '../i18n';

interface SurplusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  language: Language;
}

export const SurplusModal: React.FC<SurplusModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  language,
}) => {
  const t = translations[language];

  const [donor, setDonor] = useState('');
  const [foodCategory, setFoodCategory] = useState('Vegetables');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('kg');
  const [pickupLocation, setPickupLocation] = useState('');
  const [lat, setLat] = useState<number | undefined>(undefined);
  const [lng, setLng] = useState<number | undefined>(undefined);
  const [locating, setLocating] = useState(false);
  const [storageInfo, setStorageInfo] = useState('');
  const [collectionDeadline, setCollectionDeadline] = useState('');
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
        if (!pickupLocation) {
          setPickupLocation(`Collection Point (${latitude.toFixed(3)}, ${longitude.toFixed(3)})`);
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
    if (!donor || !quantity || !pickupLocation) {
      setError('Please fill in donor, quantity, and pickup location.');
      return;
    }
    setSubmitting(true);
    setError('');

    try {
      const payload: Partial<SurplusOffer> = {
        donor,
        food_category: foodCategory,
        description: description || undefined,
        quantity: parseFloat(quantity),
        unit,
        pickup_location: pickupLocation,
        latitude: lat || 28.6304,
        longitude: lng || 77.2177,
        storage_info: storageInfo || undefined,
        collection_deadline: collectionDeadline ? new Date(collectionDeadline).toISOString() : undefined,
        status: 'pending',
        verification_status: 'verified',
      };
      await createSurplus(payload);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.detail || err.message || 'Failed to create surplus offer');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <div className="modal-header">
          <h3 className="modal-title">{t.addSurplus}</h3>
          <button onClick={onClose} className="modal-close-btn">
            <CrossIcon className="w-5 h-5" />
          </button>
        </div>

        {error && <div className="modal-error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form max-h-96 overflow-y-auto">
          <div className="form-group">
            <label className="form-label">{t.donorName} *</label>
            <input
              type="text"
              required
              placeholder="e.g. Metro Supermarket, Grand Palace Hotel"
              value={donor}
              onChange={(e) => setDonor(e.target.value)}
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
                placeholder="50"
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
              placeholder="e.g. Connaught Place / Sector 18, Noida"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
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
              <label className="form-label">{t.deadline}</label>
              <input
                type="datetime-local"
                value={collectionDeadline}
                onChange={(e) => setCollectionDeadline(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group flex-1">
              <label className="form-label">Storage Constraints</label>
              <input
                type="text"
                placeholder="e.g. Refrigerated, Dry storage"
                value={storageInfo}
                onChange={(e) => setStorageInfo(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t.description}</label>
            <textarea
              rows={2}
              placeholder="Optional notes regarding packaging or allergen info..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
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
