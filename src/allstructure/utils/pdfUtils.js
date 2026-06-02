import { Platform, Alert, Share } from 'react-native';
import { pick, types, saveDocuments, keepLocalCopy } from '@react-native-documents/picker';
import RNFS from 'react-native-fs';
import { isCancel } from './fileUtils';
import { requestStoragePermission } from './permissionUtils';

// Pick PDF file from Device
export const handlePickDevicePdf = async (addPdf) => {
  try {
    if (Platform.OS === 'android') {
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        Alert.alert(
          'Permission Required',
          'Storage permission is required to import documents from your device.'
        );
        return;
      }
    }

    // pic document
    const [res] = await pick({
      type: [types.pdf],
    });

    if (res && res.uri) {
      try {
        const [copyResult] = await keepLocalCopy({
          files: [
            {
              uri: res.uri,
              fileName: res.name ?? 'document.pdf',
            },
          ],
          destination: 'documentDirectory',
        });

        if (copyResult && copyResult.status === 'success' && copyResult.localUri) {
          const newPdf = addPdf({
            name: res.name || 'document.pdf',
            uri: copyResult.localUri,
            fileSize: res.size || 0,
          });

          if (newPdf) {
            Alert.alert('Success', `"${res.name}" successfully imported from your device!`);
          }
        } else {
          console.error('keepLocalCopy returned abnormal status:', copyResult);
          Alert.alert(
            'Import Failed',
            'Could not create a local copy of this document. Please try importing it again.'
          );
        }
      } catch (copyErr) {
        console.error('keepLocalCopy failed:', copyErr);
        Alert.alert(
          'Import Failed',
          'Could not create a local copy of this document. Please try importing it again.'
        );
      }
    }
  } catch (err) {
    if (isCancel(err)) {
      console.log('User cancelled document picker');
    } else {
      console.error('Document Picker Error:', err);
      Alert.alert(
        'Bridge Error',
        'The native Document Picker could not be loaded.\n\nPlease rebuild the application (`npm run ios` or `npm run android`) to compile the newly installed packages.'
      );
    }
  }
};

// Download 
export const handleDownloadPdf = async (pdf) => {
  if (!pdf || !pdf.uri) return;
  try {
    if (Platform.OS === 'ios') {
      const fileExists = await RNFS.exists(pdf.uri);
      if (!fileExists) {
        Alert.alert('Error', 'The source file could not be found in local storage.');
        return;
      }

      await Share.share({
        url: pdf.uri,
        title: pdf.name || 'document.pdf',
      });
    } else {
      const isScopedStorageEnforced = Platform.Version >= 29;

      if (isScopedStorageEnforced) {
        await saveDocuments({
          sourceUris: [pdf.uri],
          mimeType: 'application/pdf',
          fileName: pdf.name || 'document.pdf',
        });
        Alert.alert('Downloaded', `"${pdf.name}" has been successfully exported/saved to your device.`);
      } else {
        const hasPermission = await requestStoragePermission();
        if (!hasPermission) {
          Alert.alert(
            'Permission Required',
            'Storage permission is required to save files to your device.'
          );
          return;
        }

        const destDir = RNFS.DownloadDirectoryPath;
        const destPath = `${destDir}/${pdf.name || 'document.pdf'}`;

        const fileExists = await RNFS.exists(pdf.uri);
        if (!fileExists) {
          Alert.alert('Error', 'The source file could not be found in local storage.');
          return;
        }

        const destExists = await RNFS.exists(destPath);
        if (destExists) {
          await RNFS.unlink(destPath);
        }

        await RNFS.copyFile(pdf.uri, destPath);
        Alert.alert(
          'Downloaded Successfully',
          `"${pdf.name}" has been saved directly to your Downloads folder:\n\n${destPath}`
        );
      }
    }
  } catch (err) {
    if (isCancel(err)) {
      console.log('User cancelled save operation');
      return;
    }

    console.error('Download error:', err);

    if (Platform.OS === 'android') {
      console.log('RNFS direct download failed. Falling back to native Document Picker (saveDocuments)...');
      try {
        await saveDocuments({
          sourceUris: [pdf.uri],
          mimeType: 'application/pdf',
          fileName: pdf.name || 'document.pdf',
        });
        return;
      } catch (fallbackErr) {
        if (isCancel(fallbackErr)) {
          console.log('User cancelled fallback save operation');
          return;
        }
        console.error('Fallback saveDocuments error:', fallbackErr);
      }
    }

    Alert.alert(
      'Export Failed',
      'Could not export the file to your device. Please try again.'
    );
  }
};

// Delete PDF
export const handleDeletePdf = (pdf, deletePdf) => {
  Alert.alert(
    'Delete Document',
    `Are you sure you want to permanently delete "${pdf.name}" from your local storage?`,
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          try {
            deletePdf(pdf._id);
          } catch (e) {
            console.error(e);
            Alert.alert('Error', 'Failed to delete PDF from Realm database.');
          }
        },
      },
    ]
  );
};
