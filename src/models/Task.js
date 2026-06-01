
import Realm, { BSON } from 'realm';
 
export class Task extends Realm.Object {
  static schema = {
    name: 'Task',
    primaryKey: '_id',
    properties: {
      _id:         { type: 'objectId', default: () => new BSON.ObjectId() },
      title:       { type: 'string' },
      description: { type: 'string', default: '' },
      priority:    { type: 'string', default: 'medium' }, // low , medium , high
      status:      { type: 'string', default: 'todo' },   // todo ,inprogress , done
      synced:      { type: 'bool',   default: false },     // synced to server?
      isDeleted:   { type: 'bool',   default: false },     // soft delete for sync
      createdAt:   { type: 'date',   default: () => new Date() },
      updatedAt:   { type: 'date',   default: () => new Date() },
    },
  };
}
 