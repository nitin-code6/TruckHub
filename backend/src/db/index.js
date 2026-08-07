import mongoose from 'mongoose';
import { DB_NAME} from '../constant.js';


const connectDB=async ()=>{
    try {
        // Connect without concatenating DB name into the URI string.
        // Use the `dbName` option to avoid accidental leading/trailing slash issues
        // which can produce invalid namespaces like `/CampusFlow.users`.
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URL, {
            dbName: DB_NAME,
            // Optional: additional options can be set here
            // useNewUrlParser/useUnifiedTopology are default in modern mongoose
        });

        console.log(`connected to MongoDB at ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("Error connecting to MongoDB:", error);
        process.exit(1); // Exit the process with failure 
    } 
}

export default connectDB; 