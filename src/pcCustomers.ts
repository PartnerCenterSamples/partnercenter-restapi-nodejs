'use strict';

import * as http from 'http';
import * as debug from 'debug';
import * as config from 'nconf';
import * as Q from 'q';
import * as request from 'request';
import * as uuid from 'node-uuid';
let encoding: any = require('encoding');

export class PartnerCenterCustomers {
  private log: debug.Debugger = debug('partnercenter');

  constructor(private partnerCenterToken: string) {
    this.log('.PartnerCenterCustomers()');

    // load config
    config.argv().env().file({ file: './config.json' });
  }

  public get(): Q.Promise<string> {
    this.log('..PartnerCenterCustomers().get()');

    let deferred: Q.Deferred<string> = Q.defer<string>();

    let queryUrl: string = 'https://partnercenterapi.store.microsoft.com/v1/customers';

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
                let json: any = JSON.parse(converted.toString());
                deferred.resolve(json.items);
              }
            });

    return deferred.promise;
  }
}
