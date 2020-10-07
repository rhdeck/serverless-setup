#!/usr/bin/env node
import { stringList } from "aws-sdk/clients/datapipeline";
import commander from "commander";
import { makeConfig, writeConfig } from ".";
commander
  .description("Create config.json")
  .option(
    "-p --currentPath <pathname>",
    "Reference path for examining a serverlesss setup",
    "."
  )
  .option(
    "-t --stage <stage>",
    "Stack stage to check against. Defaul value is dev",
    "dev"
  )
  .option("-a --aws-profile <profile>", "Named AWS Profile")
  .option(
    "-f --file-name [filename]",
    "File to write output (default config.json)",
    "config.json"
  )
  .option(
    "-s --standard-output",
    "Write to standard output instead of config.json",
    false
  )
  .option(
    "-n --stack-name <stackname>",
    "Name of the stack/application (e.g. privilege, test-a, etc)"
  )
  .option("-r --region <region>", "Region to pass to serverless commands")
  .action(
    async ({
      currentPath,
      targetPath,
      fileName,
      standardOutput,
      awsProfile,
      stage,
      stackName,
      region,
    }: {
      currentPath: string;
      targetPath: string;
      fileName: string;
      standardOutput: boolean;
      awsProfile?: string;
      stage: string;
      stackName: string;
      region?: string;
    }) => {
      try {
        const c = await makeConfig({
          currentPath,
          stage,
          awsProfile,
          name: stackName,
          region,
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
