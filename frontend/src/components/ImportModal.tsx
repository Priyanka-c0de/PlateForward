import React, { useState } from 'react';
import { uploadSurplusCSV, uploadNeedCSV, uploadWasteCSV } from '../api';
import { CrossIcon, UploadIcon } from './Icons';
import { Language, translations } from '../i18n';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  language: Language;
}

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  language,
}) => {
  const t = translations[language];

  const [entityType, setEntityType] = useState<'surplus' | 'need' | 'waste'>('surplus');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setMessage('');
      setError('');
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please choose a CSV or Excel file to upload.');
      return;
    }
    setUploading(true);
    setError('');
    setMessage('');

    try {
      let resp;
      if (entityType === 'surplus') {
        resp = await uploadSurplusCSV(selectedFile);
      } else if (entityType === 'need') {
        resp = await uploadNeedCSV(selectedFile);
      } else {
        resp = await uploadWasteCSV(selectedFile);
      }
      setMessage(`Successfully imported ${resp.data.imported} records!`);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1200);
    } catch (err: any) {
      setError(err?.response?.data?.detail || err.message || 'File import failed. Please check format.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <div className="modal-header">
          <h3 className="modal-title">{t.importDataset}</h3>
          <button onClick={onClose} className="modal-close-btn">
            <CrossIcon className="w-5 h-5" />
          </button>
        </div>

        {error && <div className="modal-error-alert">{error}</div>}
        {message && <div className="modal-success-alert">{message}</div>}

        <form onSubmit={handleUpload} className="modal-form">
          <div className="form-group">
            <label className="form-label">Data Target *</label>
            <select
              value={entityType}
              onChange={(e) => setEntityType(e.target.value as any)}
              className="form-select"
            >
              <option value="surplus">Surplus Food Offers (/import/surplus)</option>
              <option value="need">Recipient Needs (/import/need)</option>
              <option value="waste">Waste Observations (/import/waste)</option>
            </select>
          </div>

          <div className="file-drop-zone">
            <UploadIcon className="w-10 h-10 text-emerald-600 mb-2" />
            <input
              type="file"
              accept=".csv, .xlsx, .xls"
              onChange={handleFileChange}
              className="file-input-hidden"
              id="csvFileInput"
            />
            <label htmlFor="csvFileInput" className="file-drop-label">
              {selectedFile ? (
                <span className="file-chosen-text">{selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
              ) : (
                <>
                  <span className="file-prompt-bold">Click to select CSV/Excel file</span>
                  <span className="file-prompt-sub">Supports .csv, .xlsx formatted datasets</span>
                </>
              )}
            </label>
          </div>

          <div className="format-hints-box">
            <p className="format-hint-title">Expected CSV column headers:</p>
            {entityType === 'surplus' && (
              <code>donor, food_category, quantity, unit, pickup_location, [status]</code>
            )}
            {entityType === 'need' && (
              <code>recipient_org, food_category, quantity, unit, delivery_location, [priority]</code>
            )}
            {entityType === 'waste' && (
              <code>reporting_source, food_category, quantity, unit, source_location</code>
            )}
          </div>

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="btn btn-secondary"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={uploading || !selectedFile}
              className="btn btn-primary"
            >
              {uploading ? t.loading : 'Upload & Process'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
