import Realm, { BSON } from 'realm';

export class ImageSchema extends Realm.Object {
  static schema = {
    name: 'Image',
    primaryKey: '_id',
    properties: {
      _id:         { type: 'objectId', default: () => new BSON.ObjectId() },
      uri:         { type: 'string' },
      title:       { type: 'string' },
      description: { type: 'string', default: '' },
      timestamp:   { type: 'date',   default: () => new Date() },
      metadata:    { type: 'string', default: '{}' }, // Store JSON metadata like width, height, etc.
      createdAt:   { type: 'date',   default: () => new Date() },
      updatedAt:   { type: 'date',   default: () => new Date() },
    },
  };
}