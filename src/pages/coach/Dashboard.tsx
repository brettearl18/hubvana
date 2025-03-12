import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Grid,
  HStack,
  Heading,
  Icon,
  Image,
  Select,
  Stack,
  Tag,
  Text,
  Avatar,
  Spinner,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
} from '@chakra-ui/react';
import { FiFilter, FiBarChart2 } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, limit, Timestamp, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import useAuth from '../../hooks/useAuth';

interface CheckIn {
  id: string;
  clientId: string;
  date: Timestamp;
  categories: string[];
  status: 'completed' | 'pending' | 'needs_attention';
  measurements?: {
    weight?: number;
  };
}

interface Client {
  id: string;
  name: string;
  avatar?: string;
  lastCheckIn?: Timestamp;
  streak?: number;
}

const Dashboard = () => {
  const { userProfile } = useAuth();
  const [loadingStates, setLoadingStates] = useState({
    clients: true,
    checkIns: true,
    stats: true,
    analytics: true
  });
  const [clients, setClients] = useState<Client[]>([]);
  const [recentCheckIns, setRecentCheckIns] = useState<(CheckIn & { client?: Client })[]>([]);
  const [stats, setStats] = useState({
    activeClients: 0,
    needAttention: 0,
    requireIntervention: 0,
    weightLoss: {
      total: 0,
      average: 0,
      best: { name: '', value: 0 }
    }
  });

  useEffect(() => {
    if (!userProfile?.id) return;

    setLoadingStates({
      clients: true,
      checkIns: true,
      stats: true,
      analytics: true
    });

    // Set up real-time listener for clients
    const clientsQuery = query(
      collection(db, 'users'),
      where('coachId', '==', userProfile.id),
      where('role', '==', 'client')
    );

    const checkInsQuery = query(
      collection(db, 'checkIns'),
      where('coachId', '==', userProfile.id),
      orderBy('date', 'desc'),
      limit(10)
    );

    // Subscribe to clients updates
    const unsubscribeClients = onSnapshot(clientsQuery, (snapshot) => {
      const clientsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Client));
      setClients(clientsData);
      setLoadingStates(prev => ({ ...prev, clients: false }));

      // Subscribe to check-ins updates
      const unsubscribeCheckIns = onSnapshot(checkInsQuery, (checkInsSnapshot) => {
        const checkInsData = checkInsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          client: clientsData.find(c => c.id === doc.data().clientId)
        } as CheckIn & { client?: Client }));
        setRecentCheckIns(checkInsData);
        setLoadingStates(prev => ({ ...prev, checkIns: false }));

        // Calculate stats
        const thirtyDaysAgo = Timestamp.fromDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
        const activeClientsCount = clientsData.filter(client => 
          client.lastCheckIn && client.lastCheckIn > thirtyDaysAgo
        ).length;

        const needAttentionCount = checkInsData.filter(
          checkIn => checkIn.status === 'needs_attention'
        ).length;

        const requireInterventionCount = checkInsData.filter(
          checkIn => checkIn.status === 'needs_attention' && 
          checkIn.date < Timestamp.fromDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
        ).length;

        // Calculate weight loss stats
        let totalWeightLoss = 0;
        let bestProgress = { name: '', value: 0 };
        
        clientsData.forEach(client => {
          const clientCheckIns = checkInsData.filter(ci => ci.clientId === client.id);
          if (clientCheckIns.length >= 2) {
            const firstWeight = clientCheckIns[clientCheckIns.length - 1].measurements?.weight || 0;
            const lastWeight = clientCheckIns[0].measurements?.weight || 0;
            const weightLoss = firstWeight - lastWeight;
            totalWeightLoss += weightLoss;
            
            if (weightLoss > bestProgress.value) {
              bestProgress = { name: client.name, value: weightLoss };
            }
          }
        });

        setStats({
          activeClients: activeClientsCount,
          needAttention: needAttentionCount,
          requireIntervention: requireInterventionCount,
          weightLoss: {
            total: totalWeightLoss,
            average: totalWeightLoss / (clientsData.length || 1),
            best: bestProgress
          }
        });
        setLoadingStates(prev => ({ ...prev, stats: false, analytics: false }));
      });

      return () => unsubscribeCheckIns();
    });

    return () => {
      unsubscribeClients();
    };
  }, [userProfile?.id]);

  const StatCardSkeleton = () => (
    <Card>
      <CardBody>
        <Skeleton height="20px" width="100px" mb={2} />
        <Skeleton height="36px" width="60px" />
      </CardBody>
    </Card>
  );

  const CheckInCardSkeleton = () => (
    <Card>
      <CardBody>
        <Flex align="center" gap={4}>
          <SkeletonCircle size="40px" />
          <Box flex={1}>
            <Flex justify="space-between" align="center">
              <HStack>
                <Skeleton height="20px" width="120px" />
                <Skeleton height="20px" width="80px" />
              </HStack>
              <Skeleton height="20px" width="100px" />
            </Flex>
            <SkeletonText mt={2} noOfLines={2} spacing={2} />
            <HStack mt={3} spacing={4}>
              <Skeleton height="32px" width="100px" />
              <Skeleton height="32px" width="100px" />
              <Skeleton height="32px" width="100px" />
            </HStack>
          </Box>
        </Flex>
      </CardBody>
    </Card>
  );

  return (
    <Box p={6}>
      {/* Client Stats Summary */}
      <Grid templateColumns="repeat(4, 1fr)" gap={6} mb={8}>
        {loadingStates.stats ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <Card>
              <CardBody>
                <Text color="gray.500">Active clients</Text>
                <Heading size="lg">{stats.activeClients}</Heading>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Text color="gray.500">Need attention</Text>
                <Heading size="lg">{stats.needAttention}</Heading>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Text color="gray.500">Require intervention</Text>
                <Heading size="lg">{stats.requireIntervention}</Heading>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Text color="gray.500">Last 30 days</Text>
                <Heading size="lg">{stats.weightLoss.total.toFixed(1)} kg</Heading>
                <Text color="gray.500">(30d)</Text>
              </CardBody>
            </Card>
          </>
        )}
      </Grid>

      {/* Recent Activity */}
      <Box mb={8}>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="md">Recent Activity</Heading>
          <HStack>
            <Button leftIcon={<Icon as={FiFilter} />}>Filter</Button>
            <Button leftIcon={<Icon as={FiBarChart2} />}>Analytics</Button>
          </HStack>
        </Flex>

        <HStack spacing={4} mb={4}>
          <Tag colorScheme="red">NEEDS ATTENTION</Tag>
          <Tag colorScheme="orange">PENDING CHECK-INS</Tag>
          <Tag colorScheme="green">COMPLETED</Tag>
          <Tag colorScheme="purple">MILESTONES</Tag>
        </HStack>

        <Stack spacing={4}>
          {loadingStates.checkIns ? (
            <>
              <CheckInCardSkeleton />
              <CheckInCardSkeleton />
              <CheckInCardSkeleton />
            </>
          ) : (
            recentCheckIns.map((checkIn) => (
              <Card key={checkIn.id}>
                <CardBody>
                  <Flex align="center" gap={4}>
                    <Avatar name={checkIn.client?.name} src={checkIn.client?.avatar} />
                    <Box flex={1}>
                      <Flex justify="space-between" align="center">
                        <HStack>
                          <Text fontWeight="bold">{checkIn.client?.name}</Text>
                          <Tag size="sm" colorScheme={
                            checkIn.status === 'completed' ? 'green' :
                            checkIn.status === 'needs_attention' ? 'red' : 'orange'
                          }>
                            {checkIn.status.toUpperCase().replace('_', ' ')}
                          </Tag>
                          {checkIn.client?.streak && checkIn.client.streak > 5 && (
                            <Tag size="sm" colorScheme="purple">
                              {checkIn.client.streak} DAY STREAK
                            </Tag>
                          )}
                        </HStack>
                        <Text color="gray.500">
                          {checkIn.date.toDate().toLocaleDateString()}
                        </Text>
                      </Flex>
                      <Text mt={1}>
                        Completed check-in with {checkIn.categories.length} categories.
                        {checkIn.status === 'needs_attention' && ' Needs attention in some areas.'}
                      </Text>
                      <HStack mt={2} spacing={2}>
                        {checkIn.categories.map((cat, idx) => (
                          <Tag key={idx} size="sm" variant="outline">
                            {cat}
                          </Tag>
                        ))}
                      </HStack>
                      <HStack mt={3} spacing={4}>
                        <Button size="sm" variant="outline">View Check-in</Button>
                        <Button size="sm" variant="outline">Progress</Button>
                        <Button size="sm" variant="outline">Message</Button>
                      </HStack>
                    </Box>
                  </Flex>
                </CardBody>
              </Card>
            ))
          )}
        </Stack>
      </Box>

      {/* Weight Loss Analytics */}
      <Grid templateColumns="2fr 1fr" gap={8}>
        <Box>
          <Flex justify="space-between" align="center" mb={4}>
            <Heading size="md">Weight Loss Analytics</Heading>
            <Select w="150px" defaultValue="30">
              <option value="30">30 Days</option>
              <option value="60">60 Days</option>
              <option value="90">90 Days</option>
            </Select>
          </Flex>

          {loadingStates.analytics ? (
            <Stack spacing={4}>
              <Skeleton height="24px" />
              <Skeleton height="24px" />
              <Skeleton height="24px" />
              <Skeleton height="16px" width="200px" />
            </Stack>
          ) : (
            <Stack spacing={4}>
              <Flex justify="space-between">
                <Text>Total Weight Loss</Text>
                <Text>{stats.weightLoss.total.toFixed(1)} kg</Text>
              </Flex>
              <Flex justify="space-between">
                <Text>Average per Client</Text>
                <Text>{stats.weightLoss.average.toFixed(1)} kg</Text>
              </Flex>
              <Flex justify="space-between">
                <Text>Most Progress</Text>
                <Text>{stats.weightLoss.best.value.toFixed(1)} kg</Text>
              </Flex>
              <Text color="gray.500" fontSize="sm">Based on {clients.length} active clients</Text>
            </Stack>
          )}
        </Box>

        {/* Category Trends */}
        <Box>
          <Heading size="md" mb={4}>Category Trends</Heading>
          {loadingStates.analytics ? (
            <Stack spacing={4}>
              <Skeleton height="24px" />
              <Skeleton height="24px" />
              <Skeleton height="24px" />
            </Stack>
          ) : (
            <Stack spacing={4}>
              {['Training', 'Nutrition', 'Sleep'].map((category, idx) => (
                <Flex key={idx} justify="space-between" align="center">
                  <Text>{category}</Text>
                  <Tag colorScheme="green">ON TRACK</Tag>
                </Flex>
              ))}
            </Stack>
          )}
        </Box>
      </Grid>
    </Box>
  );
};

export default Dashboard; 