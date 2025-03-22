const { spawn } = require("child_process");

const server = spawn("npm", ["run", "server"], {
  stdio: "inherit",
  shell: true,
});
const client = spawn("npm", ["run", "client"], {
  stdio: "inherit",
  shell: true,
});

const exitHandler = () => {
  console.log("\nЗавершення процесів...");
  server.kill();
  client.kill();
  process.exit();
};

process.on("SIGINT", exitHandler);
process.on("SIGTERM", exitHandler);
