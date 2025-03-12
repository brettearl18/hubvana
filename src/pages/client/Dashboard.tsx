import {
  Box,
  Button,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  Progress,
  Card,
  CardHeader,
  CardBody,
  Badge,
  List,
  ListItem,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiTrendingUp, FiCheckCircle } from 'react-icons/fi';
import { db } from '../../config/firebase';
import useAuth from '../../hooks/useAuth';
import { CheckIn, ClientProgress } from '../../types';

const Dashboard = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [progress, setProgress] = useState<ClientProgress | null>(null);

  useEffect(() => {
    const fetchClientData = async () => {
      if (!userProfile) return;

      // Fetch recent check-ins
      const checkInsQuery = query(
        collection(db, 'checkIns'),
        where('clientId', '==', userProfile.id),
        orderBy('date', 'desc'),
        limit(5)
      );
      const checkInsSnapshot = await getDocs(checkInsQuery);
      const checkInsData = checkInsSnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as CheckIn)
      );
      setCheckIns(checkInsData);

      // Fetch progress data
      const progressQuery = query(
        collection(db, 'progress'),
        where('clientId', '==', userProfile.id)
      );
      const progressSnapshot = await getDocs(progressQuery);
      if (!progressSnapshot.empty) {
        setProgress(progressSnapshot.docs[0].data() as ClientProgress);
      }
    };

    fetchClientData();
  }, [userProfile]);

  const nextCheckIn = checkIns.find((checkIn) => checkIn.status === 'upcoming');
  const completionRate = checkIns.length > 0
    ? (checkIns.filter((checkIn) => checkIn.status === 'completed').length / checkIns.length) * 100
    : 0;

  return (
    <Box>
      <Stack spacing={8}>
        <Box>
          <Heading mb={4}>Welcome back, {userProfile?.name}</Heading>
          <Text color="gray.600">Track your progress and manage your check-ins</Text>
        </Box>

        {nextCheckIn && (
          <Card>
            <CardHeader>
              <Heading size="md">Next Check-in</Heading>
            </CardHeader>
            <CardBody>
              <Stack spacing={4}>
                <Text>
                  Scheduled for: {new Date(nextCheckIn.date).toLocaleDateString()}
                </Text>
                <Button
                  leftIcon={<Icon as={FiCalendar} />}
                  colorScheme="brand"
                  onClick={() => navigate('/client/check-in')}
                >
                  Complete Check-in
                </Button>
              </Stack>
            </CardBody>
          </Card>
        )}

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          <Card>
            <CardHeader>
              <Heading size="md">Progress Overview</Heading>
            </CardHeader>
            <CardBody>
              <Stack spacing={4}>
                <Box>
                  <Text mb={2}>Check-in Completion Rate</Text>
                  <Progress value={completionRate} colorScheme="brand" rounded="md" />
                  <Text mt={2} fontSize="sm" color="gray.600">
                    {completionRate.toFixed(1)}% completed
                  </Text>
                </Box>

                {progress && (
                  <List spacing={3}>
                    {Object.entries(progress.goals).map(([key, value]) => (
                      <ListItem key={key}>
                        <Flex justify="space-between" align="center">
                          <Text>{key}</Text>
                          <Badge
                            colorScheme={value.current >= value.target ? 'green' : 'yellow'}
                          >
                            {value.current} / {value.target}
                          </Badge>
                        </Flex>
                        <Progress
                          value={(value.current / value.target) * 100}
                          colorScheme="brand"
                          size="sm"
                          mt={2}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Stack>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <Heading size="md">Recent Activity</Heading>
            </CardHeader>
            <CardBody>
              <List spacing={4}>
                {checkIns.map((checkIn) => (
                  <ListItem key={checkIn.id}>
                    <Flex justify="space-between" align="center">
                      <Stack spacing={0}>
                        <Text fontWeight="medium">
                          Check-in {new Date(checkIn.date).toLocaleDateString()}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          Progress: {checkIn.overallProgress}%
                        </Text>
                      </Stack>
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
                    </Flex>
                  </ListItem>
                ))}
              </List>
            </CardBody>
          </Card>
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          <Button
            size="lg"
            leftIcon={<Icon as={FiCheckCircle} />}
            onClick={() => navigate('/client/check-in')}
          >
            Start Check-in
          </Button>
          <Button
            size="lg"
            leftIcon={<Icon as={FiTrendingUp} />}
            variant="outline"
            onClick={() => navigate('/client/progress')}
          >
            View Progress
          </Button>
        </SimpleGrid>
      </Stack>
    </Box>
  );
};

export default Dashboard; 