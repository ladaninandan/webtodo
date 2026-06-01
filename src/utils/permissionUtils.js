import { Platform, PermissionsAndroid } from 'react-native';

// Request runtime storage permissions on Android 
export const requestStoragePermission = async () => {
  if (Platform.OS !== 'android') return true;
  try {
    // Android 10+ (API 29+) uses Scoped Storage and does not need broad storage permissions
    if (Platform.Version >= 29) {
      return true;
    }

    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    ]);

    return (
      granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED &&
      granted[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED
    );
  } catch (err) {
    console.warn('Storage permission request error:', err);
    return false;
  }
};

// Permissions handling for Camera (Android)
export const requestCameraPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission Required',
          message: 'This app needs access to your camera to take and save pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Android Camera Permission Error:', err);
      return false;
    }
  }
  return true; // iOS permissions are handled via Info.plist automatically
};
