import { makeAutoObservable } from 'mobx';
<<<<<<< HEAD
import { generateId } from '../utils/helpers';

class ImageStore {
  images = [];
  viewMode = 'grid'; // 'grid' | 'list'

  constructor() {
    makeAutoObservable(this);
    this.loadMockImages();
  }

  loadMockImages() {
    // Beautiful default mockup images from Unsplash
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
=======
import { ImageSchema } from '../models/ImageSchema';

class ImageStore {
  images = [];

  constructor() {
    makeAutoObservable(this);
  }

  syncFromRealm(realmImages) {
    this.images = Array.from(realmImages).map(img => ({
      _id: typeof img._id === 'string' ? img._id : img._id.toHexString(),
      uri: img.uri,
      title: img.title || 'Untitled Photo',
      description: img.description || '',
      timestamp: img.timestamp,
      metadata: img.metadata || '{}',
      createdAt: img.createdAt,
      updatedAt: img.updatedAt,
    }));
  }

  get sortedImages() {
    return [...this.images].sort((a, b) => b.createdAt - a.createdAt);
  }

  addImage(realm, { uri, title, description = '', metadata = '{}' }) {
    if (!uri) return null;
    let newImg;
    realm.write(() => {
      newImg = realm.create(ImageSchema, {
        uri,
        title: title?.trim() || 'Untitled Photo',
        description: description?.trim() || '',
        timestamp: new Date(),
        metadata: typeof metadata === 'object' ? JSON.stringify(metadata) : metadata,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });
    return newImg;
  }

  updateImage(realm, imageId, changes) {
    const imgToUpdate = realm.objects(ImageSchema).find(img => img._id.toHexString() === imageId);
    if (!imgToUpdate) return;

    realm.write(() => {
      if (changes.title !== undefined) {
        imgToUpdate.title = changes.title.trim() || 'Untitled Photo';
      }
      if (changes.description !== undefined) {
        imgToUpdate.description = changes.description.trim();
      }
      if (changes.metadata !== undefined) {
        imgToUpdate.metadata = typeof changes.metadata === 'object' ? JSON.stringify(changes.metadata) : changes.metadata;
      }
      imgToUpdate.updatedAt = new Date();
    });
  }

  deleteImage(realm, imageId) {
    const imgToDelete = realm.objects(ImageSchema).find(img => img._id.toHexString() === imageId);
    if (!imgToDelete) return;

    realm.write(() => {
      realm.delete(imgToDelete);
    });
>>>>>>> 1a36b0601fcf0b61e09b128dc33adc1e75506d4e
  }
}

export const imageStore = new ImageStore();
<<<<<<< HEAD
export default imageStore;
=======
>>>>>>> 1a36b0601fcf0b61e09b128dc33adc1e75506d4e
