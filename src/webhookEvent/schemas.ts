import * as joi from "joi";
import { IApiSchemas } from "../abstracts/api";
import { webhookEventTypeNameSchema, webhookIdSchema } from "../webhook/schemas";
import { IWebhookEventApiSchemas } from "./types";

export const webhookEventIdSchema = joi.string().min(1);

export const webhookEventGetRequestSchema = joi.object({
    method: joi.string().default("GET"),
    uri: joi.string().regex(/\/v1\/notifications\/webhooks-events\/.*/).required(),
});

export const webhookEventListRequestSchema = joi.object({
    method: joi.string().default("GET"),
    qs: joi.object({
        end_time: joi.string().optional(),
        event_type: webhookEventTypeNameSchema.optional(),
        page_size: joi.number().min(1).default(10),
        start_time: joi.string().optional(),
        transaction_id: joi.string().optional(),
    }).default({}),
    uri: joi.string().default("/v1/notifications/webhooks-events"),
});

export const webhookEventResendRequestSchema = joi.object({
    body: joi.object({
        webhook_ids: joi.array().min(1).items(joi.string().alphanum().min(1)).optional(),
    }).default({}),
    method: joi.string().default("POST"),
    uri: joi.string().required(),
});

export const webhookEventVerifyRequestSchema = joi.object({
    body: joi.object({
        auth_algo: joi.string().required(),
        cert_url: joi.string().required(),
        transmission_id: joi.string().required(),
        transmission_sig: joi.string().required(),
        transmission_time: joi.string().required(),
        webhook_event: joi.string().required(),
        webhook_id: joi.string().required(),
    }).required(),
    headers: joi.object({
        "Content-Type": joi.string().default("application/json"),
    }).default(),
    json: joi.boolean().default(false),
    method: joi.string().default("POST"),
    uri: joi.string().default("/v1/notifications/verify-webhook-signature"),
});

export const webhookEventSimulateRequestSchema = joi.object({
    body: joi.object({
        event_type: webhookEventTypeNameSchema.required(),
        url: joi.string().uri({
            scheme: [ "https" ],
        }).optional(),
        webhook_id: joi.string().optional(),
    }).xor("url", "webhook_id").required(),
    method: joi.string().default("POST"),
    uri: joi.string().default("/v1/notifications/simulate-event"),
});
