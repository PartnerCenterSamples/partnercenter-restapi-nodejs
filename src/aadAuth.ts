'use strict';

import * as debug from 'debug';
import * as config from 'nconf';
import * as Q from 'q';
let adal: any = require('adal-node');

export class AadAuth {
  private log: debug.Debugger = debug('partnercenter');
  private logAad: debug.Debugger = debug('partnercenter:aad');

  constructor() {
    this.log('.AadAuth()');

    // load config
    config.argv().env().file({ file: './config.json' });

    // setup logging
    this._setupLogging();
  }

  /**
   * Obtain an Azure AD access token with app-only authentication.
   * 
   * @returns {Promise}
   * @resolves {string} - AAD access token.
   */
  public loginAsAppOnly(): Q.Promise<string> {
    this.log('..AadAuth.loginAsAppOnly()');

    let deferred: Q.Deferred<string> = Q.defer<string>();

    // build the login authority
    let adalAuthority: string = 'https://login.microsoftonline.com';
    let tenantId: string = config.get('aad-tenant-id');
    let authority: string = adalAuthority + '/' + tenantId;
    let authContext: any = new adal.AuthenticationContext(authority);

    // login as an app
    authContext.acquireTokenWithClientCredentials(
      config.get('aad-graph-resource-id'),
      config.get('aad-app-apponly-client-id'),
      config.get('aad-app-apponly-client-secret'),
      (error: Error, tokenResponse: any) => {
        if (error) {
          this.log('.. error obtaining token', error);
          deferred.reject(error);
        } else {
          this.log('.. obtained got token');
          deferred.resolve(tokenResponse.accessToken);
        }
      });

    return deferred.promise;
  }

  public loginAsAppUserWithUsernamePassword(): Q.Promise<string> {
    this.log('..AadAuth.loginAsAppUserWithUsernamePassword()');

    let deferred: Q.Deferred<string> = Q.defer<string>();

    // build the login authority
    let adalAuthority: string = 'https://login.microsoftonline.com';
    let tenantId: string = config.get('aad-tenant-id');
    let authority: string = adalAuthority + '/' + tenantId;
    let authContext: any = new adal.AuthenticationContext(authority);

    // login as a user
    authContext.acquireTokenWithUsernamePassword(
      config.get('partnercenter-resource-id'),
      config.get('partner-username'),
      config.get('partner-password'),
      config.get('aad-app-appuser-client-id'),
      (error: Error, tokenResponse: any) => {
        if (error) {
          this.log('.. error obtaining token', error);
          deferred.reject(error);
        } else {
          this.log('.. obtained JWT token');
          deferred.resolve(tokenResponse.accessToken);
        }
      });

    return deferred.promise;
  }

  private _setupLogging(): void {
    adal.Logging.setLoggingOptions({
      level: adal.Logging.LOGGING_LEVEL.INFO,
      log: (level: any, message: any, error: any): void => {
        if (error) {
          this.logAad(error);
        } else {
          this.logAad(message);
        }
      }
    });
  }
}
