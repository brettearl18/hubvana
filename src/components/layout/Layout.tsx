import { ReactNode } from 'react';
import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  return (
    <Box minH="100vh" bg={bgColor}>
      <Navbar />
      <Flex>
        <Sidebar />
        <Box flex="1" p="6">
          {children}
        </Box>
      </Flex>
    </Box>
  );
};

export default Layout; 