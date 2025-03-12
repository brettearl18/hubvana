import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      50: '#fdf6e8',
      100: '#fae7c3',
      200: '#f6d89e',
      300: '#f2c979',
      400: '#eeba54',
      500: '#daa450', // Primary brand color
      600: '#c68e3f',
      700: '#b2782e',
      800: '#9e621d',
      900: '#8a4c0c',
    },
  },
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.800',
      },
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'brand',
      },
    },
    Card: {
      baseStyle: {
        p: '6',
        bg: 'white',
        rounded: 'lg',
        boxShadow: 'base',
      },
    },
  },
});

export default theme; 