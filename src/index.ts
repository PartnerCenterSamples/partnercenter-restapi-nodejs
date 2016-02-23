'use strict';

import * as debug from 'debug';
import * as config from 'nconf';
import * as chalk from 'chalk';
import * as Q from 'q';
import {AadAuth} from './aadAuth';
import {PartnerCenterAuth} from './pcAuth';
import {PartnerCenterCustomers} from './pcCustomers';
import {PartnerCenterValidator} from './pcValidator';

// if in debug mode, load request module debugger to display
//  all request & response
import * as request from 'request';
if (process.execArgv.indexOf('--debug') > -1 ||
  process.execArgv.indexOf('--debug-brk') > -1) {
  require('request-debug')(request);
}

// setup a log 
let log: debug.Debugger = debug('partnercenter');

config.argv().env().file({ file: './config.json' });

let authAppOnly: boolean;
let aadToken: string;
let pcToken: string;

// prompt for the type of auth to use
authAppOnly = (config.get('auth-type') === 'apponly') ? true : false;
console.log(chalk.white('.. Authenticating the user as ') + chalk.blue(((authAppOnly) ? 'App Only' : 'App + User')));

// setup the correct authentication type
let aadAuth: AadAuth = new AadAuth();
let loginToAAD: any = (authAppOnly)
  ? aadAuth.loginAsAppOnly()
  : aadAuth.loginAsAppUserWithUsernamePassword();

// get access token 
console.log(chalk.white('Logging into Azure AD..'));
loginToAAD
  .then((token: string) => {
    // get the aad token
    aadToken = token;
    console.log(chalk.green('.. obtained AAD access token.'));

    // use aad token to request parter center token
    console.log(chalk.white('Obtaining Partner Center token..'));
    let pcAuth: PartnerCenterAuth = new PartnerCenterAuth();
    return pcAuth.login(aadToken);
  })
  .then((token: string) => {
    // get the partner center token
    pcToken = token;
    console.log(chalk.green('.. obtained Partner Center access token.'));

    // validate a domain availability
    let domainToCheck: string = 'wingtiptoys';
    console.log(chalk.white('Checking if the domain \'' + domainToCheck + '\' is available...'));
    let validator: PartnerCenterValidator = new PartnerCenterValidator(pcToken);
    return validator.checkDomain(domainToCheck);
  })
  .then((domainAvailable: boolean) => {
    if (domainAvailable) {
      console.log(chalk.green('.. domain is avaialble.'));
    } else {
      console.log(chalk.yellow('.. domain is NOT avaialble.'));
    }

    // use partner center token to get customers
    console.log(chalk.white('Getting list of customers...'));
    let pcCustomers: PartnerCenterCustomers = new PartnerCenterCustomers(pcToken);
    return pcCustomers.get();
  })
  .then((customers: any) => {
    let CliTable: any = require('cli-table');
    let table: any = new CliTable({
      head: ['ID', 'Name', 'Domain', 'Tenant ID']
    });
    // write customers out
    customers.forEach((customer: any) => {
      table.push([
        customer.id,
        customer.companyProfile.companyName,
        customer.companyProfile.domain,
        customer.companyProfile.tenantId
      ]);
    });
    console.log(table.toString());
  })
  .catch((error: Error) => {
    console.error(chalk.red('AN UNHANDLED ERROR OCCURRED >>>> \n' + error.message), error);
  })
  .finally(() => {
    console.log(chalk.white('Finished with Partner Center sample!'));
  });