import * as joi from "joi";
import { Client } from "../client";
import Invoice from "../invoice";
import { Oauth } from "../oauth";
import Webhook from "../webhook";
import WebhookEvent from "../webhookEvent";
import { ConfigurationSchema } from "./schemas";
import { IConfigureOptions } from "./types";

export class PayPalRestApi {
    public invoice = Invoice;
    public webhook = Webhook;
    public webhookEvent = WebhookEvent;
    public client: Client;
    private config: IConfigureOptions;

    constructor(config: IConfigureOptions) {

        const validateConfig = joi.validate(config, ConfigurationSchema);
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
