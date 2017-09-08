import * as joi from "joi";
import { Api } from "../abstracts";
import { Client, RequestOptions } from "../client";
import {
    webhookCreateRequestSchema,
    webhookDeleteRequestSchema,
    webhookEventTypeListRequestSchema,
    webhookGetEventsRequestSchema,
    webhookGetRequestSchema,
    webhookIdSchema,
    webhookListRequestSchema,
    webhookUpdateRequestSchema,
} from "./schemas";
import { IWebhook, IWebhookRequestSchemas } from "./types";

export class WebhookApi extends Api {

    public static paths = {
        create: `/v1/notifications/webhooks`,
        delete: `/v1/notifications/webhooks/{id}`,
        events: `/v1/notifications/webhooks/{id}/event-types`,
        get: `/v1/notifications/webhooks/{id}`,
        list: `/v1/notifications/webhooks`,
        types: `/v1/notifications/webhooks-event-types`,
        update: `/v1/notifications/webhooks/{id}`,
    };

    public static schemas: IWebhookRequestSchemas = {
        create: webhookCreateRequestSchema,
        delete: webhookDeleteRequestSchema,
        events: webhookGetEventsRequestSchema,
        get: webhookGetRequestSchema,
        id: webhookIdSchema,
        list: webhookListRequestSchema,
        types: webhookEventTypeListRequestSchema,
        update: webhookUpdateRequestSchema,
    };

    constructor(client: Client) {
        super(client, WebhookApi.schemas, WebhookApi.paths);
    }

    public events(id: string, options: Partial<RequestOptions> = {}) {
        if (WebhookApi.schemas.id) {
            id = this.schemaValidate(id, WebhookApi.schemas.id);
        }

        options.uri = this.parsePath(WebhookApi.paths.events, { id });
        options = this.schemaValidate(options, WebhookApi.schemas.events);
        return this.client.request(options);
    }

    public types(options: Partial<RequestOptions> = {}) {
        options.uri = WebhookApi.paths.types;
        options = this.schemaValidate(options, WebhookApi.schemas.types);
        return this.client.request(options);
    }
}
