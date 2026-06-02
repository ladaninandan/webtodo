import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');
const GRID_ITEM_WIDTH = (width - 48) / 2; // Two columns, 16px margins, 16px gap

export default function ImageCard({
  image,
  viewMode = 'grid',
  onPress,
  onEdit,
  onDelete,
}) {
  const formattedDate = image.timestamp
    ? new Date(image.timestamp).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  // Parse metadata if available
  let parsedMetadata = {};
  try {
    parsedMetadata = typeof image.metadata === 'string' ? JSON.parse(image.metadata) : image.metadata || {};
  } catch (e) {
    parsedMetadata = {};
  }

  const dimensionText = parsedMetadata.width && parsedMetadata.height
    ? `${parsedMetadata.width} × ${parsedMetadata.height}`
    : '';

  const sizeText = parsedMetadata.fileSize
    ? `${(parsedMetadata.fileSize / 1024 / 1024).toFixed(2)} MB`
    : '';

  if (viewMode === 'grid') {
    return (
      <TouchableOpacity
        style={styles.gridCard}
        activeOpacity={0.9}
        onPress={() => onPress(image)}>
        <Image
          source={{ uri: image.uri }}
          style={styles.gridImage}
          resizeMode="cover"
        />
        
        {/* Glassmorphic/Overlay Title bar */}
        <View style={styles.gridOverlay}>
          <View style={styles.gridOverlayContent}>
            <Text style={styles.gridTitle} numberOfLines={1}>
              {image.title}
            </Text>
            <Text style={styles.gridDate}>
              {formattedDate}
            </Text>
          </View>
          
          <View style={styles.gridActions}>
            <TouchableOpacity
              onPress={() => onEdit(image)}
              style={styles.gridActionBtn}>
              <Icon name="pencil" size={14} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onDelete(image)}
              style={[styles.gridActionBtn, styles.gridDeleteBtn]}>
              <Icon name="trash" size={14} color="#FF9494" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.listCard}
      activeOpacity={0.8}
      onPress={() => onPress(image)}>
      <Image
        source={{ uri: image.uri }}
        style={styles.listImage}
        resizeMode="cover"
      />
      
      <View style={styles.listContent}>
        <View style={styles.listHeaderRow}>
          <Text style={styles.listTitle} numberOfLines={1}>
            {image.title}
          </Text>
          <Text style={styles.listDate}>
            {formattedDate}
          </Text>
        </View>

        {!!image.description && (
          <Text style={styles.listDesc} numberOfLines={2}>
            {image.description}
          </Text>
        )}

        {/* Metadata info */}
        {(!!dimensionText || !!sizeText) && (
          <View style={styles.metaRow}>
            {!!dimensionText && (
              <View style={styles.metaBadge}>
                <Icon name="resize-outline" size={10} color="#64748B" />
                <Text style={styles.metaBadgeText}>{dimensionText}</Text>
              </View>
            )}
            {!!sizeText && (
              <View style={styles.metaBadge}>
                <Icon name="document-outline" size={10} color="#64748B" />
                <Text style={styles.metaBadgeText}>{sizeText}</Text>
              </View>
            )}
          </View>
        )}

        {/* Action Row */}
        <View style={styles.listActionRow}>
          <TouchableOpacity
            style={[styles.listBtn, styles.editBtn]}
            onPress={() => onEdit(image)}>
            <Icon name="pencil-outline" size={13} color="#4F46E5" />
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.listBtn, styles.deleteBtn]}
            onPress={() => onDelete(image)}>
            <Icon name="trash-outline" size={13} color="#EF4444" />
            <Text style={styles.deleteBtnText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Grid Styles
  gridCard: {
    width: GRID_ITEM_WIDTH,
    height: GRID_ITEM_WIDTH * 1.1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFF',
    marginBottom: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  gridOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.75)', // Elegant slate-dark glass overlay
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
  },
  gridOverlayContent: {
    flex: 1,
    marginRight: 6,
  },
  gridTitle: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  gridDate: {
    color: '#CBD5E1',
    fontSize: 10,
    marginTop: 2,
  },
  gridActions: {
    flexDirection: 'row',
    gap: 6,
  },
  gridActionBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridDeleteBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },

  // List Styles
  listCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  listImage: {
    width: 105,
    height: '100%',
    minHeight: 120,
  },
  listContent: {
    flex: 1,
    padding: 14,
    justifyContent: 'space-between',
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  listTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    letterSpacing: -0.3,
  },
  listDate: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  listDesc: {
    fontSize: 12.5,
    color: '#475569',
    marginTop: 4,
    lineHeight: 17,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
    flexWrap: 'wrap',
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
    borderWidth: 0.5,
    borderColor: '#E2E8F0',
  },
  metaBadgeText: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '500',
  },
  listActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 12,
  },
  listBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  editBtn: {
    backgroundColor: '#EEF2FF',
  },
  editBtnText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#4F46E5',
  },
  deleteBtn: {
    backgroundColor: '#FEE2E2',
  },
  deleteBtnText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#EF4444',
  },
});
