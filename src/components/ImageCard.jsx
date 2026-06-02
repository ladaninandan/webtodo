import React from 'react';
import { observer } from 'mobx-react-lite';
import { Pencil, Trash2, Maximize2, FileText } from 'lucide-react';
import { formatDate } from '../utils/helpers';

export const ImageCard = observer(({ image, viewMode = 'grid', onPress, onEdit, onDelete }) => {
  // Parse metadata
  let parsedMetadata = {};
  try {
    parsedMetadata = typeof image.metadata === 'string' ? JSON.parse(image.metadata) : image.metadata || {};
  } catch (e) {
    parsedMetadata = {};
  }

  const dimensionText = parsedMetadata.width && parsedMetadata.height
    ? `${parsedMetadata.width} × ${parsedMetadata.height}`
    : '';

  const sizeText = parsedMetadata.fileSize
    ? `${(parsedMetadata.fileSize / 1024 / 1024).toFixed(2)} MB`
    : '';

  if (viewMode === 'grid') {
    return (
      <div className="grid-card" onClick={() => onPress(image)}>
        <img 
          src={image.uri} 
          alt={image.title} 
          className="grid-image"
          loading="lazy"
        />
        
        {/* Title Overlay */}
        <div className="grid-overlay" onClick={(e) => e.stopPropagation()}>
          <div className="grid-overlay-content" onClick={() => onPress(image)}>
            <h4 className="grid-title">{image.title}</h4>
            <span className="grid-date">{formatDate(image.timestamp)}</span>
          </div>

          <div className="grid-actions">
            <button 
              onClick={() => onEdit(image)} 
              className="grid-action-btn"
              title="Edit details"
            >
              <Pencil size={12} color="#FFF" />
            </button>
            <button 
              onClick={() => onDelete(image)} 
              className="grid-action-btn grid-delete-btn"
              title="Delete photo"
            >
              <Trash2 size={12} color="#FF9494" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="list-card" onClick={() => onPress(image)}>
      <img 
        src={image.uri} 
        alt={image.title} 
        className="list-image"
        loading="lazy"
      />

      <div className="list-content" onClick={(e) => e.stopPropagation()}>
        <div className="list-header-row" onClick={() => onPress(image)} style={{ cursor: 'pointer' }}>
          <h4 className="list-title">{image.title}</h4>
          <span className="list-date">{formatDate(image.timestamp)}</span>
        </div>

        {image.description && (
          <p className="list-desc" onClick={() => onPress(image)} style={{ cursor: 'pointer' }}>
            {image.description}
          </p>
        )}

        {/* Metadata badges */}
        {(dimensionText || sizeText) && (
          <div className="meta-badges-row">
            {dimensionText && (
              <span className="meta-badge" title={dimensionText}>
                <Maximize2 size={10} style={{ marginRight: '4px' }} />
                {dimensionText}
              </span>
            )}
            {sizeText && (
              <span className="meta-badge" title={sizeText}>
                <FileText size={10} style={{ marginRight: '4px' }} />
                {sizeText}
              </span>
            )}
          </div>
        )}

        {/* Actions bottom row */}
        <div className="list-action-row">
          <button 
            onClick={() => onEdit(image)} 
            className="list-btn list-edit-btn"
          >
            <Pencil size={12} />
            <span>Edit</span>
          </button>
          <button 
            onClick={() => onDelete(image)} 
            className="list-btn list-delete-btn"
          >
            <Trash2 size={12} />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
});

export default ImageCard;
