import { useState } from 'react';
import {
  Box,
  Button,
  Input,
  Progress,
  Text,
  useToast,
} from '@chakra-ui/react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../config/firebase';

interface FileUploadProps {
  onUploadComplete?: (url: string) => void;
  folder?: string;
}

const FileUpload = ({ onUploadComplete, folder = 'uploads' }: FileUploadProps) => {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const toast = useToast();

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Only allow images less than 5MB
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please select an image less than 5MB',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Only allow image files
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsUploading(true);

    try {
      const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
        },
        (error) => {
          console.error('Upload error:', error);
          toast({
            title: 'Upload failed',
            description: 'There was an error uploading your file',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          setIsUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          onUploadComplete?.(downloadURL);
          toast({
            title: 'Upload complete',
            description: 'Your file has been uploaded successfully',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          setIsUploading(false);
          setProgress(0);
        }
      );
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your file',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setIsUploading(false);
    }
  };

  return (
    <Box>
      <Input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={isUploading}
        display="none"
        id="file-upload"
      />
      <Button
        as="label"
        htmlFor="file-upload"
        colorScheme="brand"
        isLoading={isUploading}
        cursor="pointer"
      >
        Upload Image
      </Button>
      {isUploading && (
        <Box mt={4}>
          <Text mb={2}>Uploading: {progress.toFixed(0)}%</Text>
          <Progress value={progress} colorScheme="brand" />
        </Box>
      )}
    </Box>
  );
};

export default FileUpload; 