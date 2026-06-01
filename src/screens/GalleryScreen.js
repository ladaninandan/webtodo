import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Image,
  ScrollView,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import Icon from 'react-native-vector-icons/Ionicons';
import { observer } from 'mobx-react-lite';

import {
  handleCapture,
  handlePickFromGallery,
  handleDeleteImage,
  executeSaveCapturedAsset,
  executeOpenDetails,
  executeSaveDetails,
} from '../utils/imageUtils';
import { useImages } from '../hooks/useImages';
import { imageStore } from '../stores/ImageStore';
import ImageCard from '../components/ImageCard';

const GalleryScreen = observer(() => {
  const { addImage, updateImage, deleteImage } = useImages();

  // Local state
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [pickerModalVisible, setPickerModalVisible] = useState(false);

  // Edit/Detail Modal State
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');

  // Unsaved Creation State
  const [isCreating, setIsCreating] = useState(false);
  const [tempAsset, setTempAsset] = useState(null);

  const filteredImages = imageStore.sortedImages;

  const onCapture = () => handleCapture(setPickerModalVisible, saveCapturedAsset);
  const onPickFromGallery = () => handlePickFromGallery(setPickerModalVisible, saveCapturedAsset);

  // Save the picker/camera asset to Realm and open edit screen immediately
  const saveCapturedAsset = (asset) => {
    executeSaveCapturedAsset(
      asset,
      setIsCreating,
      setTempAsset,
      setEditTitle,
      setEditDesc,
      setSelectedImage,
      setDetailModalVisible
    );
  };

  // Open Details Modal
  const handleOpenDetails = (image) => {
    executeOpenDetails(
      image,
      setIsCreating,
      setTempAsset,
      setSelectedImage,
      setEditTitle,
      setEditDesc,
      setDetailModalVisible
    );
  };

  // Save updates to title/description
  const handleSaveDetails = () => {
    executeSaveDetails(
      editTitle,
      editDesc,
      isCreating,
      tempAsset,
      selectedImage,
      addImage,
      updateImage,
      setDetailModalVisible,
      setIsCreating,
      setTempAsset,
      setSelectedImage
    );
  };

  const onDeleteImage = (image) => {
    handleDeleteImage(
      image,
      deleteImage,
      detailModalVisible,
      setDetailModalVisible,
      setSelectedImage
    );
  };

  // Parse custom metadata fields for display in details
  const renderMetadataList = () => {
    if (!isCreating && !selectedImage) return null;

    let meta = {};
    let timestamp = new Date();

    if (isCreating && tempAsset) {
      meta = {
        fileName: tempAsset.fileName,
        width: tempAsset.width,
        height: tempAsset.height,
        fileSize: tempAsset.fileSize,
        type: tempAsset.type,
      };
    } else if (selectedImage) {
      timestamp = selectedImage.timestamp;
      try {
        meta = typeof selectedImage.metadata === 'string' ? JSON.parse(selectedImage.metadata) : selectedImage.metadata || {};
      } catch (e) {
        meta = {};
      }
    }

    const items = [
      { label: 'File Name', value: meta.fileName || 'Unknown' },
      { label: 'Dimensions', value: meta.width && meta.height ? `${meta.width} × ${meta.height} px` : 'N/A' },
      { label: 'File Size', value: meta.fileSize ? `${(meta.fileSize / 1024 / 1024).toFixed(2)} MB` : 'N/A' },
      { label: 'Format Type', value: meta.type || 'image/jpeg' },
      { label: 'Capture Date', value: new Date(timestamp).toLocaleString() },
    ];

    return (
      <View style={styles.metaContainer}>
        <Text style={styles.metaTitleSection}>Technical Metadata</Text>
        {items.map((item, index) => (
          <View key={index} style={styles.metaItem}>
            <Text style={styles.metaLabel}>{item.label}</Text>
            <Text style={styles.metaValue} numberOfLines={1}>{item.value}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Visual Vault</Text>
          <Text style={styles.subtitle}>{imageStore.images.length} images stored locally</Text>
        </View>
        <TouchableOpacity
          style={styles.captureBtn}
          onPress={() => setPickerModalVisible(true)}>
          <Icon name="camera" size={18} color="#FFF" style={styles.captureBtnIcon} />
          <Text style={styles.captureBtnText}>Add Photo</Text>
        </TouchableOpacity>
      </View>

      {/* Layout toggles */}
      <View style={styles.filterRow}>
        <View style={styles.layoutToggle}>
          <TouchableOpacity
            style={[styles.toggleBtn, viewMode === 'grid' && styles.toggleBtnActive]}
            onPress={() => setViewMode('grid')}>
            <Icon name="grid-outline" size={18} color={viewMode === 'grid' ? '#FFF' : '#64748B'} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, viewMode === 'list' && styles.toggleBtnActive]}
            onPress={() => setViewMode('list')}>
            <Icon name="list-outline" size={18} color={viewMode === 'list' ? '#FFF' : '#64748B'} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main FlashList View */}
      <View style={styles.listContainer}>
        <FlashList
          data={filteredImages}
          key={viewMode} // Force re-render grid/list layout completely on change
          numColumns={viewMode === 'grid' ? 2 : 1}
          keyExtractor={item => item._id}
          estimatedItemSize={viewMode === 'grid' ? 200 : 120}
          contentContainerStyle={styles.listContentStyle}
          renderItem={({ item }) => (
            <ImageCard
              image={item}
              viewMode={viewMode}
              onPress={handleOpenDetails}
              onEdit={handleOpenDetails}
              onDelete={onDeleteImage}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>📸</Text>
              <Text style={styles.emptyText}>Your Vault is empty</Text>
              <Text style={styles.emptySub}>
                Tap "Add Photo" to capture or choose a photo to store in Realm.
              </Text>
            </View>
          }
        />
      </View>

      {/* Add Photo Picker Selection Bottom Modal */}
      <Modal
        visible={pickerModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setPickerModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setPickerModalVisible(false)}>
          <View style={styles.pickerModalContent}>
            <View style={styles.pickerIndicator} />
            <Text style={styles.pickerTitle}>Add New Image</Text>
            <Text style={styles.pickerDesc}>Select an option below to import an image into Realm Database</Text>

            <TouchableOpacity style={styles.pickerOption} onPress={onCapture}>
              <View style={styles.pickerIconBgBlue}>
                <Icon name="camera-outline" size={22} color="#4F46E5" />
              </View>
              <View style={styles.pickerOptionTexts}>
                <Text style={styles.pickerOptionTitle}>Capture Image</Text>
                <Text style={styles.pickerOptionSub}>Use the device camera to snap a photo</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.pickerOption} onPress={onPickFromGallery}>
              <View style={styles.pickerIconBgGreen}>
                <Icon name="images-outline" size={22} color="#10B981" />
              </View>
              <View style={styles.pickerOptionTexts}>
                <Text style={styles.pickerOptionTitle}>Choose from Gallery</Text>
                <Text style={styles.pickerOptionSub}>Select an existing image from photo library</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.pickerCancelBtn}
              onPress={() => setPickerModalVisible(false)}>
              <Text style={styles.pickerCancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Detail / Edit Form Modal */}
      <Modal
        visible={detailModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setDetailModalVisible(false);
          setIsCreating(false);
          setTempAsset(null);
          setSelectedImage(null);
        }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}>
          <SafeAreaView style={styles.detailContainer} edges={['top', 'bottom']}>
            {/* Modal Header */}
            <View style={styles.detailHeader}>
              <TouchableOpacity
                style={styles.detailHeaderBtn}
                onPress={() => {
                  setDetailModalVisible(false);
                  setIsCreating(false);
                  setTempAsset(null);
                  setSelectedImage(null);
                }}>
                <Icon name="close" size={24} color="#0F172A" />
              </TouchableOpacity>
              <Text style={styles.detailHeaderTitle}>
                {isCreating ? 'Save New Photo' : 'Image Details'}
              </Text>
              {!isCreating ? (
                <TouchableOpacity
                  style={[styles.detailHeaderBtn, styles.detailHeaderDelete]}
                  onPress={() => onDeleteImage(selectedImage)}>
                  <Icon name="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
              ) : (
                <View style={styles.spacer40} /> // Spacer to keep title centered
              )}
            </View>

            {(selectedImage || tempAsset) && (
              <ScrollView
                style={styles.detailScrollView}
                contentContainerStyle={styles.detailScrollContent}
                keyboardShouldPersistTaps="handled">
                {/* Beautiful Full Screen Style Image Preview */}
                <View style={styles.detailImageWrapper}>
                  <Image
                    source={{ uri: selectedImage ? selectedImage.uri : tempAsset.uri }}
                    style={styles.detailImage}
                    resizeMode="contain"
                  />
                </View>

                {/* Form fields */}
                <View style={styles.formContainer}>
                  <Text style={styles.formSectionTitle}>
                    {isCreating ? 'Add Photo Details' : 'Edit Details'}
                  </Text>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Title</Text>
                    <TextInput
                      style={styles.inputField}
                      value={editTitle}
                      onChangeText={setEditTitle}
                      placeholder="Enter photo title..."
                      placeholderTextColor="#94A3B8"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Description</Text>
                    <TextInput
                      style={[styles.inputField, styles.textAreaField]}
                      value={editDesc}
                      onChangeText={setEditDesc}
                      placeholder="Write details or description..."
                      placeholderTextColor="#94A3B8"
                      multiline={true}
                      numberOfLines={4}
                      textAlignVertical="top"
                    />
                  </View>
                </View>

                {/* Technical details list */}
                {renderMetadataList()}
              </ScrollView>
            )}

            {/* Bottom Actions Bar */}
            <View style={styles.detailFooter}>
              <TouchableOpacity
                style={styles.detailCancelBtn}
                onPress={() => {
                  setDetailModalVisible(false);
                  setIsCreating(false);
                  setTempAsset(null);
                  setSelectedImage(null);
                }}>
                <Text style={styles.detailCancelBtnText}>Discard</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.detailSaveBtn}
                onPress={handleSaveDetails}>
                <Text style={styles.detailSaveBtnText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
});

export default GalleryScreen;

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
  captureBtn: {
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
  captureBtnIcon: {
    marginRight: 6,
  },
  captureBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 14,
    gap: 12,
    alignItems: 'center',
  },
  layoutToggle: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    padding: 3,
  },
  toggleBtn: {
    width: 38,
    height: 38,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleBtnActive: {
    backgroundColor: '#6366F1',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 12,
  },
  listContentStyle: {
    paddingBottom: 32,
    paddingHorizontal: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 32,
  },
  emptyEmoji: {
    fontSize: 52,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },

  // Modal Picker styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'flex-end',
  },
  pickerModalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 42 : 24,
  },
  pickerIndicator: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
    alignSelf: 'center',
    marginBottom: 16,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
  },
  pickerDesc: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 20,
  },
  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F1F5F9',
  },
  pickerIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  pickerIconBgBlue: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    backgroundColor: '#EEF2FF',
  },
  pickerIconBgGreen: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    backgroundColor: '#ECFDF5',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  pickerOptionTexts: {
    flex: 1,
  },
  pickerOptionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },
  pickerOptionSub: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  pickerCancelBtn: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 18,
  },
  pickerCancelBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
  },

  // Detail Modal styling
  detailContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  detailHeader: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFF',
  },
  detailHeaderBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  detailHeaderDelete: {
    backgroundColor: '#FEE2E2',
  },
  detailScrollView: {
    flex: 1,
  },
  detailScrollContent: {
    paddingBottom: 24,
  },
  detailImageWrapper: {
    width: '100%',
    height: 250,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailImage: {
    width: '100%',
    height: '100%',
  },
  formContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    marginTop: 12,
    borderRadius: 16,
    marginHorizontal: 16,
    shadowColor: '#0F172A',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  formSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 6,
  },
  inputField: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 46,
    fontSize: 14.5,
    color: '#0F172A',
  },
  textAreaField: {
    height: 100,
    paddingVertical: 12,
    textAlignVertical: 'top',
  },
  metaContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    marginTop: 12,
    borderRadius: 16,
    marginHorizontal: 16,
    shadowColor: '#0F172A',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  metaTitleSection: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 14,
  },
  metaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F1F5F9',
  },
  metaLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  metaValue: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '600',
    maxWidth: '60%',
  },
  detailFooter: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#FFF',
  },
  detailCancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailCancelBtnText: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#64748B',
  },
  detailSaveBtn: {
    flex: 2,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  detailSaveBtnText: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#FFF',
  },
  spacer40: {
    width: 40,
  },
});
