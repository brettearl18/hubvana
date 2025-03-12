import { Box } from '@chakra-ui/react';
import TopNav from './TopNav';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box minH="100vh" bg="gray.50">
      <TopNav />
      <Box pt="72px" px={4} maxW="1400px" mx="auto">
        {children}
      </Box>
    </Box>
  );
};

export default Layout; 