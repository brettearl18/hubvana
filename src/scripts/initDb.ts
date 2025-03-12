import initializeFirestore from './initFirestore';

const main = async () => {
  console.log('Starting database initialization...');
  await initializeFirestore();
  console.log('Database initialization complete!');
};

main().catch(console.error); 