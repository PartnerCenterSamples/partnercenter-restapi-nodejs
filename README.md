# Partner Center REST API with Node.js

Sample code calling the Partner Center REST API with Node.js. This sample demonstrates authenticating using either the app-only or app+user scenario. When the application is run, it will do the following:

1. Login to Azure AD & obtain an access token
1. Obtain an access token from the Partner Center REST API for use in future calls
1. Query the Partner Center REST API if a domain is available
1. Query the Partner Center REST API for all the current partner's customers

## Usage

1. Clone the repo:

  ```shell
  git clone https://github.com/PartnerCenterSamples/partnercenter-restapi-nodejs.git
  ```

1. Install NPM package dependencies:

  ```shell
  npm install
  ```

1. Run in normal mode...

  ```shell
  npm run start
  ```

  ... or in debug mode (*more on this below*)

  ```shell
  npm run start:debug
  ```

  > Refer to the `package.json` file for details on what each of these scripts runs for further control.

## Setup

The console application is authored in TypeScript that must be transpiled to JavaScript. Furthermore external type definitions are imported and managed using the [typings](https://www.npmjs.com/package/typings) project. Therefore you need to install two NPM modules. These can be installed locally, but since they are typically used across many projects, it's recommended you install them globally with the `--global | -g` flag:

  ```shell
  npm install -g typescript typings
  ```

### Configuration

The console app does not prompt the user for any input, rather the run is controlled by a configuration file in the root: `config.json`. Refer to the following descriptions on how to configure the app.

#### Configurable Options

Key | Options | Value
---: | :---: | ---
**auth-type**                       | apponly &#124; appuser | How should the app authenticate with AAD, *apponly* or *app+user*?
**aad-tenant-id**                   | GUID   | ID of your Azure AD Tenant
**partner-username**                | string | Login username for your Partner Center AAD account (*only used in **app+user***).
**partner-password**                | string | Login password for your Partner Center AAD account (*only used in **app+user***).
**aad-app-appuser-client-id**       | GUID   | ID of the Azure AD native application (*only used in **app+user***).
**aad-app-apponly-client-id**       | GUID   | ID of the Azure AD application registered with Partner Center (*only used in **apponly***).
**aad-app-apponly-client-secret**   | string | Key of the Azure AD application registered with Partner Center (*only used in **apponly***).
