import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import useAuth from '../hooks/useAuth';
import { initializeFirestore } from '../utils/initializeFirestore';
import FileUpload from '../components/shared/FileUpload';

const TestFirebase = () => {
  const { userProfile } = useAuth();
  const [uploadedUrl, setUploadedUrl] = useState<string>('');
  const toast = useToast();

  const handleInitializeFirestore = async () => {
    if (!userProfile) return;

    const success = await initializeFirestore(userProfile.id);
    if (success) {
      toast({
        title: 'Firestore initialized',
        description: 'Sample data has been added to Firestore',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUploadComplete = (url: string) => {
    setUploadedUrl(url);
  };

  return (
    <Container maxW="container.md" py={8}>
      <Stack spacing={8}>
        <Box>
          <Heading mb={4}>Firebase Test Page</Heading>
          <Text>Test various Firebase features here</Text>
        </Box>

        <Box>
          <Heading size="md" mb={4}>Current User</Heading>
          <Text>ID: {userProfile?.id}</Text>
          <Text>Name: {userProfile?.name}</Text>
          <Text>Role: {userProfile?.role}</Text>
        </Box>

        <Box>
          <Heading size="md" mb={4}>Initialize Firestore</Heading>
          <Button onClick={handleInitializeFirestore} colorScheme="brand">
            Add Sample Data
          </Button>
        </Box>

        <Box>
          <Heading size="md" mb={4}>Test File Upload</Heading>
          <FileUpload onUploadComplete={handleUploadComplete} />
          {uploadedUrl && (
            <Text mt={4}>
              Uploaded file URL: {uploadedUrl}
            </Text>
          )}
        </Box>
      </Stack>
    </Container>
  );
};

export default TestFirebase; 