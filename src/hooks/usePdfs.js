import { useEffect } from 'react';
import { useRealm, useQuery } from '../database';
import { PdfSchema } from '../models/PdfSchema';
import { pdfStore } from '../stores/PdfStore';

export function usePdfs() {
  const realm = useRealm();
  const realmPdfs = useQuery(PdfSchema);

  // Sync Realm changes to MobX store automatically on any collection changes
  useEffect(() => {
    pdfStore.syncFromRealm(realmPdfs);
  }, [realmPdfs]);

  return {
    addPdf: (pdf) => pdfStore.addPdf(realm, pdf),
    deletePdf: (id) => pdfStore.deletePdf(realm, id),
  };
}
