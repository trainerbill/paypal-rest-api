import { Client } from "../client";
import { WebhookApi } from "./api";
import { WebhookModel } from "./model";

export class Webhook {
    public model = WebhookModel;
    public api: WebhookApi;

    constructor(private client: Client) {
        this.api = new WebhookApi(client);
        this.model.prototype.api = this.api;
    }
}
