import * as joi from "joi";
import { RequestRetryOptions } from "requestretry";
import { IConfigureOptions, IHelperRequestOptions } from "./api";
import * as schemas from "./joi";

export interface IHelper {
  options: RequestRetryOptions;
  path: string;
  schema?: joi.Schema;
}

export type helperMap = Map<string, (config: any) => IHelper>;

export const helpers: helperMap = new Map();

helpers.set("getAccessToken", (config) => {
    const schema = joi.object().keys({
        client_id: joi.string().required(),
        client_secret: joi.string().required(),
    });
    const validate = joi.validate(config, schema);
    if (validate.error) {
        throw validate.error;
    }
    config = validate.value;
    return {
        options: {
            auth: {
                password: config.client_secret,
                user: config.client_id,
            },
            form: {
                grant_type: "client_credentials",
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            json: true,
            method: "POST",
        },
        path: "v1/oauth2/token",
    };
});

helpers.set("createInvoice", (config) => {
    return {
        options: {
            json: true,
            method: "POST",
        },
        path: "v1/invoicing/invoices",
        schema: schemas.paypalInvoiceSchema,
    };
});

helpers.set("sendInvoice", (config) => {
    const schema = joi.object().keys({
        invoiceid: joi.string().required(),
        notify_merchant : joi.boolean().default(false),
    });
    const validate = joi.validate(config, schema);
    if (validate.error) {
        throw validate.error;
    }
    config = validate.value;
    return {
        options: {
            json: true,
            method: "POST",
        },
        path: `v1/invoicing/invoices/${config.invoiceid}/send`,
        qs: {
            notify_merchant: config.notify_merchant,
        },
    };
});

helpers.set("getInvoice", (config) => {
    const schema = joi.object().keys({
        invoiceid: joi.string().required(),
    });
    const validate = joi.validate(config, schema);
    if (validate.error) {
        throw validate.error;
    }
    config = validate.value;
    return {
        options: {
            method: "GET",
        },
        path: `v1/invoicing/invoices/${config.invoiceid}`,
    };
});

helpers.set("listInvoice", (config) => {
    return {
        options: {
            method: "GET",
        },
        path: `v1/invoicing/invoices`,
    };
});

helpers.set("searchInvoice", (config) => {
    return {
        options: {
            method: "POST",
        },
        path: `v1/invoicing/search`,
        schema: schemas.invoiceSearchRequestSchema,
    };
});

helpers.set("createPayment", (config) => {
    return {
        options: {
            method: "POST",
        },
        path: `v1/payments/payment`,
        schema: schemas.paypalPaymentSchema,
    };
});

helpers.set("verifyWebhook", (config) => {
    return {
        options: {
            method: "POST",
        },
        path: "v1/notifications/verify-webhook-signature",
    };
});
