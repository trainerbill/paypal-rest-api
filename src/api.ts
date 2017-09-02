import * as http from "http";
import * as joi from "joi";
import * as request from "request";
import * as retry from "requestretry";
// tslint:disable-next-line:no-submodule-imports
import * as uuid from "uuid/v1";
import { Client, RequestOptions } from "./client";
import * as helpers from "./helpers";
import { Invoice } from "./invoice";
import { Oauth } from "./oauth";
import * as schemas from "./schemas";
import { Webhook } from "./webhook";

export interface IHelperRequestOptions extends retry.RequestRetryOptions {
    helperparams?: any;
}

export interface IConfigureOptions {
    client_id: string;
    client_secret: string;
    mode: string;
    requestOptions?: Partial<RequestOptions>;
}

export class PayPalRestApi {
    public invoice: Invoice;
    public webhook: Webhook;
    public client: Client;
    private config: IConfigureOptions;


    constructor(config: IConfigureOptions) {

        const validateConfig = joi.validate(config, schemas.ConfigurationSchema);
        if (validateConfig.error) {
            throw validateConfig.error;
        }
        this.config = validateConfig.value;

        if (config.mode === "sandbox") {
            this.config.requestOptions.baseUrl = "https://api.sandbox.paypal.com/";
        }

        this.client = new Client(this.config);
        this.invoice = new Invoice(this.client);
        this.webhook = new Webhook(this.client);
    }
}
