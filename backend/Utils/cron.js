const cron = require("node-cron");
const users = require("../models/user");

const deleteUnverifiedUsers = () => {
  cron.schedule("0 * * * *", async () => {
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    try {
      const result = await users.deleteMany({
        isVerified: false,
        updatedAt: { $lt: monthAgo },
      });

      if (result.deletedCount > 0) {
        console.log(`🧹 Deleted ${result.deletedCount} unverified users`);
      }
    } catch (err) {
      console.error("Cron cleanup error:", err);
    }
  });
};

module.exports = deleteUnverifiedUsers;
