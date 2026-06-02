import { createRealmContext } from '@realm/react';
import { Task }    from '../models/Task';
import { SyncLog } from '../models/SyncLog';
import { ImageSchema } from '../models/ImageSchema';
import { PdfSchema } from '../models/PdfSchema';

const realmConfig = {
  schema: [Task, SyncLog, ImageSchema, PdfSchema],
  schemaVersion: 3,
};

export const { RealmProvider, useRealm, useObject, useQuery } = createRealmContext(realmConfig);