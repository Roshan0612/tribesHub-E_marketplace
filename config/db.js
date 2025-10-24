
const mongoose = require("mongoose");
const colors = require("colors");


const connectDb = async () => {
        const primaryUrl = process.env.MONGO_URL || process.env.MONGO_URI;
    const fallbackUrl = process.env.MONGO_FALLBACK; // optional, e.g. local Mongo

    if (!primaryUrl && !fallbackUrl) {
        console.error(colors.red("No MongoDB connection string found. Set MONGO_URL (Atlas) or MONGO_FALLBACK (local) in your environment."));
        process.exit(1);
    }

    const tryConnect = async (uri) => {
        try {
            const conn = await mongoose.connect(uri);
            console.log(colors.green(`Connected to MongoDB: ${conn.connection.host}`));
            return true;
        } catch (err) {
            console.error(colors.red(`Mongo connect error for '${uri}': ${err && err.message ? err.message : err}`));
            return false;
        }
    };

    // Try primary first (Atlas SRV). If it fails and a fallback is provided, try that next.
    if (primaryUrl) {
        console.log(colors.cyan("Attempting primary MongoDB connection (MONGO_URL)..."));
        const ok = await tryConnect(primaryUrl);
        if (ok) return;
        if (!fallbackUrl) {
            console.error(colors.yellow("Primary MongoDB connection failed and no fallback URL provided."));
            console.error(colors.yellow("Checklist: \n - Verify the MONGO_URL value in your .env (copy the SRV connection string from MongoDB Atlas)\n - Ensure your Atlas IP Access List allows your IP (or 0.0.0.0/0 for testing)\n - Verify the DB user credentials are correct"));
            process.exit(1);
        }
        console.log(colors.cyan("Falling back to MONGO_FALLBACK..."));
    }

    if (fallbackUrl) {
        const ok2 = await tryConnect(fallbackUrl);
        if (ok2) return;
        console.error(colors.red("Fallback MongoDB connection also failed."));
        console.error(colors.yellow("Checklist: \n - If fallback is a local Mongo, ensure it is running and accessible at the given host/port\n - If fallback is another Atlas string, verify credentials and network access"));
        process.exit(1);
    }
};

module.exports = connectDb;