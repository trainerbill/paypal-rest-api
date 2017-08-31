[![Build Status](https://travis-ci.org/trainerbill/paypal-rest-api.svg?branch=master)](https://travis-ci.org/trainerbill/paypal-rest-api)
[![Coverage Status](https://coveralls.io/repos/github/trainerbill/paypal-rest-api/badge.svg?branch=master)](https://coveralls.io/github/trainerbill/paypal-rest-api?branch=master)
[![npm version](https://badge.fury.io/js/paypal-rest-api.svg)](https://badge.fury.io/js/paypal-rest-api)
[![Dependency Status](https://david-dm.org/trainerbill/paypal-rest-api.svg)](https://david-dm.org/trainerbill/paypal-rest-api)
[![devDependency Status](https://david-dm.org/trainerbill/paypal-rest-api/dev-status.svg)](https://david-dm.org/trainerbill/paypal-rest-api#info=devDependencies)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

## Introduction

This package is **NOT** supported by PayPal.  The current [PayPal Node SDK](https://github.com/paypal/PayPal-node-SDK) does not support the newest Javascript features.  This package is intended to support the most cutting edge Javascript features.

## Main Features

- Non-Singleton which allows for the use of multiple paypal rest applications.  Necessary for multi-currency support.
- Written in Typescript and provides [api types externally](https://github.com/trainerbill/paypal-rest-api/tree/master/src/apitypes)
- Native Promise support using the [request retry library](https://github.com/FGRibreau/node-request-retry)
- Retry failed api calls automatically using [request retry library](https://github.com/FGRibreau/node-request-retry) and [paypal idempotency](https://developer.paypal.com/docs/integration/direct/express-checkout/integration-jsv4/best-practices/#process)
- Store access token expiration date and check before sending request.  Currently the paypal sdk only updates the token if the request fails.  This is more efficient.
- Api Pre Validation using [Joi Schemas](https://github.com/trainerbill/paypal-rest-api/tree/master/src/joi).  This improves efficiency by preventing invalid api calls from being submitted.
- High Unit test coverage.
- Provide request function to submit any URL.  Future proofs in case helper method is not available.
- [Mocks](https://github.com/trainerbill/paypal-rest-api/tree/master/src/mocks) for testing.

## Installation
```
npm install --save paypal-rest-api
```

## Typescript vs CommonJS
All examples in this README are using Typescript, however this module can be included in CommonJS(require) as well.  See the [common.js example](https://github.com/trainerbill/paypal-rest-api/blob/master/examples/common.js) for how to use CommonJS with this module.

## Configuration
The most up to date configuration options can be found on the [IConfigureOptions interface](https://github.com/trainerbill/paypal-rest-api/blob/master/src/api.ts)
```
import { PayPalRestApi } from "../src";

const paypal = new PayPalRestApi({
    client_id: "",  // Your paypal client id
    client_secret": "", // Your paypal client secret
    mode: "sandbox", // "production" or "sandbox"
    requestOptions: {
        maxRetries: 2, // Sets the number of retries for 500 or Network timeout.  Set to 0 to disable.
        retryDelay: 5000, // Microseconds to wait until next retry.  5000 = 5 seconds
        // Any options from the following
        // https://github.com/FGRibreau/node-request-retry
        // https://github.com/request/request
    },
    validate: true, // Turns on prevalidation.  set to false if your validations are false negative.  Only available in execute method.
});
```

## Run an example
It is **STRONGLY** recommended to use VSCode for the debugger and breakpoints.

### Command line
```
// "examples/ANY_FILE_IN_EXAMPLES_FOLDER"
npm run example -- examples/request
```

### VSCode
Switch to the Debugger.  Open the example file you want to run, select the "Launch Example File" configuration and select run.

## Usage
There are 2 different methods to make API Calls. For full examples refer to the [examples folder](https://github.com/trainerbill/paypal-rest-api/tree/master/examples).  View the [common.js file](https://github.com/trainerbill/paypal-rest-api/tree/master/examples/common.js) for a CommonJS example using require.

### Execute Method
The execute method can be executed for any api call that has a [helper method](https://github.com/trainerbill/paypal-rest-api/tree/master/examples/src/helpers.ts).
```
import { PayPalRestApi } from "../src";

const paypal = new PayPalRestApi({
    client_id: "YOUR_CLIENT_ID",
    client_secret: "YOUR_CLIENT_SECRET",
    mode: "sandbox",
});

paypal.execute("createInvoice", {
    body: {
        // https://developer.paypal.com/docs/api/invoicing/#invoices_create
        merchant_info: {
            business_name: "testy",
        },
    },
})
.then((response) => console.log)
.catch((err) => console.error);
```

### Request Method 
If a helper method does not exist you can always use the request method to directly execute an API call to an endpoint.  You must specify the path and method.

```
import { PayPalRestApi } from "../src";

const paypal = new PayPalRestApi({
    client_id: "YOUR_CLIENT_ID",
    client_secret: "YOUR_CLIENT_SECRET",
    mode: "sandbox",
});

paypal.request("v1/invoicing/invoices/", {
    body: {
        merchant_info: {
            business_name: "testy",
        },
    },
    method: "POST",
})
.then((response) => console.log)
.catch((err) => console.error);
```