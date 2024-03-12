import cron from "node-cron";

// 7pm every Sunday
cron.schedule("0 19 * * 0", () => {});
