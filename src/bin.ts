#!/usr/bin/env node
import commander from "commander";
import { makeConfig, writeConfig } from ".";
commander
  .description("Create config.json")
  .option(
    "-p --currentPath <pathname>",
    "Reference path for examining a serverlesss setup"
  )
  .option(
    "-t --stage <stage>",
    "Stack stage to check against. Defaul value is dev"
  )
  .option("-a --aws-profile <profile>", "Named AWS Profile")
  .option(
    "-f --file-name [filename]",
    "File to write output (default config.json)"
  )
  .option(
    "-s --standard-output",
    "Write to standard output instead of config.json"
  )
  .option(
    "-n --stack-name <stackname>",
    "Name of the stack/application (e.g. privilege, test-a, etc)"
  )
  .action(
    async ({
      currentPath,
      targetPath,
      fileName,
      standardOutput,
      awsProfile,
      stage = "dev",
      stackName,
    }) => {
      fileName = fileName && "config.json";
      targetPath = targetPath && process.cwd();
      try {
        const c = await makeConfig({
          currentPath,
          stage,
          awsProfile,
          name: stackName,
        });
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
    }
  )
  .parse(process.argv);
export { commander };
