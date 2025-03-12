import {
  Box,
  Heading,
  Text,
  Container,
} from '@chakra-ui/react';

const Progress = () => {
  return (
    <Container maxW="container.xl" py={8}>
      <Box>
        <Heading mb={4}>Progress Tracking</Heading>
        <Text>View your progress here</Text>
      </Box>
    </Container>
  );
};

export default Progress; 