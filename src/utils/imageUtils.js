import { Alert } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { requestCameraPermission } from './permissionUtils';

// Launch Camera
export const handleCapture = async (setPickerModalVisible, saveCapturedAsset) => {
  setPickerModalVisible(false);
  const hasPermission = await requestCameraPermission();
  if (!hasPermission) {
    Alert.alert('Permission Denied', 'Camera permission is required to capture photos.');
    return;
  }

  const options = {
    mediaType: 'photo',
    quality: 0.8,
    saveToPhotos: false,
  };

  setTimeout(() => {
    try {
      launchCamera(options, (response) => {
        if (response.didCancel) {
          console.log('User cancelled camera capture');
        } else if (response.errorCode) {
          console.warn('Camera Error: ', response.errorMessage);
          if (response.errorCode === 'camera_unavailable' || response.errorMessage?.toLowerCase().includes('simulator')) {
            Alert.alert('Camera Unavailable', 'The simulator does not support the camera. Please run on a physical device to capture photos.');
          } else {
            Alert.alert('Capture Error', response.errorMessage || 'Unable to open camera.');
          }
        } else if (response.assets && response.assets.length > 0) {
          saveCapturedAsset(response.assets[0]);
        }
      });
    } catch (error) {
      console.warn('launchCamera native crash caught:', error);
      Alert.alert('Camera Unavailable', 'The simulator does not support the camera. Please run on a physical device to capture photos.');
    }
  }, 400);
};

// Launch Photo Gallery
export const handlePickFromGallery = (setPickerModalVisible, saveCapturedAsset) => {
  setPickerModalVisible(false);
  const options = {
    mediaType: 'photo',
    quality: 0.8,
  };

  setTimeout(() => {
    try {
      launchImageLibrary(options, (response) => {
        if (response.didCancel) {
          console.log('User cancelled image selection');
        } else if (response.errorCode) {
          console.warn('Image Library Error: ', response.errorMessage);
          Alert.alert('Selection Error', response.errorMessage || 'Unable to access gallery.');
        } else if (response.assets && response.assets.length > 0) {
          saveCapturedAsset(response.assets[0]);
        }
      });
    } catch (error) {
      console.warn('launchImageLibrary native crash caught:', error);
      Alert.alert(
        'Bridge Error',
        'Native Image Library bridge could not be loaded.\n\nPlease rebuild the iOS application using Xcode or `npm run ios` to compile the newly linked CocoaPods.'
      );
    }
  }, 400);
};

// Handle image delete
export const handleDeleteImage = (
  image,
  deleteImage,
  detailModalVisible,
  setDetailModalVisible,
  setSelectedImage
) => {
  Alert.alert(
    'Delete Image',
    `Are you sure you want to delete "${image.title}"?\n\nThis will remove it permanently.`,
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          try {
            deleteImage(image._id);
            if (detailModalVisible) {
              setDetailModalVisible(false);
              setSelectedImage(null);
            }
          } catch (error) {
            console.error('Database Delete Error:', error);
            Alert.alert('Delete Error', 'Failed to delete the image from database.');
          }
        },
      },
    ]
  );
};

// Save the picker/camera asset to Realm and open edit screen immediately
export const executeSaveCapturedAsset = (
  asset,
  setIsCreating,
  setTempAsset,
  setEditTitle,
  setEditDesc,
  setSelectedImage,
  setDetailModalVisible
) => {
  const defaultTitle = `Photo ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  setIsCreating(true);
  setTempAsset(asset);
  setEditTitle(defaultTitle);
  setEditDesc('');
  setSelectedImage(null);
  setDetailModalVisible(true);
};

// Open Details Modal
export const executeOpenDetails = (
  image,
  setIsCreating,
  setTempAsset,
  setSelectedImage,
  setEditTitle,
  setEditDesc,
  setDetailModalVisible
) => {
  setIsCreating(false);
  setTempAsset(null);
  setSelectedImage(image);
  setEditTitle(image.title);
  setEditDesc(image.description);
  setDetailModalVisible(true);
};

// Save updates to title/description
export const executeSaveDetails = (
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
) => {
  if (!editTitle.trim()) {
    Alert.alert('Required Field', 'Please provide a title for the image.');
    return;
  }

  try {
    if (isCreating && tempAsset) {
      // Add image to Realm database only on explicit user Save
      const metadataObj = {
        width: tempAsset.width,
        height: tempAsset.height,
        fileSize: tempAsset.fileSize,
        fileName: tempAsset.fileName,
        type: tempAsset.type,
      };
      
      addImage({
        uri: tempAsset.uri,
        title: editTitle,
        description: editDesc,
        metadata: metadataObj,
      });
    } else if (selectedImage) {
      // Update existing image record
      updateImage(selectedImage._id, {
        title: editTitle,
        description: editDesc,
      });
    }

    setDetailModalVisible(false);
    setIsCreating(false);
    setTempAsset(null);
    setSelectedImage(null);
  } catch (error) {
    console.error('Database Write Error:', error);
    Alert.alert('Database Error', 'Failed to save image changes to local database.');
  }
};

