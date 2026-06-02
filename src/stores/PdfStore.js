import { makeAutoObservable } from 'mobx';
<<<<<<< HEAD
import { generateId } from '../utils/helpers';
=======
import { PdfSchema } from '../models/PdfSchema';
>>>>>>> 1a36b0601fcf0b61e09b128dc33adc1e75506d4e

class PdfStore {
  pdfs = [];

  constructor() {
    makeAutoObservable(this);
<<<<<<< HEAD
    this.loadMockPdfs();
  }

  loadMockPdfs() {
    this.pdfs = [
      {
        _id: generateId(),
        name: 'site_safety_protocol_2026.pdf',
        uri: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', // Standard public test PDF
        fileSize: 45602,
        createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 3).toISOString()
      },
      {
        _id: generateId(),
        name: 'structural_steel_blueprints_v2.pdf',
        uri: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileSize: 1248035,
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 48).toISOString()
      }
    ];
  }

  get sortedPdfs() {
    return [...this.pdfs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  addPdf({ name, uri, fileSize = 0 }) {
    if (!name || !uri) return null;
    const newPdf = {
      _id: generateId(),
      name: name.trim(),
      uri: uri.trim(),
      fileSize,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.pdfs.unshift(newPdf);
    return newPdf;
  }

  deletePdf(pdfId) {
    this.pdfs = this.pdfs.filter(p => p._id !== pdfId);
=======
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
>>>>>>> 1a36b0601fcf0b61e09b128dc33adc1e75506d4e
  }
}

export const pdfStore = new PdfStore();
<<<<<<< HEAD
export default pdfStore;
=======
>>>>>>> 1a36b0601fcf0b61e09b128dc33adc1e75506d4e
