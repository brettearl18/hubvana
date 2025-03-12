import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Heading,
  Text,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import { CheckIn, UserProfile } from '../../types';

const Dashboard = () => {
  const { userProfile } = useAuth();
  const [clients, setClients] = useState<UserProfile[]>([]);
  const [recentCheckIns, setRecentCheckIns] = useState<CheckIn[]>([]);
  const [stats, setStats] = useState({
    totalClients: 0,
    activeClients: 0,
    pendingCheckIns: 0,
    completedCheckIns: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!userProfile) return;

      // Fetch clients
      const clientsQuery = query(
        collection(db, 'users'),
        where('role', '==', 'client')
        // Add more specific queries if needed
      );
      const clientsSnapshot = await getDocs(clientsQuery);
      const clientsData = clientsSnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as UserProfile)
      );
      setClients(clientsData);

      // Fetch recent check-ins
      const checkInsQuery = query(
        collection(db, 'checkIns'),
        where('coachId', '==', userProfile.id)
        // Add date range or limit if needed
      );
      const checkInsSnapshot = await getDocs(checkInsQuery);
      const checkInsData = checkInsSnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as CheckIn)
      );
      setRecentCheckIns(checkInsData);

      // Calculate stats
      setStats({
        totalClients: clientsData.length,
        activeClients: clientsData.filter((client) => {
          const lastCheckIn = checkInsData.find((checkIn) => checkIn.clientId === client.id);
          return lastCheckIn && new Date(lastCheckIn.date).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000;
        }).length,
        pendingCheckIns: checkInsData.filter((checkIn) => checkIn.status === 'upcoming').length,
        completedCheckIns: checkInsData.filter((checkIn) => checkIn.status === 'completed').length,
      });
    };

    fetchDashboardData();
  }, [userProfile]);

  return (
    <Box>
      <Heading mb={6}>Coach Dashboard</Heading>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={{ base: 5, lg: 8 }}>
        <Stat
          px={{ base: 2, md: 4 }}
          py={'5'}
          shadow={'xl'}
          border={'1px solid'}
          borderColor={useColorModeValue('gray.800', 'gray.500')}
          rounded={'lg'}
        >
          <StatLabel fontWeight={'medium'}>Total Clients</StatLabel>
          <StatNumber fontSize={'2xl'}>{stats.totalClients}</StatNumber>
          <StatHelpText>Active and inactive</StatHelpText>
        </Stat>

        <Stat
          px={{ base: 2, md: 4 }}
          py={'5'}
          shadow={'xl'}
          border={'1px solid'}
          borderColor={useColorModeValue('gray.800', 'gray.500')}
          rounded={'lg'}
        >
          <StatLabel fontWeight={'medium'}>Active Clients</StatLabel>
          <StatNumber fontSize={'2xl'}>{stats.activeClients}</StatNumber>
          <StatHelpText>Last 7 days</StatHelpText>
        </Stat>

        <Stat
          px={{ base: 2, md: 4 }}
          py={'5'}
          shadow={'xl'}
          border={'1px solid'}
          borderColor={useColorModeValue('gray.800', 'gray.500')}
          rounded={'lg'}
        >
          <StatLabel fontWeight={'medium'}>Pending Check-ins</StatLabel>
          <StatNumber fontSize={'2xl'}>{stats.pendingCheckIns}</StatNumber>
          <StatHelpText>Awaiting completion</StatHelpText>
        </Stat>

        <Stat
          px={{ base: 2, md: 4 }}
          py={'5'}
          shadow={'xl'}
          border={'1px solid'}
          borderColor={useColorModeValue('gray.800', 'gray.500')}
          rounded={'lg'}
        >
          <StatLabel fontWeight={'medium'}>Completed Check-ins</StatLabel>
          <StatNumber fontSize={'2xl'}>{stats.completedCheckIns}</StatNumber>
          <StatHelpText>This week</StatHelpText>
        </Stat>
      </SimpleGrid>

      <Box mt={8}>
        <Heading size="md" mb={4}>Recent Check-ins</Heading>
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Client</Th>
                <Th>Date</Th>
                <Th>Status</Th>
                <Th>Progress</Th>
              </Tr>
            </Thead>
            <Tbody>
              {recentCheckIns.map((checkIn) => {
                const client = clients.find((c) => c.id === checkIn.clientId);
                return (
                  <Tr key={checkIn.id}>
                    <Td>{client?.name || 'Unknown'}</Td>
                    <Td>{new Date(checkIn.date).toLocaleDateString()}</Td>
                    <Td>
                      <Badge
                        colorScheme={
                          checkIn.status === 'completed'
                            ? 'green'
                            : checkIn.status === 'missed'
                            ? 'red'
                            : 'yellow'
                        }
                      >
                        {checkIn.status}
                      </Badge>
                    </Td>
                    <Td>{checkIn.overallProgress}%</Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard; 