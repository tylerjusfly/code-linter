const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");
app.use(cors());
require('dotenv').config()

const server = http.createServer(app);

// eslint-disable-next-line no-undef
const PORT = parseInt(process.env.PORT, 10) || 4002

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("send_code", async (data) => {
    const tempFilePath = path.join("./", `temp_code.${data.lang}`);

    fs.writeFileSync(tempFilePath, data.code);

    let results = [];

    let lintCommand;
    if (data.lang === "py") {
      lintCommand = spawn("pylint", [tempFilePath, "--output-format=json"]);
    } else if (data.lang === "js") {
      lintCommand = spawn("ESLintBear", [tempFilePath], { shell: true });
    } else {
      results = [];
      // return [];
    }

    // let results = [];

    lintCommand.stdout.on("data", (data) => {
      const lintResult = data ? JSON.parse(data) : [];

      results = lintResult
        .map((result) => {
          if (result.type === "error") {
            return {
              startLineNumber: result.line,
              startColumn: result.column,
              endLineNumber: result.line,
              endColumn: result.column + 1,
              message: result.message,
              severity: result.type === "error" ? 8 : 4,
            };
          }
          return null;
        })
        .filter((result) => result !== null);

      socket.emit("get_markers", { results: results });
    });

    lintCommand.stderr.on("data", () => {
      // Handle stderr if needed
      results = [];
    });

  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`SERVER RUNNING ON ${PORT}`);
});
