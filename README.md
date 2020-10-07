
<a name="__climd"></a>

# Usage
```bash
serverless-setup [options]
```
# Options
* -p --currentPath \<`pathname`> Reference path for examining a serverlesss setup 
* -t --stage \<`stage`> Stack stage to check against. Defaul value is dev 
* -a --aws-profile \<`profile`> Named AWS Profile 
* -f --file-name [filename] File to write output (default config.json) 
* -s --standard-output Write to standard output instead of config.json 
* -n --stack-name \<`stackname`> Name of the stack/application (e.g. privilege, test-a, etc) 

<a name="librarymd"></a>


# @raydeck/serverless-setup - v3.0.0

## Index

### Variables

* [cachedAccountId](#let-cachedaccountid)

### Functions

* [getAccountID](#const-getaccountid)
* [makeConfig](#const-makeconfig)
* [writeConfig](#const-writeconfig)

## Variables

### `Let` cachedAccountId

• **cachedAccountId**: *string | undefined*

*Defined in [index.ts:8](https://github.com/rhdeck/serverless-setup/blob/e517068/src/index.ts#L8)*

## Functions

### `Const` getAccountID

▸ **getAccountID**(): *Promise‹string›*

*Defined in [index.ts:9](https://github.com/rhdeck/serverless-setup/blob/e517068/src/index.ts#L9)*

**Returns:** *Promise‹string›*

___

### `Const` makeConfig

▸ **makeConfig**(`__namedParameters`: object): *Promise‹object›*

*Defined in [index.ts:16](https://github.com/rhdeck/serverless-setup/blob/e517068/src/index.ts#L16)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type | Default |
------ | ------ | ------ |
`awsProfile` | string | - |
`cmd` | cmd | - |
`currentPath` | string | process.cwd() |
`fromName` | string | - |
`getMyResources` | boolean | false |
`ignoreResources` | boolean | false |
`stage` | string | "dev" |

**Returns:** *Promise‹object›*

___

### `Const` writeConfig

▸ **writeConfig**(`fromObject`: object, `toPath`: string, `fileName`: string): *boolean*

*Defined in [index.ts:106](https://github.com/rhdeck/serverless-setup/blob/e517068/src/index.ts#L106)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`fromObject` | object | - |
`toPath` | string | process.cwd() |
`fileName` | string | "config.json" |

**Returns:** *boolean*
