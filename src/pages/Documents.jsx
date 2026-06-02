import React, { useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { FileText, Download, Trash2, Plus, Upload } from 'lucide-react';
import { formatBytes } from '../utils/helpers';
import { pdfStore } from '../stores/PdfStore';

export const Documents = observer(() => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      alert('Please upload PDF files only.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Uri = event.target.result;
      
      pdfStore.addPdf({
        name: file.name || 'document.pdf',
        uri: base64Uri,
        fileSize: file.size || 0,
      });

      alert(`"${file.name}" has been successfully added to your Document Vault!`);
    };
    reader.readAsDataURL(file);
    e.target.value = null; // Reset file input
  };

  const handleDownload = (pdf) => {
    try {
      const link = document.createElement('a');
      link.href = pdf.uri;
      link.download = pdf.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download failed:', err);
      alert('Failed to download PDF document.');
    }
  };

  const handleDelete = (pdf) => {
    if (window.confirm(`Are you sure you want to permanently delete "${pdf.name}"?`)) {
      pdfStore.deletePdf(pdf._id);
    }
  };

  return (
    <div className="page settings-page">
      {/* Hidden file selector trigger */}
      <input
        type="file"
        accept="application/pdf"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Screen Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ display: 'none' }}>Document Vault</h1> {/* Handled by Dashboard Header */}
          <span className="page-subtitle" style={{ marginTop: '0px' }}>
            {pdfStore.pdfs.length} PDF documents stored in-memory
          </span>
        </div>
        <button className="btn-primary" onClick={() => fileInputRef.current?.click()}>
          <Plus size={16} style={{ marginRight: '6px' }} />
          Upload PDF
        </button>
      </div>

      {/* Documents Listing */}
      <div className="list-container">
        {pdfStore.sortedPdfs.length > 0 ? (
          <div className="pdf-list">
            {pdfStore.sortedPdfs.map(pdf => (
              <div key={pdf._id} className="pdf-card">
                <div className="pdf-icon-bg">
                  <FileText size={24} color="#EF4444" />
                </div>

                <div className="pdf-info">
                  <h4 className="pdf-name" title={pdf.name}>
                    {pdf.name}
                  </h4>
                  <div className="pdf-meta-row">
                    <span className="pdf-size">{formatBytes(pdf.fileSize)}</span>
                    <span className="pdf-divider">•</span>
                    <span className="pdf-time">
                      {new Date(pdf.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="card-actions">
                  <button
                    className="download-card-btn"
                    onClick={() => handleDownload(pdf)}
                    title="Download PDF"
                  >
                    <Download size={18} color="#059669" />
                  </button>

                  <button
                    className="delete-card-btn"
                    onClick={() => handleDelete(pdf)}
                    title="Delete PDF"
                  >
                    <Trash2 size={18} color="#EF4444" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-icon" role="img" aria-label="folder">📁</span>
            <h3 className="empty-title">No Documents Found</h3>
            <p className="empty-hint">
              Upload PDF blueprints or manuals to test robust in-memory local files vaults.
            </p>
            <button 
              className="btn-secondary" 
              style={{ marginTop: '16px', padding: '10px 20px' }}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={14} style={{ marginRight: '8px' }} />
              Upload PDF Document
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

export default Documents;
