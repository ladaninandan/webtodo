import React, { useState, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { Camera, Image as ImageIcon, Grid, List, Plus, X, Trash2, ShieldAlert } from 'lucide-react';
import ImageCard from '../components/ImageCard';
import { imageStore } from '../stores/ImageStore';

export const Gallery = observer(() => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  
  // Modals editing states
  const [selectedImage, setSelectedImage] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [tempAsset, setTempAsset] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');

  // File input triggers
  const galleryInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // File selection parser
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Uri = event.target.result;
      
      // Extract width & height dimensions
      const img = new Image();
      img.onload = () => {
        const asset = {
          uri: base64Uri,
          fileName: file.name,
          fileSize: file.size,
          type: file.type || 'image/jpeg',
          width: img.width,
          height: img.height,
        };

        // Open creation modal
        const defaultTitle = `Photo ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        setTempAsset(asset);
        setIsCreating(true);
        setSelectedImage(null);
        setEditTitle(defaultTitle);
        setEditDesc('');
        setDetailModalOpen(true);
        setPickerOpen(false);
      };
      img.src = base64Uri;
    };
    reader.readAsDataURL(file);
    e.target.value = null; // Clear file input
  };

  const handleOpenDetails = (image) => {
    setSelectedImage(image);
    setIsCreating(false);
    setTempAsset(null);
    setEditTitle(image.title);
    setEditDesc(image.description);
    setDetailModalOpen(true);
  };

  const handleSave = () => {
    if (!editTitle.trim()) {
      alert('Please enter a photo title.');
      return;
    }

    if (isCreating && tempAsset) {
      imageStore.addImage({
        uri: tempAsset.uri,
        title: editTitle.trim(),
        description: editDesc.trim(),
        metadata: {
          width: tempAsset.width,
          height: tempAsset.height,
          fileSize: tempAsset.fileSize,
          fileName: tempAsset.fileName,
          type: tempAsset.type,
        }
      });
    } else if (selectedImage) {
      imageStore.updateImage(selectedImage._id, {
        title: editTitle.trim(),
        description: editDesc.trim(),
      });
    }

    setDetailModalOpen(false);
    setIsCreating(false);
    setTempAsset(null);
    setSelectedImage(null);
  };

  const handleDelete = (image) => {
    if (window.confirm(`Are you sure you want to delete photo "${image.title}"?`)) {
      imageStore.deleteImage(image._id);
      setDetailModalOpen(false);
      setSelectedImage(null);
    }
  };

  const renderMetadata = () => {
    let meta = {};
    let timestamp = new Date();

    if (isCreating && tempAsset) {
      meta = {
        fileName: tempAsset.fileName,
        width: tempAsset.width,
        height: tempAsset.height,
        fileSize: tempAsset.fileSize,
        type: tempAsset.type,
      };
    } else if (selectedImage) {
      timestamp = selectedImage.timestamp;
      try {
        meta = typeof selectedImage.metadata === 'string' ? JSON.parse(selectedImage.metadata) : selectedImage.metadata || {};
      } catch (e) {
        meta = {};
      }
    } else {
      return null;
    }

    const items = [
      { label: 'File Name', value: meta.fileName || 'Unknown' },
      { label: 'Dimensions', value: meta.width && meta.height ? `${meta.width} × ${meta.height} px` : 'N/A' },
      { label: 'File Size', value: meta.fileSize ? `${(meta.fileSize / 1024 / 1024).toFixed(2)} MB` : 'N/A' },
      { label: 'Format Type', value: meta.type || 'image/jpeg' },
      { label: 'Capture Date', value: new Date(timestamp).toLocaleString() },
    ];

    return (
      <div className="metadata-container">
        <h4 className="metadata-title">Technical Metadata</h4>
        {items.map((item, index) => (
          <div key={index} className="metadata-item">
            <span className="metadata-label">{item.label}</span>
            <span className="metadata-value" title={item.value}>{item.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="page gallery-page">
      {/* Hidden file selectors */}
      <input
        type="file"
        accept="image/*"
        ref={galleryInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={cameraInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Screen Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ display: 'none' }}>Visual Vault</h1> {/* Managed by dashboard Header */}
          <span className="page-subtitle" style={{ marginTop: '0px' }}>
            {imageStore.images.length} images stored in-memory
          </span>
        </div>
        <button className="btn-primary" onClick={() => setPickerOpen(true)}>
          <Plus size={16} style={{ marginRight: '6px' }} />
          Add Photo
        </button>
      </div>

      {/* View Mode controls */}
      <div className="filter-row" style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 16px 14px' }}>
        <div className="layout-toggle">
          <button 
            className={`toggle-btn ${imageStore.viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => imageStore.setViewMode('grid')}
            title="Grid view"
          >
            <Grid size={18} />
          </button>
          <button 
            className={`toggle-btn ${imageStore.viewMode === 'list' ? 'active' : ''}`}
            onClick={() => imageStore.setViewMode('list')}
            title="List view"
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Visual Vault List */}
      <div className="list-container">
        {imageStore.sortedImages.length > 0 ? (
          <div className={imageStore.viewMode === 'grid' ? 'gallery-grid' : 'gallery-list'}>
            {imageStore.sortedImages.map(img => (
              <ImageCard
                key={img._id}
                image={img}
                viewMode={imageStore.viewMode}
                onPress={handleOpenDetails}
                onEdit={handleOpenDetails}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-icon" role="img" aria-label="camera">📸</span>
            <h3 className="empty-title">Your Vault is empty</h3>
            <p className="empty-hint">Click "Add Photo" to select or snap an image to view in-memory.</p>
          </div>
        )}
      </div>

      {/* Picker dialog bottom-sheet */}
      {pickerOpen && (
        <div className="modal-overlay" onClick={() => setPickerOpen(false)}>
          <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="bottom-sheet-indicator" />
            <h3 className="bottom-sheet-title">Add New Image</h3>
            <p className="bottom-sheet-desc">Choose an action below to load an image into current session</p>

            <button 
              className="picker-option-btn" 
              onClick={() => cameraInputRef.current?.click()}
            >
              <div className="icon-bg bg-blue">
                <Camera size={20} color="#4F46E5" />
              </div>
              <div className="picker-option-text">
                <span className="title">Simulate Camera Capture</span>
                <span className="desc">Taps browser camera or mock selector</span>
              </div>
            </button>

            <button 
              className="picker-option-btn" 
              onClick={() => galleryInputRef.current?.click()}
            >
              <div className="icon-bg bg-green">
                <ImageIcon size={20} color="#10B981" />
              </div>
              <div className="picker-option-text">
                <span className="title">Select local File</span>
                <span className="desc">Import an existing image from file systems</span>
              </div>
            </button>

            <button className="picker-cancel-btn" onClick={() => setPickerOpen(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Details editor dialog */}
      {detailModalOpen && (
        <div className="modal-overlay" onClick={() => {
          setDetailModalOpen(false);
          setIsCreating(false);
          setTempAsset(null);
          setSelectedImage(null);
        }}>
          <div className="fullscreen-modal" style={{ maxHeight: '85vh', borderRadius: '24px 24px 0 0' }} onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="modal-header">
              <button 
                className="modal-header-btn close"
                onClick={() => {
                  setDetailModalOpen(false);
                  setIsCreating(false);
                  setTempAsset(null);
                  setSelectedImage(null);
                }}
              >
                <X size={20} />
              </button>
              <h3 className="modal-header-title">
                {isCreating ? 'Save Photo Details' : 'Image Properties'}
              </h3>
              {!isCreating ? (
                <button 
                  className="modal-header-btn delete"
                  onClick={() => handleDelete(selectedImage)}
                  title="Delete image"
                >
                  <Trash2 size={18} color="#EF4444" />
                </button>
              ) : (
                <div style={{ width: '40px' }} />
              )}
            </div>

            {/* Modal Contents */}
            <div className="modal-scroll-content">
              <div className="image-preview-wrapper">
                <img 
                  src={selectedImage ? selectedImage.uri : tempAsset?.uri} 
                  alt="Preview" 
                  className="image-preview"
                />
              </div>

              <div className="form-wrapper">
                <h4 className="form-section-title">
                  {isCreating ? 'Photo Parameters' : 'Edit Labels'}
                </h4>
                
                <div className="input-group">
                  <label className="input-label">Title</label>
                  <input
                    type="text"
                    className="input-field"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Enter photo title..."
                    autoFocus
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Description</label>
                  <textarea
                    className="input-field textarea-field"
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    placeholder="Write details or description..."
                    rows={3}
                  />
                </div>
              </div>

              {renderMetadata()}
            </div>

            {/* Modal Action Controls */}
            <div className="modal-footer" style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
              <button 
                className="btn-secondary" 
                onClick={() => {
                  setDetailModalOpen(false);
                  setIsCreating(false);
                  setTempAsset(null);
                  setSelectedImage(null);
                }}
              >
                Discard
              </button>
              <button className="btn-primary" onClick={handleSave}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default Gallery;
