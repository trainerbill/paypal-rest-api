import * as joi from "joi";
import * as common from "./common";

// tslint:disable:object-literal-sort-keys
export const invoiceSearchRequestSchema = joi.object().keys({
    email: joi.string().optional(),
    recipient_first_name: joi.string().optional(),
    recipient_last_name: joi.string().optional(),
    recipient_business_name: joi.string().optional(),
    number: joi.string().optional(),
    status : joi.array().valid([
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
    ]).min(1).optional(),
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
}).min(1);

export const paypalInvoiceItemsSchema = joi.object().keys({
    date: joi.date().empty("").optional(),
    description: joi.string().trim().empty("").max(1000).optional(),
    discount: common.paypalCostSchema.optional(),
    name: joi.string().trim().empty("").max(200).default("Item Name"),
    quantity: joi.number().greater(-10000).less(10000).required(),
    tax: common.paypalTaxSchema.optional(),
    unit_of_measure: joi.string().trim().empty("").valid(["QUANTITY", "HOURS", "AMOUNT"]).optional(),
    unit_price: common.paypalCurrencySchema.required(),
});

export const paypalInvoiceTermSchema = joi.object().min(1).keys({
    due_date: joi.date().empty("").optional(),
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

export const paypalInvoiceBillingInfoSchema = joi.object().keys({
    additional_info: joi.string().trim().empty("").max(40).optional(),
    address: common.paypalAddressSchema.optional(),
    business_name: joi.string().trim().empty("").max(100).optional(),
    email: joi.string().trim().empty("").max(260).optional(),
    first_name: joi.string().trim().empty("").max(30).optional(),
    language: joi.string().trim().empty("").max(5).optional(),
    last_name: joi.string().trim().empty("").max(30).optional(),
    phone: common.paypalPhoneSchema.optional(),
});

export const paypalInvoiceSchema = joi.object().keys({
    allow_tip: joi.boolean().default(false),
    billing_info: joi.array().min(1).items(paypalInvoiceBillingInfoSchema).optional(),
    cc_info: joi.array().items(
        joi.object().keys({
            email: joi.string().trim().empty("").optional(),
        }),
    ).optional(),
    custom: common.paypalCustomAmountSchema.optional(),
    discount: common.paypalCostSchema.optional(),
    invoice_date: joi.date().empty("").optional(),
    items: joi.array().min(1).items(paypalInvoiceItemsSchema).optional(),
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
    payment_term: paypalInvoiceTermSchema.optional(),
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

// tslint:enable:object-literal-sort-keys
