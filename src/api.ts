import * as http from "http";
import * as joi from "joi";
import * as request from "request";
import * as retry from "requestretry";
// tslint:disable-next-line:no-submodule-imports
import * as uuid from "uuid/v1";
import * as types from "./apitypes";
import * as schemas from "./joi";

export type IRetryStrategy = (err: Error, response: http.IncomingMessage, body: any) => boolean;

export interface IRequestRetryOptions extends request.CoreOptions {
  maxAttempts?: number;
  retryDelay?: number;
  retryStrategy?: IRetryStrategy;
}

export interface IConfigureOptions {
  client_id: string;
  client_secret: string;
  mode: string;
  requestOptions?: IRequestRetryOptions;
}

interface IAccessTokenResponse {
  scope: string;
  access_token: string;
  token_type: string;
  app_id: string;
  expires_in: string;
  expiration?: Date;
}

export interface IApiConfiguration {
  options: IRequestRetryOptions;
  path: string;
  schema?: joi.Schema;
}

export class PayPalRestApi {
  private config: IConfigureOptions;
  private hostname: string;
  private accessToken: any;
  private retriableErrors = [
    "ECONNRESET",
    "ENOTFOUND",
    "ESOCKETTIMEDOUT",
    "ETIMEDOUT",
    "ECONNREFUSED",
    "EHOSTUNREACH",
    "EPIPE",
    "EAI_AGAIN",
  ];
  private apis: Map<string, IApiConfiguration> = new Map();

  constructor(config: IConfigureOptions) {
    const defaultRequestOptions: IRequestRetryOptions = {
      headers: {
        "Accept": "application/json",
        "Accept-Language": "en_US",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      json: true,
      maxAttempts: 1,
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

    this.apis.set("getAccessToken", {
      options: {
        auth: {
          password: this.config.client_secret,
          user: this.config.client_id,
        },
        form: {
          grant_type: "client_credentials",
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        json: true,
        method: "POST",
      },
      path: "v1/oauth2/token",
    });

    this.apis.set("createInvoice", {
      options: {
        json: true,
        method: "POST",
      },
      path: "v1/invoicing/invoices",
      schema: schemas.paypalInvoiceSchema,
    });
  }

  public async request(path: string, options?: IRequestRetryOptions) {
    if (this.apis.get("getAccessToken").path !== path) {
      // tslint:disable-next-line:max-line-length
      if (!this.accessToken || !this.accessToken.access_token || !this.accessToken.expiration || Date.now() > this.accessToken.expiration) {
        this.accessToken = await this.execute("getAccessToken");
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
    }
    return (response as any);
  }

  public async execute(id: string, options?: IRequestRetryOptions) {
    const api = this.apis.get(id);
    if (!api) {
      throw new Error(`${id} api is not configured.  Use the request method instead.`);
    }
    if (options && options.body && api.schema) {
      const validate = joi.validate(options.body, api.schema);
      if (validate.error) {
        throw validate.error;
      }
      options.body = validate.value;
    }
    return await this.request(api.path, {
        ...api.options,
        ...options,
      });
  }
}
