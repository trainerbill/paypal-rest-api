import * as joi from "joi";
import * as common from "../api/schemas";
import { IInvoiceRequestSchemas } from "./types";

// tslint:disable:object-literal-sort-keys
export const invoiceSearchRequestSchema = joi.object({
    body: joi.object({
        email: joi.string().optional(),
        recipient_first_name: joi.string().optional(),
        recipient_last_name: joi.string().optional(),
        recipient_business_name: joi.string().optional(),
        number: joi.string().optional(),
        status : joi.array().items(
            joi.string().valid([
                "DRAFT",
                "SENT",
                "PARTIALLY_PAID",
                "PAYMENT_PENDING",
                "PAID",
                "MARKED_AS_PAID",
                "CANCELLED",
                "REFUNDED",
                "PARTIALLY_REFUNDED",
                "MARKED_AS_REFUNDED",
                "UNPAID",
            ]),
        ).min(1).optional(),
        lower_total_amount: joi.string().optional(),
        upper_total_amount: joi.string().optional(),
        start_invoice_date: joi.string().optional(),
        end_invoice_date: joi.string().optional(),
        start_due_date: joi.string().optional(),
        end_due_date: joi.string().optional(),
        start_payment_date: joi.string().optional(),
        end_payment_date: joi.string().optional(),
        start_creation_date : joi.string().optional(),
        end_creation_date : joi.string().optional(),
        page: joi.number().min(0).optional(),
        page_size: joi.number().min(1).optional(),
        total_count_required: joi.boolean().optional(),
        archived: joi.boolean().optional(),
    }).min(1).optional(),
    method: joi.string().default("POST"),
    uri: joi.string().default("/v1/invoicing/search"),
});

export const invoiceListRequestSchema = joi.object({
    method: joi.string().default("GET"),
    uri: joi.string().default("/v1/invoicing/invoices"),
    qs: joi.object({
        page: joi.number().min(0).optional(),
        page_size: joi.number().min(1).optional(),
        total_count_required: joi.boolean().optional(),
    }).optional(),
});

export const invoiceGetRequestSchema = joi.object({
    method: joi.string().default("GET"),
    uri: joi.string().regex(/\/v1\/invoicing\/invoices\/.*/).required(),
});

export const invoiceIdSchema = joi.string().length(24);

export const invoiceItemsSchema = joi.object().keys({
    date: joi.string().empty("").optional(),
    description: joi.string().trim().empty("").max(1000).optional(),
    discount: common.paypalCostSchema.optional(),
    name: joi.string().trim().empty("").max(200).default("Item Name"),
    quantity: joi.number().greater(-10000).less(10000).required(),
    tax: common.paypalTaxSchema.optional(),
    unit_of_measure: joi.string().trim().empty("").valid(["QUANTITY", "HOURS", "AMOUNT"]).optional(),
    unit_price: common.paypalCurrencySchema.required(),
});

export const invoiceTermSchema = joi.object().min(1).keys({
    due_date: joi.string().empty("").optional(),
    term_type: joi.string().trim().empty("").valid([
        "DUE_ON_RECEIPT",
        "DUE_ON_DATE_SPECIFIED",
        "NET_10",
        "NET_15",
        "NET_30",
        "NET_45",
        "NET_60",
        "NET_90",
        "NO_DUE_DATE"]).optional(),
});

export const invoiceBillingInfoSchema = joi.object().keys({
    additional_info: joi.string().trim().empty("").max(40).optional(),
    address: common.paypalAddressSchema.optional(),
    business_name: joi.string().trim().empty("").max(100).optional(),
    email: joi.string().trim().empty("").max(260).optional(),
    first_name: joi.string().trim().empty("").max(30).optional(),
    language: joi.string().trim().empty("").max(5).optional(),
    last_name: joi.string().trim().empty("").max(30).optional(),
    phone: common.paypalPhoneSchema.empty({}).optional(),
});

export const invoiceSchema = joi.object().keys({
    allow_tip: joi.boolean().default(false),
    billing_info: joi.array().min(1).items(invoiceBillingInfoSchema).optional(),
    cc_info: joi.array().items(
        joi.object().keys({
            email: joi.string().trim().empty("").optional(),
        }),
    ).optional(),
    custom: common.paypalCustomAmountSchema.optional(),
    discount: common.paypalCostSchema.optional(),
    id: invoiceIdSchema.optional(),
    invoice_date: joi.string().empty("").optional(),
    items: joi.array().min(1).items(invoiceItemsSchema).optional(),
    logo_url: joi.string().trim().empty("").max(4000).optional(),
    merchant_info: joi.object().keys({
        address: common.paypalAddressSchema.optional(),
        business_name: joi.string().trim().empty("").max(100).optional(),
        email: joi.string().trim().empty("").max(260).optional(),
        first_name: joi.string().trim().empty("").max(256).optional(),
        last_name: joi.string().trim().empty("").max(256).optional(),
        phone: common.paypalPhoneSchema.optional(),
    }).optional(),
    merchant_memo: joi.string().trim().empty("").max(500).optional(),
    minimum_amount_due: common.paypalCurrencySchema.optional(),
    note: joi.string().trim().empty("").max(4000).optional(),
    number: joi.string().trim().empty("").optional(),
    payment_term: invoiceTermSchema.optional(),
    reference: joi.string().trim().empty("").max(60).optional(),
    shipping_info: joi.object().keys({
        address: common.paypalAddressSchema.optional(),
        business_name: joi.string().trim().empty("").max(100).optional(),
        first_name: joi.string().trim().empty("").max(256).optional(),
        last_name: joi.string().trim().empty("").max(256).optional(),
    }).optional(),
    tax_calculated_after_discount: joi.boolean().default(false),
    tax_inclusive: joi.boolean().default(false),
    template_id: joi.string().trim().empty("").optional(),
    terms: joi.string().trim().empty("").max(4000).optional(),
});

export const invoiceCreateRequestSchema = joi.object({
    body: invoiceSchema.required(),
    method: joi.string().default("POST"),
    uri: joi.string().default("/v1/invoicing/invoices"),
});

const invoiceAdditionalEmailParams = joi.object({
    subject: joi.string().optional(),
    note: joi.string().optional(),
    send_to_merchant: joi.boolean().default(true),
    cc_emails: joi.array().items(joi.string()).optional(),
});

export const invoiceRemindRequestSchema = joi.object({
    body: invoiceAdditionalEmailParams.default({}),
    method: joi.string().default("POST"),
    uri: joi.string().regex(/\/v1\/invoicing\/invoices\/.*\/remind/).required(),
});

export const invoiceCancelRequestSchema = joi.object({
    body: invoiceAdditionalEmailParams.keys({
        send_to_payer: joi.boolean().default(true),
    }).default(),
    method: joi.string().default("POST"),
    uri: joi.string().regex(/\/v1\/invoicing\/invoices\/.*\/cancel/).required(),
});

export const invoiceDeleteRequestSchema = joi.object({
    method: joi.string().default("DELETE"),
    uri: joi.string().regex(/\/v1\/invoicing\/invoices\/.*/).required(),
});

export const invoiceSendRequestSchema = joi.object({
    method: joi.string().default("POST"),
    qs: joi.object({
        notify_merchant: joi.boolean().default(true),
    }).optional(),
    uri: joi.string().regex(/\/v1\/invoicing\/invoices\/.*\/send/).required(),
});

export const invoiceUpdateRequestSchema = joi.object({
    body: invoiceSchema.required(),
    method: joi.string().default("PUT"),
    uri: joi.string().regex(/\/v1\/invoicing\/invoices\/.*/).required(),
});

export const invoiceRecordPaymentRequestSchema = joi.object({
    body: joi.object({
        method: joi.string().valid([
            "BANK_TRANSFER",
            "CASH",
            "CHECK",
            "CREDIT_CARD",
            "DEBIT_CARD",
            "PAYPAL",
            "WIRE_TRANSFER",
            "OTHER",
        ]).required(),
        date: joi.string().optional(),
        note: joi.string().optional(),
        amount: common.paypalCurrencySchema.optional(),
    }).required(),
    method: joi.string().default("POST"),
    uri: joi.string().regex(/\/v1\/invoicing\/invoices\/.*\/record-payment/).required(),
});

export const invoiceRecordRefundRequestSchema = joi.object({
    body: joi.object({
        date: joi.string().optional(),
        note: joi.string().optional(),
        amount: common.paypalCurrencySchema.optional(),
    }).default({}),
    method: joi.string().default("POST"),
    uri: joi.string().regex(/\/v1\/invoicing\/invoices\/.*\/record-refund/).required(),
});

export const invoiceQrRequestSchema = joi.object({
    method: joi.string().default("GET"),
    qs: joi.object({
        height: joi.number().min(150).max(500).default(500),
        width: joi.number().min(150).max(500).default(500),
    }).default(),
    uri: joi.string().regex(/\/v1\/invoicing\/invoices\/.*\/qr-code/).required(),
});

export const invoiceGenerateNumberRequestSchema = joi.object({
    method: joi.string().default("POST"),
    uri: joi.string().default("/v1/invoicing/invoices/next-invoice-number"),
});

// tslint:enable:object-literal-sort-keys
