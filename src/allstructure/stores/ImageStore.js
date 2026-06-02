import { makeAutoObservable } from 'mobx';
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
  }
}

export const imageStore = new ImageStore();
