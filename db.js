const mongoose = require("mongoose");

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.DB_HOST);
		console.log("Database connection successful");
	} catch (error) {
		console.error("Database connection error:", error.message);
		console.error("Error details:", {
			name: error.name,
			code: error.code,
			reason: error.reason || "No additional details",
		});
		process.exit(1);
	}
};

module.exports = connectDB;
