import * as joi from "joi";
import { updateRequestSchema } from "../api/schemas";
import { IWebhookRequestSchemas } from "./types";

export const webhookIdSchema = joi.string().alphanum().min(1);

export const webhookEventTypeNameSchema = joi.string().valid([
    "BILLING.PLAN.CREATED",
    "BILLING.PLAN.UPDATED",
    "BILLING.SUBSCRIPTION.CANCELLED",
    "BILLING.SUBSCRIPTION.CREATED",
    "BILLING.SUBSCRIPTION.RE-ACTIVATED",
    "BILLING.SUBSCRIPTION.SUSPENDED",
    "BILLING.SUBSCRIPTION.UPDATED",
    "CUSTOMER.DISPUTE.CREATED",
    "CUSTOMER.DISPUTE.RESOLVED",
    "CUSTOMER.DISPUTE.UPDATED",
    "IDENTITY.AUTHORIZATION-CONSENT.REVOKED",
    "INVOICING.INVOICE.CANCELLED",
    "INVOICING.INVOICE.CREATED",
    "INVOICING.INVOICE.PAID",
    "INVOICING.INVOICE.REFUNDED",
    "INVOICING.INVOICE.UPDATED",
    "MERCHANT.ONBOARDING.COMPLETED",
    "PAYMENT.AUTHORIZATION.CREATED",
    "PAYMENT.AUTHORIZATION.VOIDED",
    "PAYMENT.CAPTURE.COMPLETED",
    "PAYMENT.CAPTURE.DENIED",
    "PAYMENT.CAPTURE.PENDING",
    "PAYMENT.CAPTURE.REFUNDED",
    "PAYMENT.CAPTURE.REVERSED",
    "PAYMENT.ORDER.CANCELLED",
    "PAYMENT.ORDER.CREATED",
    "PAYMENT.PAYOUTS-ITEM.BLOCKED",
    "PAYMENT.PAYOUTS-ITEM.CANCELED",
    "PAYMENT.PAYOUTS-ITEM.DENIED",
    "PAYMENT.PAYOUTS-ITEM.FAILED",
    "PAYMENT.PAYOUTS-ITEM.HELD",
    "PAYMENT.PAYOUTS-ITEM.REFUNDED",
    "PAYMENT.PAYOUTS-ITEM.RETURNED",
    "PAYMENT.PAYOUTS-ITEM.SUCCEEDED",
    "PAYMENT.PAYOUTS-ITEM.UNCLAIMED",
    "PAYMENT.PAYOUTSBATCH.DENIED",
    "PAYMENT.PAYOUTSBATCH.PROCESSING",
    "PAYMENT.PAYOUTSBATCH.SUCCESS",
    "PAYMENT.SALE.COMPLETED",
    "PAYMENT.SALE.DENIED",
    "PAYMENT.SALE.PENDING",
    "PAYMENT.SALE.REFUNDED",
    "PAYMENT.SALE.REVERSED",
    "VAULT.CREDIT-CARD.CREATED",
    "VAULT.CREDIT-CARD.DELETED",
    "VAULT.CREDIT-CARD.UPDATED",
]);

export const webhookEventTypeSchema = joi.object({
    description: joi.string().optional(),
    name: webhookEventTypeNameSchema.required(),
    status: joi.string().optional(),
});

export const webhookEventTypesSchema = joi.array().min(1).items(webhookEventTypeSchema);

export const webhookSchema = joi.object({
    event_types: joi.array().items(
        joi.object({
            name: joi.string().valid(webhookEventTypeSchema),
        }),
    ).min(1).required(),
    url: joi.string().uri({
        scheme: [ "https" ],
    }).required(),
});

export const webhookCreateRequestSchema = joi.object({
    body: webhookSchema.required(),
    method: joi.string().default("POST"),
    uri: joi.string().default("/v1/notifications/webhooks"),
});

export const webhookGetRequestSchema = joi.object({
    method: joi.string().default("GET"),
    uri: joi.string().regex(/\/v1\/notifications\/webhooks\/.*/).required(),
});

export const webhookListRequestSchema = joi.object({
    method: joi.string().default("GET"),
    qs: joi.object({
        anchor_type: joi.string().valid(["APPLICATION", "ACCOUNT"]).default("APPLICATION"),
    }).default(),
    uri: joi.string().default("/v1/notifications/webhooks"),
});

export const webhookUpdateRequestSchema = joi.object({
    body: updateRequestSchema.required(),
    method: joi.string().default("PATCH"),
    uri: joi.string().regex(/\/v1\/notifications\/webhooks\/.*/).required(),
});

export const webhookDeleteRequestSchema = joi.object({
    method: joi.string().default("DELETE"),
    uri: joi.string().regex(/\/v1\/notifications\/webhooks\/.*/).required(),
});

export const webhookGetEventsRequestSchema = joi.object({
    method: joi.string().default("GET"),
    uri: joi.string().required(),
});

export const webhookEventTypeListRequestSchema = joi.object({
    method: joi.string().default("GET"),
    uri: joi.string().default(/\/v1\/notifications\/webhooks-event-types/),
});

export const webhookRequestSchemas: IWebhookRequestSchemas = {
    create: webhookCreateRequestSchema,
    delete: webhookDeleteRequestSchema,
    events: webhookGetEventsRequestSchema,
    get: webhookGetRequestSchema,
    id: webhookIdSchema,
    list: webhookListRequestSchema,
    types: webhookEventTypeListRequestSchema,
    update: webhookUpdateRequestSchema,
};

export default webhookRequestSchemas;
