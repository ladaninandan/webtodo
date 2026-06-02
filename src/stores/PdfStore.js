import { makeAutoObservable } from 'mobx';
import { generateId } from '../utils/helpers';

class PdfStore {
  pdfs = [];

  constructor() {
    makeAutoObservable(this);
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
  }
}

export const pdfStore = new PdfStore();
export default pdfStore;
