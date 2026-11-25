import mongoose from "mongoose";
import Telemetry from "../models/Telemetry.js";

const connectDB = async () => {
    await mongoose.connect(process.env.MONGODB_URI);

    const db = mongoose.connection.db;

    const existing = await db.listCollections({
        name: "telemetry"
    }).next();

    if (!existing) {
        await Telemetry.createCollection();
    } else if (!existing.options?.timeseries) {
        throw new Error("Telemetry must be a time-series collection");
    }

    console.log("MongoDB connected successfully");
};

export default connectDB;