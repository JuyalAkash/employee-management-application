import app from "../app.js";

// Load environment variables
const { PORT, HOST } = process.env;

// Check if PORT and HOST are defined
if (!PORT || !HOST) {
  console.error(
    "Error: PORT and HOST must be defined in the environment variables."
  );
  process.exit(1);
}

// Server setup
app.listen(PORT, HOST, () => {
  console.log(`🚀 Server is running at http://${HOST}:${PORT}`);
});

// Handle unhandled rejections
process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error);
  process.exit(1);
});
