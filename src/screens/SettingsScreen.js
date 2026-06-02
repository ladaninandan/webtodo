import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import Icon from 'react-native-vector-icons/Ionicons';
import { observer } from 'mobx-react-lite';

import { formatBytes } from '../utils/fileUtils';
import { handlePickDevicePdf, handleDownloadPdf, handleDeletePdf } from '../utils/pdfUtils';
import { usePdfs } from '../hooks/usePdfs';
import { pdfStore } from '../stores/PdfStore';

const SettingsScreen = observer(() => {
  const { addPdf, deletePdf } = usePdfs();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Screen Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Document Vault</Text>
          <Text style={styles.subtitle}>{pdfStore.pdfs.length} local PDFs stored in Realm</Text>
        </View>
        <TouchableOpacity
          style={styles.uploadBtn}
          onPress={() => handlePickDevicePdf(addPdf)}>
          <Icon name="document-attach" size={18} color="#FFF" style={styles.uploadBtnIcon} />
          <Text style={styles.uploadBtnText}>Upload PDF</Text>
        </TouchableOpacity>
      </View>

      {/* Main List Area */}
      <View style={styles.listContainer}>
        <FlashList
          data={pdfStore.sortedPdfs}
          keyExtractor={item => item._id}
          estimatedItemSize={80}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View
              style={styles.pdfCard}>
              {/* PDF Icon Badge */}
              <View style={styles.pdfIconBg}>
                <Icon name="document-text" size={24} color="#EF4444" />
              </View>

              {/* PDF Info details */}
              <View style={styles.pdfInfo}>
                <Text style={styles.pdfName} numberOfLines={1}>
                  {item.name}
                </Text>
                <View style={styles.pdfMetaRow}>
                  <Text style={styles.pdfSize}>
                    {formatBytes(item.fileSize)}
                  </Text>
                  <Text style={styles.pdfDivider}>•</Text>
                  <Text style={styles.pdfTime}>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>

              {/* Action Buttons Group */}
              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.downloadCardBtn}
                  onPress={() => handleDownloadPdf(item)}>
                  <Icon name="download-outline" size={18} color="#059669" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteCardBtn}
                  onPress={() => handleDeletePdf(item, deletePdf)}>
                  <Icon name="trash" size={18} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>📁</Text>
              <Text style={styles.emptyTitle}>No Documents Found</Text>
              <Text style={styles.emptySubtitle}>
                Import PDF documents from your device to test robust offline storage.
              </Text>
              <TouchableOpacity
                style={styles.emptyActionBtn}
                onPress={() => handlePickDevicePdf(addPdf)}>
                <Text style={styles.emptyActionBtnText}>Upload Your First PDF</Text>
              </TouchableOpacity>
            </View>
          }
        />
      </View>

    </SafeAreaView>
  );
});

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
    fontWeight: '500',
  },
  uploadBtn: {
    backgroundColor: '#6366F1',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: '#6366F1',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  uploadBtnIcon: {
    marginRight: 6,
  },
  uploadBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 32,
  },
  pdfCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  pdfIconBg: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  pdfInfo: {
    flex: 1,
    marginRight: 8,
  },
  pdfName: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#1E293B',
    letterSpacing: -0.2,
  },
  pdfMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  pdfSize: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '600',
  },
  pdfDivider: {
    fontSize: 11.5,
    color: '#CBD5E1',
    marginHorizontal: 6,
  },
  pdfTime: {
    fontSize: 11.5,
    color: '#94A3B8',
    fontWeight: '500',
  },
  deleteCardBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 32,
  },
  emptyEmoji: {
    fontSize: 56,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
    marginBottom: 20,
  },
  emptyActionBtn: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  emptyActionBtnText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#4F46E5',
  },

  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  downloadCardBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
