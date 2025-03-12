import {
  Box,
  Heading,
  Text,
  Container,
} from '@chakra-ui/react';

const ClientManagement = () => {
  return (
    <Container maxW="container.xl" py={8}>
      <Box>
        <Heading mb={4}>Client Management</Heading>
        <Text>Manage your clients here</Text>
      </Box>
    </Container>
  );
};

export default ClientManagement; 