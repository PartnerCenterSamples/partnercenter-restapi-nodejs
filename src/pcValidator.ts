'use strict';

import * as http from 'http';
import * as debug from 'debug';
import * as config from 'nconf';
import * as Q from 'q';
import * as request from 'request';
import * as uuid from 'node-uuid';
let encoding: any = require('encoding');

export class PartnerCenterValidator {
  private log: debug.Debugger = debug('partnercenter');

  constructor(private partnerCenterToken: string) {
    this.log('.PartnerCenterValidator()');

    // load config
    config.argv().env().file({ file: './config.json' });
  }

  public checkDomain(domain: string): Q.Promise<boolean> {
    this.log('..PartnerCenterValidator().get()');

    let deferred: Q.Deferred<boolean> = Q.defer<boolean>();

    let queryUrl: string = 'https://partnercenterapi.store.microsoft.com/v1/validations/checkdomainavailability/' + domain;

    // create headers for the request
    let requestHeaders: request.Headers = <request.Headers>{
      'Authorization': 'Bearer ' + this.partnerCenterToken,
      'MS-Contract-Version': 'v1',
      'MS-CorrelationId': uuid.v4(),
      'MS-RequestId': uuid.v4(),
      'X-Locale': 'en-US'
    };

    // issue request
    request(queryUrl,
            <request.CoreOptions>{
              headers: requestHeaders,
              method: 'GET'
              },
            (error: any, response: http.IncomingMessage, body: any) => {
              if (error) {
                deferred.reject(error);
              } else {
                let stripped: string = body.substring(2, body.length);
                let converted: Buffer = encoding.convert(stripped, 'UTF-8', 'UTF-16');
                deferred.resolve((converted.toString() === 'true'));
              }
    });

    return deferred.promise;
  }
}
