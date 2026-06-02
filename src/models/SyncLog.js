
import Realm, { BSON } from 'realm';

export class SyncLog extends Realm.Object {
  static schema = {
    name: 'SyncLog',
    primaryKey: '_id',
    properties: {
      _id:       { type: 'objectId', default: () => new BSON.ObjectId() },
      action:    { type: 'string' },   // create ,update , delete
      modelName: { type: 'string' },   // Task ...
      recordId:  { type: 'string' },   // hex string of the record's _id
      payload:   { type: 'string' },   // json stringified data
      retries:   { type: 'int',    default: 0 },
      createdAt: { type: 'date',   default: () => new Date() },
    },
  };
}