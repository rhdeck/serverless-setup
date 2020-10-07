import { configAWS } from "@raydeck/serverless-stage";
import AWS, { STS } from "aws-sdk";
import { join, resolve, dirname } from "path";
import { writeFileSync, lstatSync, existsSync } from "fs";
import { getResources } from "@raydeck/serverless-resources";
import { getServerlessConfig } from "@raydeck/serverless-base";
import mustache from "mustache";
let cachedAccountId: string | undefined;
const getAccountID = async () => {
  if (!cachedAccountId) {
    const { Account } = await new STS().getCallerIdentity().promise();
    cachedAccountId = Account;
  }
  return cachedAccountId!;
};
export const makeConfig = async ({
  currentPath = process.cwd(),
  getMyResources = false,
  ignoreResources = false,
  stage = "dev",
  region,
  awsProfile,
  name: fromName,
  ...cmd
}: {
  currentPath: string;
  getMyResources?: boolean;
  ignoreResources?: boolean;
  stage: string;
  awsProfile?: string;
  name: string;
  region?: string;
  cmd?: { [key: string]: any };
}) => {
  let awsAccountId = await getAccountID();
  configAWS(AWS, awsProfile);
  const oldPath = process.cwd();
  process.chdir(currentPath);
  let o: { [key: string]: any } = {
    awsAccountId,
    ...getServerlessConfig(currentPath),
  };
  //check the o for dependencies
  if (o[stage]) {
    o = { ...o, ...o[stage] };
  }
  if (o[fromName]) {
    o = { ...o, ...o[fromName] };
  }
  if (o.dependencies) {
    for (let [k, path] of Object.entries(
      <{ [key: string]: string }>o.dependencies
    )) {
      //Make sure its config is up to date
      path = resolve(process.cwd(), path);
      const basePath = lstatSync(path).isDirectory() ? path : dirname(path);
      let config = await makeConfig({
        ...cmd,
        currentPath: basePath,
        ignoreResources,
        stage,
        awsProfile,
        name: fromName,
        region,
      });
      if (!existsSync(join(basePath, "config.json")))
        writeConfig(config, basePath);
      let r = ignoreResources
        ? {
            ...config,
          }
        : {
            ...config,
            ...(await getResources({
              ...(cmd || {}),
              path: basePath,
              stage,
              awsProfile,
            })),
          };
      o[k] = r;
    }
  }
  if (getMyResources) {
    const resources = await getResources({
      ...(cmd || {}),
      path: currentPath,
      stage,
      awsProfile,
    });
    if (resources) {
      o = {
        ...o,
        ...resources,
      };
    }
  }
  o = Object.entries(o).reduce((out, [key, value]) => {
    if (typeof value === "string") {
      const newValue = mustache.render(value, { ...o, output: out });
      return { ...out, [key]: newValue };
    } else {
      return { ...out, [key]: value };
    }
  }, {});
  process.chdir(oldPath);
  return o;
};
export const writeConfig = (
  fromObject: { [key: string]: any },
  toPath = process.cwd(),
  fileName = "config.json"
) => {
  const fullPath = join(toPath, fileName);
  writeFileSync(fullPath, JSON.stringify(fromObject, null, 2));
  return true;
};
