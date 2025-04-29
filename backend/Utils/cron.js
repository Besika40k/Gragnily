const cron = require("node-cron");
const users = require("../models/user");

const deleteUnverifiedUsers = () => {
  cron.schedule("*/5 * * * *", async () => {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    try {
      const result = await users.deleteMany({
        isVerified: false,
        createdAt: { $lt: tenMinutesAgo },
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
