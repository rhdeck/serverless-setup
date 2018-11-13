#!/usr/bin/env node
const commander = require("commander");
const { makeConfig, writeConfig } = require("./");
commander
  .description("Create config.json")
  .option(
    "-p --currentPath <pathname>",
    "Reference path for examining a serverlesss setup"
  )
  .option("-f --file-name", "File to write output (default config.json)")
  .option(
    "-s --standard-output",
    "Write to standard output instead of config.json"
  )
  .action(async ({ currentPath, targetPath, fileName, standardOutput }) => {
    fileName = fileName && "config.json";
    targetPath = targetPath && process.cwd();
    try {
      const c = await makeConfig({ currentPath });
      if (standardOutput) {
        console.log(JSON.stringify(c, null, 2));
      } else {
        writeConfig(c, targetPath, fileName);
      }
    } catch (e) {
      console.log(
        "Caught an error! Is it possible  upstream serverless stacks are not deployed yet?"
      );
      console.log("Error message:", e.toString());
      process.exit(1);
    }
  })
  .parse(process.argv);
