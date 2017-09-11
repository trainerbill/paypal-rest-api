import * as joi from "joi";
import { Model } from "../abstracts";
import { Client, RequestOptions } from "../client";
import { WebhookApi } from "./api";
import { webhookSchema } from "./schemas";
import { IWebhook, IWebhookEventTypeListResponse, IWebhookListResponse } from "./types";

export class WebhookModel extends Model<IWebhook> {

    public static api: WebhookApi;
    public static schema = webhookSchema;

    public static async list(options: Partial<RequestOptions> = {}) {
        const response = await this.api.list(options);
        return (response.body as IWebhookListResponse).webhooks.map((webhook) => {
            return new this(webhook);
        });
    }

    public static init(client: Client) {
        const api = new WebhookApi(client);
        WebhookModel.api = api;
        WebhookModel.prototype.api = api;
    }

    constructor(public model: IWebhook) {
        super(model, WebhookModel.schema);
    }

    public async events(options: Partial<RequestOptions> = {}) {
        if (!this.model.id) {
            throw new Error("Model does not have an id.  Call create first");
        }
        const response = await this.api.events(this.model.id, options);
        this.model.event_types = response.body.event_types;
        return this;
    }
}
