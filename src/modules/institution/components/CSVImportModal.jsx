import React, { useState, useRef } from 'react';
import {
  X, FileUp, Download, CheckCircle2, CircleAlert, AlertTriangle,
  UploadCloud, FileText, Check, ArrowRight
} from 'lucide-react';
import { parseLearnerCSV, triggerDownload } from '../data/storage.js';

export default function CSVImportModal({
  isOpen,
  onClose,
  existingLearners,
  onImportSuccess,
  flash
}) {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [activeTab, setActiveTab] = useState('valid'); // 'valid' | 'invalid' | 'duplicates'
  const [isProcessing, setIsProcessing] = useState(false);
  const [importSummary, setImportSummary] = useState(null);

  if (!isOpen) return null;

  function handleFileSelect(selectedFile) {
    if (!selectedFile) return;
    setFile(selectedFile);
    setIsProcessing(true);
    setImportSummary(null);

    const reader = new FileReader();
    reader.onload = e => {
      const text = e.target.result;
      const result = parseLearnerCSV(text, existingLearners);
      setParsedData(result);
      setIsProcessing(false);
      if (result.error) {
        setActiveTab('invalid');
      } else if (result.valid.length > 0) {
        setActiveTab('valid');
      } else if (result.invalid.length > 0) {
        setActiveTab('invalid');
      }
    };
    reader.onerror = () => {
      setParsedData({ error: 'Failed to read file from disk.' });
      setIsProcessing(false);
    };
    reader.readAsText(selectedFile);
  }

  function handleDrop(e) {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) handleFileSelect(droppedFile);
  }

  function handleDownloadSample() {
    const sampleHeaders = 'name,email,dept,program,progress\r\n';
    const sampleRows = [
      '"Siddharth Rao","siddharth.rao@kits.edu","CSE","Full Stack Engineering",88',
      '"Manasa Reddy","manasa.reddy@kits.edu","IT","Cloud & DevOps",92',
      '"Karthik Varma","karthik.varma@kits.edu","ECE","Data Engineering",65',
      '"Tanvi Sharma","tanvi.sharma@kits.edu","EEE","Full Stack Engineering",78'
    ].join('\r\n');
    triggerDownload('sample-learners.csv', sampleHeaders + sampleRows);
    flash('Sample CSV template downloaded.');
  }

  function handleConfirmImport() {
    if (!parsedData || !parsedData.valid || parsedData.valid.length === 0) return;

    onImportSuccess(parsedData.valid);
    const validCount = parsedData.valid.length;
    const dupeCount = parsedData.duplicates.length;
    flash(`Successfully imported ${validCount} learner record(s).`);
    handleReset();
    onClose();
  }

  function handleReset() {
    setFile(null);
    setParsedData(null);
    setIsProcessing(false);
    setImportSummary(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="csv-modal-title"
      onMouseDown={e => e.target === e.currentTarget && onClose()}
    >
      <div className="modal card csv-modal-card">
        {/* MODAL HEADER */}
        <div className="modal-head">
          <div>
            <div className="eyebrow">DATA MANAGEMENT · BULK IMPORT</div>
            <h2 id="csv-modal-title">Import Learners from CSV</h2>
          </div>
          <button
            type="button"
            className="icon-btn"
            onClick={onClose}
            aria-label="Close CSV import"
          >
            <X size={17} />
          </button>
        </div>

        <p className="modal-description">
          Upload a structured CSV file with columns:{' '}
          <code>name, email, dept, program, progress</code>.
        </p>

        {/* DRAG & DROP ZONE */}
        {!file && (
          <div
            className="drop-zone"
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadCloud size={32} className="drop-icon" />
            <div className="drop-title">Click to upload or drag & drop CSV file</div>
            <p className="drop-hint">UTF-8 encoded .csv files up to 10MB</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              style={{ display: 'none' }}
              onChange={e => handleFileSelect(e.target.files?.[0])}
            />
          </div>
        )}

        {/* SAMPLE TEMPLATE BUTTON */}
        <div className="sample-csv-action">
          <span>Need the standard template?</span>
          <button
            type="button"
            className="text-action"
            onClick={handleDownloadSample}
          >
            <Download size={13} />
            <span>Download Sample CSV Template</span>
          </button>
        </div>

        {/* PROCESSING LOADER */}
        {isProcessing && (
          <div className="loading-state">
            <span className="spinner" />
            <span>Parsing and validating CSV records...</span>
          </div>
        )}

        {/* PARSED SUMMARY AND PREVIEW */}
        {parsedData && !isProcessing && (
          <div className="csv-preview-container">
            {parsedData.error ? (
              <div className="form-error-banner">
                <CircleAlert size={16} />
                <span>{parsedData.error}</span>
              </div>
            ) : (
              <>
                <div className="csv-stats-bar">
                  <div className="csv-stat-pill good">
                    <CheckCircle2 size={13} />
                    <span>{parsedData.valid.length} Valid Records</span>
                  </div>
                  {parsedData.invalid.length > 0 && (
                    <div className="csv-stat-pill error">
                      <CircleAlert size={13} />
                      <span>{parsedData.invalid.length} Invalid Rows</span>
                    </div>
                  )}
                  {parsedData.duplicates.length > 0 && (
                    <div className="csv-stat-pill warning">
                      <AlertTriangle size={13} />
                      <span>{parsedData.duplicates.length} Duplicates Detected</span>
                    </div>
                  )}
                  <button
                    type="button"
                    className="text-action csv-reupload"
                    onClick={handleReset}
                  >
                    Change file
                  </button>
                </div>

                {/* TABS */}
                <div className="csv-tab-bar">
                  <button
                    type="button"
                    className={`csv-tab ${activeTab === 'valid' ? 'active' : ''}`}
                    onClick={() => setActiveTab('valid')}
                  >
                    Valid Records ({parsedData.valid.length})
                  </button>
                  {parsedData.invalid.length > 0 && (
                    <button
                      type="button"
                      className={`csv-tab ${activeTab === 'invalid' ? 'active' : ''}`}
                      onClick={() => setActiveTab('invalid')}
                    >
                      Errors ({parsedData.invalid.length})
                    </button>
                  )}
                </div>

                {/* PREVIEW TABLE */}
                <div className="table-wrap csv-preview-table">
                  {activeTab === 'valid' && (
                    <table>
                      <thead>
                        <tr>
                          <th>NAME</th>
                          <th>EMAIL</th>
                          <th>DEPT</th>
                          <th>PROGRAMME</th>
                          <th>PROGRESS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parsedData.valid.slice(0, 10).map((r, i) => (
                          <tr key={i}>
                            <td><strong>{r.name}</strong></td>
                            <td>{r.email}</td>
                            <td><span className="csv-tag">{r.dept}</span></td>
                            <td>{r.program}</td>
                            <td><strong>{r.progress}%</strong></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {activeTab === 'invalid' && (
                    <table>
                      <thead>
                        <tr>
                          <th>LINE</th>
                          <th>DATA PREVIEW</th>
                          <th>VALIDATION ISSUES</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parsedData.invalid.map((inv, i) => (
                          <tr key={i}>
                            <td><strong>#{inv.rowNumber}</strong></td>
                            <td>
                              <span className="raw-preview">{inv.raw}</span>
                            </td>
                            <td>
                              <span className="error-text">
                                {inv.issues.join('; ')}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                {parsedData.valid.length > 10 && activeTab === 'valid' && (
                  <p className="preview-more-hint">
                    Showing first 10 of {parsedData.valid.length} valid records.
                  </p>
                )}
              </>
            )}
          </div>
        )}

        {/* MODAL ACTIONS */}
        <div className="modal-actions">
          <button type="button" className="btn secondary" onClick={onClose}>
            <span>Cancel</span>
          </button>
          <button
            type="button"
            className="btn primary"
            disabled={!parsedData || !parsedData.valid || parsedData.valid.length === 0}
            onClick={handleConfirmImport}
          >
            <Check size={14} />
            <span>
              {parsedData?.valid?.length
                ? `Import ${parsedData.valid.length} Records`
                : 'Import Learners'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
