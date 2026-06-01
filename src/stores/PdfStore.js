import { makeAutoObservable } from 'mobx';
import { PdfSchema } from '../models/PdfSchema';

class PdfStore {
  pdfs = [];

  constructor() {
    makeAutoObservable(this);
  }

  syncFromRealm(realmPdfs) {
    this.pdfs = Array.from(realmPdfs).map(p => ({
      _id: typeof p._id === 'string' ? p._id : p._id.toHexString(),
      name: p.name || 'Untitled Document',
      uri: p.uri || '',
      fileSize: p.fileSize || 0,
      createdAt: p.createdAt,
    }));
  }

  get sortedPdfs() {
    return [...this.pdfs].sort((a, b) => b.createdAt - a.createdAt);
  }

  addPdf(realm, { name, uri, fileSize = 0 }) {
    if (!name || !uri) return null;
    let newPdf;
    realm.write(() => {
      newPdf = realm.create(PdfSchema, {
        name: name.trim(),
        uri: uri.trim(),
        fileSize,
        createdAt: new Date(),
      });
    });
    return newPdf;
  }

  deletePdf(realm, pdfId) {
    const pdfToDelete = realm.objects(PdfSchema).find(p => p._id.toHexString() === pdfId);
    if (!pdfToDelete) return;

    realm.write(() => {
      realm.delete(pdfToDelete);
    });
  }
}

export const pdfStore = new PdfStore();
