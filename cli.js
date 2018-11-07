#!/usr/bin/env node
const commander = require("commander");
const { makeConfig, writeConfig } = require("./");
commander
  .description("Create config.json")
  .action(async args => {
    writeConfig(await makeConfig(args));
  })
  .parse(process.argv);
