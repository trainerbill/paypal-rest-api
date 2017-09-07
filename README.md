[![Build Status](https://travis-ci.org/trainerbill/paypal-rest-api.svg?branch=master)](https://travis-ci.org/trainerbill/paypal-rest-api)
[![Coverage Status](https://coveralls.io/repos/github/trainerbill/paypal-rest-api/badge.svg?branch=master)](https://coveralls.io/github/trainerbill/paypal-rest-api?branch=master)
[![npm version](https://badge.fury.io/js/paypal-rest-api.svg)](https://badge.fury.io/js/paypal-rest-api)
[![Dependency Status](https://david-dm.org/trainerbill/paypal-rest-api.svg)](https://david-dm.org/trainerbill/paypal-rest-api)
[![devDependency Status](https://david-dm.org/trainerbill/paypal-rest-api/dev-status.svg)](https://david-dm.org/trainerbill/paypal-rest-api#info=devDependencies)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

## Introduction

This package is **NOT** supported by PayPal.  The current [PayPal Node SDK](https://github.com/paypal/PayPal-node-SDK) does not support the newest Javascript features.  This package is intended to support the most cutting edge Javascript features.

## Main Differences and Features
- Non-Singleton which allows for the use of multiple paypal rest applications.
    - Necessary for multi-currency support.
- Built on [requestretry](https://github.com/FGRibreau/node-request-retry) and [request](https://github.com/request/request)
    - Native Promise support
    - Retry failed api calls automatically using [paypal idempotency](https://developer.paypal.com/docs/integration/direct/express-checkout/integration-jsv4/best-practices/#process)
- Object modeling similar to Mongoose.
    - Additional validations.
    - Easy usage.  No need to worry about passing around ids.
    - Accepts all [requestretry](https://github.com/FGRibreau/node-request-retry) options.
- Api functions
    - Schema validation using Joi.  This improves efficiency by preventing invalid api calls from being submitted.
    - Accepts all [requestretry](https://github.com/FGRibreau/node-request-retry) options.
    - Returns a [request](https://github.com/request/request) response object
- Standalone client request function to submit to any paypal URL
    - Future proofs in case api functions are not available
    - Provides workarounds for schema false negatives
- Written in Typescript and exports types for use in other packages
- Store access token expiration date and check before sending request.  Currently the paypal sdk only updates the access token if the request fails.  This is more efficient.
- High Unit test coverage.
- Mocks for testing.

## Installation
```
npm install --save paypal-rest-api
```

## Typescript vs CommonJS
All examples in this README are using Typescript, however this module can be included in CommonJS(require) as well.  See the [common.js example](https://github.com/trainerbill/paypal-rest-api/blob/master/examples/commonjs) for how to use CommonJS with this module.

## Configuration
The most up to date configuration options can be found on the [IConfigureOptions interface](https://github.com/trainerbill/paypal-rest-api/blob/master/src/api/types.ts)
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
});
```

## Run an example
It is **STRONGLY** recommended to use VSCode for the debugger and breakpoints.  You must npm install first.

### Command line
use the npm run example script and pass in any file path from the [examples folder](https://github.com/trainerbill/paypal-rest-api/tree/master/examples).
```
npm install
npm run example -- examples/invoice/model/create-update-send-get.ts
```

### VSCode
Switch to the Debugger.  Open the example file you want to run, select the "Launch Example File" configuration and select run.

## Usage
There are 3 different methods to make API Calls. It is **STRONGLY** recommended to use the Model approach.  For full examples refer to the [examples folder](https://github.com/trainerbill/paypal-rest-api/tree/master/examples).

### Modeling
The modeling approach provides the most functionality.  By storing the information in a model we can validate additional information before making another api call.  For example, an invoice can only be deleted if it is in a DRAFT state.  Using modeling we can prevent the delete api call unless the status is DRAFT.  We also do not have to keep passing around ids since the information is stored on the model.

```
import { PayPalRestApi } from "paypal-rest-api";

const paypal = new PayPalRestApi({
    client_id: "YOUR_CLIENT_ID",
    client_secret: "YOUR_CLIENT_SECRET",
    mode: "sandbox",
});

const invoice = new paypal.invoice({
    merchant_info: {
        business_name: "testy",
    },
});
// Create an invoice, send it, delete will throw an exception before sending the api call.
invoice.create()
    .then(() => invoice.send())
    .then(() => invoice.delete())
    .catch((err) => console.log(err));
```

### Api Functions
All api functions are available on the models.  You can access them on the api property.  Each API function takes the requestretry options as an argument so you set the body property to your api payload.  Each API function returns a request response.  All api functions are validated via a schema.  Occasionally these may fail so please submit an issue.
```
import { PayPalRestApi } from "paypal-rest-api";

const paypal = new PayPalRestApi({
    client_id: "YOUR_CLIENT_ID",
    client_secret: "YOUR_CLIENT_SECRET",
    mode: "sandbox",
});

paypal.invoice.api.create({
    body: {
        merchant_info: {
            business_name: "testy",
        },
    }
})
    .then((response) => {
        return response.body.id;
    })
    .then((id) => paypal.invoice.api.send(id))
    .catch((err) => console.log(err));
```

### Request Method 
If an API function does not exist or you are getting a false negative on a schema validation, you can always use the request method to directly execute an API call to an endpoint.  You must specify the path, method, and more than likely the body.
```
import { PayPalRestApi } from "../src";

const paypal = new PayPalRestApi({
    client_id: "YOUR_CLIENT_ID",
    client_secret: "YOUR_CLIENT_SECRET",
    mode: "sandbox",
});

paypal.client.request({
    body: {
        merchant_info: {
            business_name: "testy",
        },
    },
    method: "POST",
    uri: "v1/invoicing/invoices/",
})
.then((response) => console.log(response))
.catch((err) => console.error(err));
```
