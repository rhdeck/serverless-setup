const { STS } = require("aws-sdk");
const { join, resolve, dirname } = require("path");
const { readFileSync, writeFileSync, lstatSync, existsSync } = require("fs");
const { getResources } = require("serverless-resources");
const mustache = require("mustache");
let cachedAccountId = null;
const getAccountID = async () => {
  if (!cachedAccountId) {
    const { Account } = await new STS().getCallerIdentity().promise();
    cachedAccountId = Account;
  }
  return cachedAccountId;
};
const makeConfig = async ({
  currentPath = process.cwd(),
  getMyResources,
  ignoreResources = false,
  stage = "dev",
  ...cmd
}) => {
  let awsAccountId = await getAccountID();
  const oldPath = process.cwd();
  process.chdir(currentPath);
  let o = { awsAccountId };
  //open the package.json\
  const packagePath = join("package.json");
  if (existsSync(packagePath)) {
    let { name, version, serverless: rawServerless } = JSON.parse(
      readFileSync(packagePath, { encoding: "UTF8" })
    );
    o = { ...o, name, version };
    if (rawServerless) {
      let { dependencies, ...serverless } = rawServerless;
      let stagedServerless = serverless[stage] ? serverless[stage] : {};
      o = { ...o, ...serverless, ...stagedServerless };
      if (dependencies) {
        for (let [k, path] of Object.entries(dependencies)) {
          //Make sure its config is up to date
          path = resolve(path);
          const basePath = lstatSync(path).isDirectory ? path : dirname(path);
          let config = await makeConfig({
            ...cmd,
            currentPath: basePath,
            ignoreResources,
            stage
          });
          if (!existsSync(join(basePath, "config.json")))
            writeConfig(config, basePath);
          let r = ignoreResources
            ? {
                ...config
              }
            : {
                ...config,
                ...(await getResources({ ...cmd, path: basePath, stage }))
              };
          o[k] = r;
        }
      }
    }
    if (getMyResources) {
      o = {
        ...o,
        ...(await getResources({ ...cmd, path: currentPath, stage }))
      };
    }
    o = Object.entries(o).reduce((out, [key, value]) => {
      if (typeof value === "string") {
        const newValue = mustache.render(value, { source: o, output: out });
        return { ...out, [key]: newValue };
      } else {
        return { ...out, [key]: newValue };
      }
    }, {});
  }
  process.chdir(oldPath);
  return o;
};
const writeConfig = (
  fromObject,
  toPath = process.cwd(),
  fileName = "config.json"
) => {
  const fullPath = join(toPath, fileName);
  writeFileSync(fullPath, JSON.stringify(fromObject, null, 2));
  return true;
};
module.exports = {
  writeConfig,
  getAccountID,
  makeConfig,
  getResources
};
