import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  try {

    const getMongoUri = (): string => {

      if (process.env.NODE_ENV === 'production') {
        return process.env.MONGODB_URI || '';
      }

      return process.env.MONGODB_URI_TEST || '';

    }

    const mongoUri = getMongoUri();
    
    await mongoose.connect(mongoUri);
    
    console.log('Connected to MongoDB');
    

    mongoose.connection.on('error', (error) => {
      console.error('MongoDB connection error:', error);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
    
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};
