import { isErrorWithCode, errorCodes } from '@react-native-documents/picker';

// Check if picker error is a cancel action
export const isCancel = (err) => {
  return isErrorWithCode(err) && err.code === errorCodes.OPERATION_CANCELED;
};

// Format file sizes
export const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
