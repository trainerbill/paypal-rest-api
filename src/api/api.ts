import * as http from "http";
import * as joi from "joi";
import * as request from "request";
import * as retry from "requestretry";
// tslint:disable-next-line:no-submodule-imports
import * as uuid from "uuid/v1";
import { Client, RequestOptions } from "../client";
import Invoice from "../invoice";
import { Oauth } from "../oauth";
import Webhook from "../webhook";
import WebhookEvent from "../webhookEvent";
import * as schemas from "./schemas";

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
    public invoice = Invoice;
    public webhook = Webhook;
    public webhookEvent = WebhookEvent;
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
        Invoice.init(this.client);
        Webhook.init(this.client);
        WebhookEvent.init(this.client);
    }
}
