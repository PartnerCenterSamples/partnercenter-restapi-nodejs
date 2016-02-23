'use strict';

import * as http from 'http';
import * as https from 'https';
import * as debug from 'debug';
import * as config from 'nconf';
import * as Q from 'q';
import * as request from 'request';
import * as uuid from 'node-uuid';

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

    // let requestHeaders: any = {
    //   'Authorization': 'Bearer ' + this.partnerCenterToken,
    //   'MS-Contract-Version': 'v1',
    //   'MS-CorrelationId': uuid.v4(),
    //   'MS-RequestId': uuid.v4(),
    //   'X-Locale': 'en-US'
    // };

    // let requestOptions: https.RequestOptions = <https.RequestOptions>{
    //   headers: requestHeaders,
    //   hostname: 'partnercenterapi.store.microsoft.com',
    //   method: 'GET',
    //   path: '/v1/customers',
    //   port: 443
    // };

    // let request: http.ClientRequest = https.request(requestOptions, (response: http.IncomingMessage) => {
    //   let str: string = '';
    //   response.on('data', (chunk: string) => {
    //     str += chunk;
    //   });
    //   response.on('end', () => {
    //     console.log('raw response: ' + str);
    //     str = str.substring(2, str.length);
    //     console.log('tweaked response: ' + str);
    //     let json: any = JSON.parse(str);
    //     console.log('parsed response: ' + json);
    //   });
    // });
    // request.end();
    // request.on('error', (error: Error) => {
    //   deferred.reject(error);
    // });

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
                let json: string = body;
                json = json.replace(/\\u0000/g, '').substring(2, json.length-1);
                console.log('json2',json);
                let parsed: any = JSON.parse(json);
                console.log('parsed',parsed);
                deferred.resolve(body);
              }
            });

    return deferred.promise;
  }
}
