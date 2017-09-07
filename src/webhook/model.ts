import * as joi from "joi";
import { Model } from "../abstracts";
import { Client, RequestOptions } from "../client";
import { WebhookApi } from "./api";
import * as schemas from "./schemas";
import { IWebhook, IWebhookEventTypeListResponse, IWebhookListResponse } from "./types";

export class WebhookModel extends Model<IWebhook> {

    public static api: WebhookApi;

    public static async list(options: Partial<RequestOptions> = {}) {
        const response = await WebhookModel.api.list(options);
        return (response.body as IWebhookListResponse).webhooks.map((webhook) => {
            return new this(webhook);
        });
    }

    public static async get(id: string, options: Partial<RequestOptions> = {}) {
        const response = await WebhookModel.api.get(id, options);
        return new this(response.body);
    }

    public static async types(options: Partial<RequestOptions> = {}) {
        const response = await WebhookModel.api.types(options);
        return (response.body as IWebhookEventTypeListResponse);
    }

    public static init(client: Client) {
        const api = new WebhookApi(client);
        WebhookModel.prototype.api = api;
        WebhookModel.api = api;
    }

    constructor(public model: IWebhook) {
        super(model);
    }

    public async events(options: Partial<RequestOptions> = {}) {
        if (!this.model.id) {
            throw new Error("Model does not have an id.  Call create first");
        }
        const response = await WebhookModel.api.events(this.model.id, options);
        this.model.event_types = response.body.event_types;
    }
}
