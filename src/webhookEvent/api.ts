import * as joi from "joi";
import { Api } from "../abstracts";
import { Client, RequestOptions } from "../client";
import {
    webhookEventGetRequestSchema,
    webhookEventIdSchema,
    webhookEventListRequestSchema,
    webhookEventResendRequestSchema,
    webhookEventSimulateRequestSchema,
    webhookEventVerifyRequestSchema,
} from "./schemas";
import * as types from "./types";

export class WebhookEventApi extends Api {

    public static paths = {
        get: `/v1/notifications/webhooks-events/{id}`,
        list: `/v1/notifications/webhooks-events`,
        resend: `/v1/notifications/webhooks-events/{id}/resend`,
        simulate: `/v1/notifications/simulate-event`,
        verify: `/v1/notifications/verify-webhook-signature`,
    };

    public static schemas = {
        get: webhookEventGetRequestSchema,
        id: webhookEventIdSchema,
        list: webhookEventListRequestSchema,
        resend: webhookEventResendRequestSchema,
        simulate: webhookEventSimulateRequestSchema,
        verify: webhookEventVerifyRequestSchema,
    };

    constructor(client: Client) {
        super(client, WebhookEventApi.schemas, WebhookEventApi.paths);
    }

    public resend(id: string, options: Partial<RequestOptions> = {}) {
        if (this.schemas.id) {
            id = this.schemaValidate(id, WebhookEventApi.schemas.id);
        }
        options.uri = this.parsePath(WebhookEventApi.paths.resend, { id });
        options = this.schemaValidate(options, WebhookEventApi.schemas.resend);
        return this.client.request(options);
    }

    public verify(options: Partial<RequestOptions> = {}) {
        options.uri = WebhookEventApi.paths.verify;
        options = this.schemaValidate(options, WebhookEventApi.schemas.verify);
        // Start making a string because of the invoice issue
        const stringy = JSON.stringify({
            auth_algo: options.body.auth_algo,
            cert_url: options.body.cert_url,
            transmission_id: options.body.transmission_id,
            transmission_sig: options.body.transmission_sig,
            transmission_time: options.body.transmission_time,
            webhook_id: options.body.webhook_id,
          });
          // tslint:disable-next-line:max-line-length
        options.body = stringy.slice(0, -1) + `,"webhook_event":${options.body.webhook_event}` +  "}";
        return this.client.request(options);
    }

    public simulate(options: Partial<RequestOptions> = {}) {
        options.uri = WebhookEventApi.paths.simulate;
        options = this.schemaValidate(options, WebhookEventApi.schemas.simulate);
        return this.client.request(options);
    }
}
