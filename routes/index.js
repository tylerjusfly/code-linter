const express = require("express");
const router = express.Router();
const fs = require("fs");
const { spawn } = require("child_process");
const path = require("path");

// http://localhost:4002/lint

router.post("/lint", async function (req, res) {
  const { code, lang } = req.body;

  const tempFilePath = path.join(__dirname, `temp_code.${lang}`);
  try {
    fs.writeFileSync(tempFilePath, code);

    let lintCommand;
    if (lang === "py") {
      lintCommand = spawn("pylint", [tempFilePath, "--output-format=json"]);
    } else if (lang === "js") {
      lintCommand = spawn("ESLintBear", [tempFilePath]);
    } else {
      return res.status(400).send("Unsupported language");
    }

    lintCommand.stdout.on("data", (data) => {
      const results = data ? JSON.parse(data) : [];
      return res.json(
        results
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
          .filter((result) => result !== null)
      );
    });

    lintCommand.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
      return res.status(500).send("Linting failed");
    });

    lintCommand.on("close", (code) => {
      console.log(`child process exited with code ${code}`);
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Linting failed");
  }
});

module.exports = router;
