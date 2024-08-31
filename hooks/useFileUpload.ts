import { useUploadThing } from '@/lib/uploadthing';
import useToast from '@/hooks/useToast';

const useFileUpload = () => {
  const addToast = useToast();

  const { startUpload } = useUploadThing('imageUploader', {
    onClientUploadComplete: () => {
      addToast({ message: 'File uploaded successfully', type: 'success' });
    },
    onUploadError: () => {
      addToast({ message: 'Error uploading file', type: 'error' });
    },
  });

  const uploadFile = async (file: File) => {
    try {
      const response = await startUpload([file]);
      return response;
    } catch (error) {
      addToast({ message: 'Error uploading file', type: 'error' });
      console.error('Upload failed:', error);
      throw error;
    }
  };

  return { uploadFile };
};

export default useFileUpload;
