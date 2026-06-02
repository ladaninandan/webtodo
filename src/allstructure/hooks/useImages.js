import { useEffect } from 'react';
import { useRealm, useQuery } from '../database';
import { ImageSchema } from '../models/ImageSchema';
import { imageStore } from '../stores/ImageStore';

export function useImages() {
  const realm = useRealm();
  const realmImages = useQuery(ImageSchema);

  // Sync Realm changes to MobX store automatically on any collection changes
  useEffect(() => {
    imageStore.syncFromRealm(realmImages);
  }, [realmImages]);

  return {
    addImage: (image) => imageStore.addImage(realm, image),
    updateImage: (id, changes) => imageStore.updateImage(realm, id, changes),
    deleteImage: (id) => imageStore.deleteImage(realm, id),
  };
}
