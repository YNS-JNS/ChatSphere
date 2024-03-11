import mongoose from 'mongoose';

const connectDB = async () => {

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connect to MongoDB successfully');
    } catch (error) {
        console.log('Error connecting to MongoDB')
    }

};

export default connectDB;