'use strict';

import * as http from 'http';
import * as debug from 'debug';
import * as config from 'nconf';
import {Const} from './const';
import * as Q from 'q';
import * as request from 'request';
let urlEncode: any = require('form-urlencoded');

export class PartnerCenterAuth {
  private log: debug.Debugger = debug('partnercenter');

  constructor() {
    this.log('.PartnerCenterAuth()');

    // load config
    config.argv().env().file({ file: './config.json' });
  }

  public login(aadToken: string): Q.Promise<string> {
    this.log('..PartnerCenterAuth().login()');

    let deferred: Q.Deferred<string> = Q.defer<string>();

    // build request payload
    let payload: any = {
      client_id: config.get('aad-app-apponly-client-id'),
      grant_type: 'jwt_token'
    };
    let encodedPayload: string = urlEncode(payload);

    let queryUrl: string = Const.PartnerCenterApiEndpoint + '/GenerateToken';

    // create headers for the request
    let requestHeaders: request.Headers = <request.Headers>{
      'Authorization': 'Bearer ' + aadToken,
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': encodedPayload.length.toString()
    };

    // issue request
    request(queryUrl,
            <request.CoreOptions>{
              body: encodedPayload,
              headers: requestHeaders,
              method: 'POST'
            },
            (error: any, response: http.IncomingMessage, body: any) => {
              if (error) {
                deferred.reject(error);
              } else {
                // convert response to JSON
                let bodyObject: any = JSON.parse(body);
                // return token
                deferred.resolve(bodyObject.access_token);
              }
            }
    );

    return deferred.promise;
  }
}
