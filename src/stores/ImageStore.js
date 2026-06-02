import { makeAutoObservable } from 'mobx';
import { generateId } from '../utils/helpers';

class ImageStore {
  images = [];
  viewMode = 'grid'; // 'grid' | 'list'

  constructor() {
    makeAutoObservable(this);
    this.loadMockImages();
  }

  loadMockImages() {
    // Unsplash
    this.images = [
      {
        _id: generateId(),
        uri: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
        title: 'Modern Architecture Survey',
        description: 'Site inspection photos showing foundation pillars and structural steel alignments.',
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
        metadata: JSON.stringify({
          fileName: 'foundation_check.jpg',
          width: 1920,
          height: 1280,
          fileSize: 1542032,
          type: 'image/jpeg'
        }),
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 5).toISOString()
      },
      {
        _id: generateId(),
        uri: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800&auto=format&fit=crop',
        title: 'Concrete Quality Assessment',
        description: 'Close up inspection of reinforcing bar installation on concrete slab deck level 2.',
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
        metadata: JSON.stringify({
          fileName: 'slab_reinforcement.jpg',
          width: 2048,
          height: 1536,
          fileSize: 2105432,
          type: 'image/jpeg'
        }),
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 24).toISOString()
      }
    ];
  }

  setViewMode(mode) {
    this.viewMode = mode;
  }

  get sortedImages() {
    return [...this.images].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  addImage({ uri, title, description = '', metadata = {} }) {
    if (!uri) return null;
    const newImg = {
      _id: generateId(),
      uri,
      title: title?.trim() || 'Untitled Photo',
      description: description?.trim() || '',
      timestamp: new Date().toISOString(),
      metadata: typeof metadata === 'object' ? JSON.stringify(metadata) : metadata,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.images.unshift(newImg);
    return newImg;
  }

  updateImage(imageId, changes) {
    const img = this.images.find(i => i._id === imageId);
    if (!img) return;

    if (changes.title !== undefined) {
      img.title = changes.title.trim() || 'Untitled Photo';
    }
    if (changes.description !== undefined) {
      img.description = changes.description.trim();
    }
    if (changes.metadata !== undefined) {
      img.metadata = typeof changes.metadata === 'object' ? JSON.stringify(changes.metadata) : changes.metadata;
    }
    img.updatedAt = new Date().toISOString();
  }

  deleteImage(imageId) {
    this.images = this.images.filter(i => i._id !== imageId);
  }
}

export const imageStore = new ImageStore();
export default imageStore;
