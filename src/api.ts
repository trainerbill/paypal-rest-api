import * as http from "http";
import * as joi from "joi";
import * as request from "request";
import * as retry from "requestretry";
// tslint:disable-next-line:no-submodule-imports
import * as uuid from "uuid/v1";
import * as types from "./apitypes";
import * as helpers from "./helpers";
import * as schemas from "./joi";

export interface IHelperRequestOptions extends retry.RequestRetryOptions {
  helperparams?: any;
}

export interface IConfigureOptions {
  client_id: string;
  client_secret: string;
  mode: string;
  requestOptions?: retry.RequestRetryOptions;
  validate?: boolean;
}

export interface IAccessToken {
  scope: string;
  access_token: string;
  token_type: string;
  app_id: string;
  expires_in: number;
  expiration?: number;
}

export class PayPalRestApi {
  private config: IConfigureOptions;
  private hostname: string;
  private accessToken: any;
  private accessTokenHelper: helpers.IHelper;

  constructor(config: IConfigureOptions) {
    const defaultRequestOptions: retry.RequestRetryOptions = {
      headers: {
        "Accept": "application/json",
        "Accept-Language": "en_US",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      json: true,
      maxAttempts: 1,
      promiseFactory: (resolver) => {
        return new Promise(resolver);
      },
    };
    this.hostname = config.mode === "production" ? "api.paypal.com" : "api.sandbox.paypal.com";
    config.requestOptions = {
      ...defaultRequestOptions,
      ...config.requestOptions,
    };
    const validateConfig = joi.validate(config, schemas.ConfigurationSchema);
    if (validateConfig.error) {
      throw validateConfig.error;
    }

    this.config = validateConfig.value;
    this.accessTokenHelper = helpers.helpers.get("getAccessToken")({
        client_id: this.config.client_id,
        client_secret: this.config.client_secret,
    });
  }

  public setAccessToken(token: IAccessToken) {
    token.expiration = new Date().setSeconds(token.expires_in);
    this.accessToken = token;
  }

  public async request(path: string, options?: retry.RequestRetryOptions) {
    if (this.accessTokenHelper.path !== path) {
      // tslint:disable-next-line:max-line-length
      if (!this.accessToken || !this.accessToken.access_token || !this.accessToken.expiration || this.accessTokenExpired()) {
        const res = await this.request(this.accessTokenHelper.path, this.accessTokenHelper.options);
        this.setAccessToken(res.body);
      }
      options.headers = {
        ...options.headers,
        ...{
          Authorization: `Bearer ${this.accessToken.access_token}`,
        },
      };
    }
    const uri = `https://${this.hostname}/${path}`;
    const requestOptions = {
      ...this.config.requestOptions,
      ...{
        headers: {
          "PAYPAL-REQUEST-ID": uuid(),
        },
        uri,
      },
      ...options,
    };

    // use the .post .get helpers for easy stubbing in tests
    let response;
    if (requestOptions.method === "POST") {
      response = await retry.post(requestOptions);
    } else if (requestOptions.method === "GET") {
      response = await retry.get(requestOptions);
    } else {
      throw new Error(`Method ${requestOptions.method} is not configured.`);
    }
    return (response as any);
  }

  public async execute(id: string, options?: IHelperRequestOptions) {
    const helper = helpers.helpers.get(id);
    if (!helper) {
      throw new Error(`${id} helper is not configured.  Use the request method instead.`);
    }
    const ihelper = helper(options.helperparams);

    if (this.config.validate && options && options.body && ihelper.schema) {
      const validate = joi.validate(options.body, ihelper.schema);
      if (validate.error) {
        throw validate.error;
      }
      options.body = validate.value;
    }
    return await this.request(ihelper.path, {
      ...ihelper.options,
      ...(options as retry.RequestRetryOptions),
    });
  }

  private accessTokenExpired() {
    if (Date.now() > this.accessToken.expiration) {
      return true;
    }
    return false;
  }
}
