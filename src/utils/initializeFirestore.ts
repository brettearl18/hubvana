import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { CheckInTemplate, Question } from '../types';

export const initializeFirestore = async (userId: string) => {
  try {
    // Create a default template
    const defaultTemplate: Omit<CheckInTemplate, 'id'> = {
      name: 'Daily Check-in Template',
      questions: [
        {
          id: '1',
          type: 'text',
          label: 'How are you feeling today?',
          required: true
        },
        {
          id: '2',
          type: 'slider',
          label: 'Rate your energy level (1-10)',
          required: true,
          min: 1,
          max: 10
        },
        {
          id: '3',
          type: 'checkbox',
          label: 'Did you complete your daily tasks?',
          required: true
        }
      ],
      createdBy: userId,
      isDefault: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await addDoc(collection(db, 'templates'), defaultTemplate);

    console.log('Firestore initialized with sample data');
    return true;
  } catch (error) {
    console.error('Error initializing Firestore:', error);
    return false;
  }
}; 