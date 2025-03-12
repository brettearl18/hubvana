import { db } from '../config/firebase';
import { collection, doc, setDoc, Timestamp } from 'firebase/firestore';

export const initializeFirestore = async () => {
  try {
    // Sample coach
    await setDoc(doc(db, 'users', 'coach1'), {
      id: 'coach1',
      name: 'John Trainer',
      email: 'john@example.com',
      role: 'coach',
      createdAt: Timestamp.now()
    });

    // Sample clients with more realistic data
    const clients = [
      {
        id: 'client1',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        role: 'client',
        coachId: 'coach1',
        avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
        lastCheckIn: Timestamp.fromDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)),
        streak: 15,
        createdAt: Timestamp.now()
      },
      {
        id: 'client2',
        name: 'Mike Thompson',
        email: 'mike@example.com',
        role: 'client',
        coachId: 'coach1',
        avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
        lastCheckIn: Timestamp.fromDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)),
        streak: 3,
        createdAt: Timestamp.now()
      },
      {
        id: 'client3',
        name: 'Emma Davis',
        email: 'emma@example.com',
        role: 'client',
        coachId: 'coach1',
        avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
        lastCheckIn: Timestamp.fromDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
        streak: 0,
        createdAt: Timestamp.now()
      },
      {
        id: 'client4',
        name: 'Alex Chen',
        email: 'alex@example.com',
        role: 'client',
        coachId: 'coach1',
        avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
        lastCheckIn: Timestamp.fromDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)),
        streak: 21,
        createdAt: Timestamp.now()
      },
      {
        id: 'client5',
        name: 'Lisa Martinez',
        email: 'lisa@example.com',
        role: 'client',
        coachId: 'coach1',
        avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
        lastCheckIn: Timestamp.fromDate(new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)),
        streak: 7,
        createdAt: Timestamp.now()
      }
    ];

    for (const client of clients) {
      await setDoc(doc(db, 'users', client.id), client);
    }

    // Sample check-ins with varied statuses and categories
    const checkIns = [
      {
        id: 'checkin1',
        clientId: 'client1',
        coachId: 'coach1',
        date: Timestamp.fromDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)),
        categories: ['T', 'N', 'S', 'M'],
        status: 'completed',
        measurements: {
          weight: 65.5,
          bodyFat: 22,
          energy: 8
        },
        notes: "Great progress with nutrition plan!"
      },
      {
        id: 'checkin2',
        clientId: 'client2',
        coachId: 'coach1',
        date: Timestamp.fromDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)),
        categories: ['T', 'N', 'S', 'M'],
        status: 'needs_attention',
        measurements: {
          weight: 82.3,
          bodyFat: 18,
          energy: 5
        },
        notes: "Struggling with sleep schedule"
      },
      {
        id: 'checkin3',
        clientId: 'client4',
        coachId: 'coach1',
        date: Timestamp.fromDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)),
        categories: ['T', 'N', 'R', 'M'],
        status: 'completed',
        measurements: {
          weight: 75.8,
          bodyFat: 15,
          energy: 9
        },
        notes: "Hit new PR in deadlifts!"
      },
      {
        id: 'checkin4',
        clientId: 'client5',
        coachId: 'coach1',
        date: Timestamp.fromDate(new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)),
        categories: ['T', 'N', 'S', 'M'],
        status: 'pending',
        measurements: {
          weight: 68.2,
          bodyFat: 24,
          energy: 7
        }
      },
      {
        id: 'checkin5',
        clientId: 'client3',
        coachId: 'coach1',
        date: Timestamp.fromDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
        categories: ['T', 'N', 'S', 'M'],
        status: 'needs_attention',
        measurements: {
          weight: 70.1,
          bodyFat: 26,
          energy: 4
        },
        notes: "Missed last three workouts"
      },
      // Historical check-ins for weight tracking
      {
        id: 'checkin6',
        clientId: 'client1',
        coachId: 'coach1',
        date: Timestamp.fromDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
        categories: ['T', 'N', 'S', 'M'],
        status: 'completed',
        measurements: {
          weight: 68.5,
          bodyFat: 24,
          energy: 6
        }
      },
      {
        id: 'checkin7',
        clientId: 'client2',
        coachId: 'coach1',
        date: Timestamp.fromDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
        categories: ['T', 'N', 'S', 'M'],
        status: 'completed',
        measurements: {
          weight: 85.0,
          bodyFat: 20,
          energy: 7
        }
      },
      {
        id: 'checkin8',
        clientId: 'client4',
        coachId: 'coach1',
        date: Timestamp.fromDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
        categories: ['T', 'N', 'S', 'M'],
        status: 'completed',
        measurements: {
          weight: 78.2,
          bodyFat: 17,
          energy: 8
        }
      }
    ];

    for (const checkIn of checkIns) {
      await setDoc(doc(db, 'checkIns', checkIn.id), checkIn);
    }

    console.log('Successfully initialized Firestore with sample data');
  } catch (error) {
    console.error('Error initializing Firestore:', error);
  }
};

export default initializeFirestore; 