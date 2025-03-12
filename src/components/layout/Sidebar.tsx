import {
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Text,
  BoxProps,
  FlexProps,
} from '@chakra-ui/react';
import {
  FiHome,
  FiUsers,
  FiFileText,
  FiCheckCircle,
  FiTrendingUp,
} from 'react-icons/fi';
import { IconType } from 'react-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

interface LinkItemProps {
  name: string;
  icon: IconType;
  path: string;
}

const CoachLinks: Array<LinkItemProps> = [
  { name: 'Dashboard', icon: FiHome, path: '/coach' },
  { name: 'Clients', icon: FiUsers, path: '/coach/clients' },
  { name: 'Templates', icon: FiFileText, path: '/coach/templates' },
];

const ClientLinks: Array<LinkItemProps> = [
  { name: 'Dashboard', icon: FiHome, path: '/client' },
  { name: 'Check-in', icon: FiCheckCircle, path: '/client/check-in' },
  { name: 'Progress', icon: FiTrendingUp, path: '/client/progress' },
];

const Sidebar = ({ ...rest }: BoxProps) => {
  const { userProfile } = useAuth();
  const links = userProfile?.role === 'coach' ? CoachLinks : ClientLinks;

  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          {userProfile?.role === 'coach' ? 'Coach' : 'Client'}
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} />
      </Flex>
      {links.map((link) => (
        <NavItem key={link.name} icon={link.icon} path={link.path}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  path: string;
  children: string;
}

const NavItem = ({ icon, path, children, ...rest }: NavItemProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <Box
      as="a"
      href="#"
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
      onClick={(e: React.MouseEvent) => {
        e.preventDefault();
        navigate(path);
      }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        bg={isActive ? 'brand.500' : 'transparent'}
        color={isActive ? 'white' : 'inherit'}
        _hover={{
          bg: 'brand.400',
          color: 'white',
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Box>
  );
};

export default Sidebar; 