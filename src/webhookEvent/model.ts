import * as joi from "joi";
import { Model } from "../abstracts";
import { Client, RequestOptions } from "../client";
import { WebhookEventApi } from "./api";
import * as schemas from "./schemas";
import { IWebhookEvent, IWebhookEventListResponse, IWebhookSimulateRequestSchema } from "./types";

export class WebhookEventModel extends Model<IWebhookEvent> {

    public static api: WebhookEventApi;

    public static parseHeaders(headers: any) {
        const newHeaders: any = {};
        Object.keys(headers).forEach((key) => {
            newHeaders[key.toLowerCase()] = headers[key];
        });

        return {
            auth_algo: newHeaders["paypal-auth-algo"],
            cert_url: newHeaders["paypal-cert-url"],
            transmission_id: newHeaders["paypal-transmission-id"],
            transmission_sig: newHeaders["paypal-transmission-sig"],
            transmission_time: newHeaders["paypal-transmission-time"],
        };
    }

    public static async get(id: string, options: Partial<RequestOptions> = {}) {
        const response = await this.api.get(id, options);
        return new this(response.body);
    }

    public static async list(options: Partial<RequestOptions> = {}) {
        const response = await this.api.list(options);
        return (response.body as IWebhookEventListResponse).events.map((webhookEvent) => {
            return new this(webhookEvent);
        });
    }

    // tslint:disable-next-line:max-line-length
    public static async verify(webhookid: string, headers: any, webhookEvent: string, options: Partial<RequestOptions> = {}) {
        options.body = {
            webhook_event: webhookEvent,
            webhook_id: webhookid,
            ...WebhookEventModel.parseHeaders(headers),
        };

        return await this.api.verify(options);
    }

    public static async simulate(payload: IWebhookSimulateRequestSchema, options: Partial<RequestOptions> = {}) {
        options.body = payload;
        const response = await this.api.simulate(options);
        return new this(response.body);
    }

    public static init(client: Client) {
        const api = new WebhookEventApi(client);
        WebhookEventModel.api = api;
        WebhookEventModel.prototype.api = api;
    }

    constructor(public model: IWebhookEvent) {
        super(model);
    }

    public async resend(options: Partial<RequestOptions> = {}) {
        if (!this.model.id) {
            throw new Error("Model does not have an id.  Call create first");
        }

        const response = await this.api.resend(this.model.id, options);
        this.model = response.body;
    }
}
