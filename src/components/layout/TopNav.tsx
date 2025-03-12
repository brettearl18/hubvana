import {
  Box,
  Flex,
  Text,
  Button,
  Stack,
  Icon,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  FiHome,
  FiUsers,
  FiFileText,
  FiCheckCircle,
  FiTrendingUp,
  FiLogOut,
} from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

interface NavLink {
  name: string;
  icon: any;
  path: string;
}

const CoachLinks: Array<NavLink> = [
  { name: 'Dashboard', icon: FiHome, path: '/coach' },
  { name: 'Clients', icon: FiUsers, path: '/coach/clients' },
  { name: 'Templates', icon: FiFileText, path: '/coach/templates' },
];

const ClientLinks: Array<NavLink> = [
  { name: 'Dashboard', icon: FiHome, path: '/client' },
  { name: 'Check-in', icon: FiCheckCircle, path: '/client/check-in' },
  { name: 'Progress', icon: FiTrendingUp, path: '/client/progress' },
];

const TopNav = () => {
  const { userProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const links = userProfile?.role === 'coach' ? CoachLinks : ClientLinks;
  const bgColor = useColorModeValue('white', 'gray.800');

  const NavButton = ({ link }: { link: NavLink }) => {
    const isActive = location.pathname === link.path;
    return (
      <Button
        variant="ghost"
        color={isActive ? 'brand.500' : 'gray.600'}
        leftIcon={<Icon as={link.icon} />}
        onClick={() => navigate(link.path)}
        _hover={{ bg: 'gray.100' }}
      >
        {link.name}
      </Button>
    );
  };

  return (
    <Box
      bg={bgColor}
      px={4}
      borderBottom="1px"
      borderColor="gray.200"
      position="fixed"
      w="full"
      zIndex={1000}
    >
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <HStack spacing={8}>
          <Text fontSize="lg" fontWeight="bold" cursor="pointer" onClick={() => navigate(userProfile?.role === 'coach' ? '/coach' : '/client')}>
            CheckIn.io
          </Text>
          <HStack spacing={4}>
            {links.map((link) => (
              <NavButton key={link.name} link={link} />
            ))}
          </HStack>
        </HStack>
        
        <Menu>
          <MenuButton
            as={Button}
            variant="ghost"
            rightIcon={<Icon as={FiLogOut} />}
          >
            {userProfile?.name || 'User'}
          </MenuButton>
          <MenuList>
            <MenuItem onClick={signOut}>Sign Out</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Box>
  );
};

export default TopNav; 