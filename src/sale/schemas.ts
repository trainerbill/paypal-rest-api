import * as joi from "joi";
import { paypalAmountSchema, paypalItemSchema } from "../payment/schemas";

export const saleIdSchema = joi.string().alphanum().min(1);

export const saleGetRequestSchema = joi.object({
    method: joi.string().default("GET"),
    uri: joi.string().required(),
});

export const saleRefundRequestSchema = joi.object({
    body: joi.object({
        amount: paypalAmountSchema.optional(),
        invoice_number: joi.string().max(127).optional(),
        items: joi.array().items(paypalItemSchema).min(1).optional(),
        payer_info: joi.any().optional(),
        refund_advice: joi.boolean().optional(),
        refund_source: joi.string().valid(["INSTANT_FUNDING_SOURCE", "ECHECK", "UNRESTRICTED"]).default("UNRESTRICTED"),
    }).default({}),
    method: joi.string().default("POST"),
    uri: joi.string().required(),
});
