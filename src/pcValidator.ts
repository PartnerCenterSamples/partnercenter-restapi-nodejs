'use strict';

import * as http from 'http';
import * as debug from 'debug';
import * as config from 'nconf';
import * as Q from 'q';
import * as request from 'request';
import * as uuid from 'node-uuid';

let utf8: any = require('utf8');

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
              encoding: null,
              headers: requestHeaders,
              method: 'GET'
              },
            (error: any, response: http.IncomingMessage, body: Buffer) => {
              if (error) {
                deferred.reject(error);
              } else {
                let StringDecoder: any = require('string_decoder').StringDecoder;
                let decoder: any = new StringDecoder('utf8');
                let decodedBody: any = decoder.write(body);
                console.log('body decoded', decodedBody);
                let tweakedBody: string = decodedBody.substring(2, decodedBody.length);
                console.log('tweaked', tweakedBody);
                tweakedBody = tweakedBody.toLowerCase();
                console.log('true=', tweakedBody);
                // this should be true! clearly something is odd with the `tweakedBody` contents... it's not a valid 'true' string
                console.log('evaluated', (tweakedBody === 'true'));
                deferred.resolve(false);
              }
    });

    return deferred.promise;
  }
}
