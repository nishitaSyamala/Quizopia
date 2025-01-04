import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectdb = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log('MONGODB is successfully Connected and Host is', connectionInstance.connection.host);   
    } catch (error) {
        console.log("MongoDB Connection ERROR::", error);
    }
}

export default connectdb;