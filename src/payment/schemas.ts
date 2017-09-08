import * as joi from "joi";
import { updateRequestSchema } from "../api/schemas";

export const paymentIdSchema = joi.string().regex(/PAY-[a-zA-Z0-9]*/);

export const paypalShippingAddressSchema = joi.object().keys({
    city: joi.string().trim().empty("").max(50).required(),
    country_code: joi.string().trim().empty("").length(2).default("US"),
    line1: joi.string().trim().empty("").max(100).required(),
    line2: joi.string().trim().empty("").max(100).optional(),
    phone: joi.string().trim().empty("").max(50).optional(),
    postal_code: joi.string().trim().empty("").max(20).required(),
    recipient_name: joi.string().trim().empty("").max(127).optional(),
    state: joi.string().trim().empty("").max(10).optional(),
    type: joi.string().trim().empty("").max(100).optional(),
});

export const paypalAmountSchema = joi.object().keys({
    currency: joi.string().trim().empty("").length(3).required(),
    details: joi.object().keys({
        gift_wrap: joi.string().trim().empty("").max(10).optional(),
        handling_fee: joi.string().trim().empty("").max(10).optional(),
        insurance: joi.string().trim().empty("").max(10).optional(),
        shipping: joi.string().trim().empty("").max(10).optional(),
        shipping_discount: joi.string().trim().empty("").max(10).optional(),
        subtotal: joi.string().trim().empty("").max(10).optional(),
        tax: joi.string().trim().empty("").max(10).optional(),
    }).optional(),
    total: joi.string().trim().empty("").max(10).required(),
});

export const paypalItemSchema = joi.object().keys({
    currency: joi.string().trim().empty("").length(3).default("USD"),
    description: joi.string().trim().empty("").max(127).optional(),
    name: joi.string().trim().empty("").max(127).optional(),
    price: joi.string().trim().empty("").max(10).required(),
    quantity: joi.string().trim().empty("").max(10).required(),
    sku: joi.string().trim().empty("").max(127).optional(),
    tax: joi.string().trim().empty("").max(10).optional(),
    url: joi.string().trim().empty("").max(10).optional(),
});

export const paypalItemListSchema = joi.object().keys({
    items: joi.array().items(paypalItemSchema).optional(),
    shipping_address: paypalShippingAddressSchema.optional(),
    shipping_method: joi.string().trim().empty("").max(100).optional(),
    shipping_phone_number: joi.string().trim().empty("").max(50).optional(),
});

export const transactionSchema = joi.object().keys({
    amount: paypalAmountSchema.required(),
    custom: joi.string().trim().empty("").max(127).optional(),
    description: joi.string().trim().empty("").max(127).optional(),
    invoice_number: joi.string().trim().empty("").max(127).optional(),
    item_list: paypalItemListSchema.optional(),
    note_to_payee: joi.string().trim().empty("").max(255).optional(),
    notify_url: joi.string().trim().empty("").max(2048).optional(),
    order_url: joi.string().trim().empty("").max(2048).optional(),
    payee: joi.object().keys({
        email: joi.string().trim().empty("").optional(),
        merchant_id: joi.string().trim().empty("").optional(),
    }).optional(),
    payer: joi.object().keys({
       payment_method: joi.string().valid("paypal").default("paypal"),
    }).optional(),
    payment_options: joi.object().keys({
        // tslint:disable-next-line:max-line-length
        allowed_payment_method: joi.string().trim().empty("").valid(["UNRESTRICTED", "INSTANT_FUNDING_SOURCE", "IMMEDIATE_PAY"]).required(),
    }).optional(),
    purchase_order: joi.string().trim().empty("").max(127).optional(),
    reference_id: joi.string().empty("").optional(),
    soft_descriptor: joi.string().trim().empty("").max(22).optional(),
});

export const paymentSchema = joi.object().keys({
    experience_profile_id: joi.string().trim().empty("").optional(),
    intent: joi.date().empty("").valid(["sale", "authorize", "order"]).required(),
    note_to_payer: joi.string().trim().empty("").max(165).optional(),
    payer: joi.object().keys({
       payment_method: joi.string().valid("paypal").default("paypal"),
    }).required(),
    redirect_urls: joi.object().keys({
        cancel_url: joi.string().trim().empty("").max(2048).required(),
        return_url: joi.string().trim().empty("").max(2048).required(),
    }).optional(),
    transactions: joi.array().items(transactionSchema).min(1).required(),
});

export const createPaymentRequestSchema = joi.object({
    body: paymentSchema.required(),
    method: joi.string().default("POST"),
    uri: joi.string().required(),
});

export const executePaymentRequestSchema = joi.object({
    body: joi.object({
        payer_id: joi.string().required(),
        transactions: joi.array().items(transactionSchema).optional(),
    }),
    method: joi.string().default("POST"),
    uri: joi.string().required(),
});

export const getPaymentRequestSchema = joi.object({
    method: joi.string().default("GET"),
    uri: joi.string().required(),
});

export const updatePaymentRequestSchema = joi.object({
    body: updateRequestSchema.required(),
    method: joi.string().default("PATCH"),
    uri: joi.string().required(),
});

export const listPaymentRequestSchema = joi.object({
    method: joi.string().default("GET"),
    qs: joi.object({
        count: joi.number().default(10),
        end_time: joi.string().optional(),
        payee_id: joi.string().optional(),
        sort_by: joi.string().default("create_time"),
        sort_order: joi.string().default("desc"),
        start_id: joi.string().optional(),
        start_time: joi.string().optional(),
    }).default(),
    uri: joi.string().required(),
});
