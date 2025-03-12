import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, collection, addDoc, Timestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "demo-key",
  authDomain: "demo.firebaseapp.com",
  projectId: "demo",
  storageBucket: "demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Connect to emulators
connectAuthEmulator(auth, 'http://127.0.0.1:9099');
connectFirestoreEmulator(db, '127.0.0.1', 8080);

const initializeFirestore = async () => {
  // Create sample coach
  const coachData = {
    email: 'john@example.com',
    name: 'John Smith',
    role: 'coach',
    location: 'San Francisco, CA',
    createdAt: Timestamp.now()
  };

  const coachRef = await addDoc(collection(db, 'users'), coachData);
  console.log('Created coach document:', coachRef.id);

  // Create sample clients
  const clients = [
    {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      role: 'client',
      coachId: coachRef.id,
      progress: 75,
      lastCheckIn: Timestamp.now()
    },
    {
      name: 'Bob Wilson',
      email: 'bob@example.com',
      role: 'client',
      coachId: coachRef.id,
      progress: 45,
      lastCheckIn: Timestamp.fromDate(new Date(Date.now() - 86400000))
    }
  ];

  for (const client of clients) {
    const clientRef = await addDoc(collection(db, 'users'), client);
    console.log('Created client document:', clientRef.id);

    // Add some check-ins for each client
    const checkIns = [
      {
        clientId: clientRef.id,
        coachId: coachRef.id,
        date: Timestamp.now(),
        weight: Math.floor(Math.random() * 20) + 150,
        mood: 'Great',
        sleep: 8,
        nutrition: 'On track',
        notes: 'Had a great workout today!'
      },
      {
        clientId: clientRef.id,
        coachId: coachRef.id,
        date: Timestamp.fromDate(new Date(Date.now() - 86400000)),
        weight: Math.floor(Math.random() * 20) + 150,
        mood: 'Good',
        sleep: 7,
        nutrition: 'Mostly good',
        notes: 'Feeling motivated!'
      }
    ];

    for (const checkIn of checkIns) {
      const checkInRef = await addDoc(collection(db, 'checkIns'), checkIn);
      console.log('Created check-in document:', checkInRef.id);
    }
  }
};

const main = async () => {
  try {
    // Try to sign in first
    console.log('Attempting to sign in as coach...');
    try {
      await signInWithEmailAndPassword(auth, 'john@example.com', 'password123');
      console.log('Successfully signed in as coach');
    } catch (error: any) {
      // If user doesn't exist, create the account
      if (error.code === 'auth/user-not-found') {
        console.log('Coach account not found, creating new account...');
        await createUserWithEmailAndPassword(auth, 'john@example.com', 'password123');
        console.log('Coach account created');
      } else {
        throw error;
      }
    }

    // Initialize Firestore data
    console.log('Initializing Firestore data...');
    await initializeFirestore();
    console.log('Firestore data initialized');
  } catch (error) {
    console.error('Error setting up emulator:', error);
  }
};

main(); 