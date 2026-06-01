import Realm, { BSON } from 'realm';

export class PdfSchema extends Realm.Object {
  static schema = {
    name: 'Pdf',
    primaryKey: '_id',
    properties: {
      _id:       { type: 'objectId', default: () => new BSON.ObjectId() },
      name:      { type: 'string' },
      uri:       { type: 'string' },
      fileSize:  { type: 'int', default: 0 },
      createdAt: { type: 'date', default: () => new Date() },
      updatedAt: { type: 'date', default: () => new Date() },
    },
  };
}
