const { STS } = require("aws-sdk");
const Path = require("path");
const fs = require("fs");
const getAccountID = async () => {
  const { Account } = await new STS().getCallerIdentity().promise();
  return Account;
};
const makeConfig = async ({ currentPath = process.cwd() }) => {
  let awsAccountId = await getAccountID();
  let o = { awsAccountId };
  //open the package.json\
  const packagePath = Path.join(currentPath, "package.json");
  if (fs.existsSync(packagePath)) {
    const { name, version, serverless } = JSON.parse(
      fs.readFileSync(packagePath, { encoding: "UTF8" })
    );
    o = { ...o, name, version, ...serverless };
  }
  return o;
};
const writeConfig = (
  fromObject,
  toPath = process.cwd(),
  fileName = "config.json"
) => {
  const fullPath = Path.join(toPath, fileName);
  fs.writeFileSync(fullPath, JSON.stringify(fromObject));
  return true;
};
module.exports = {
  writeConfig,
  getAccountID,
  makeConfig
};
