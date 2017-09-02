import * as joi from "joi";
import * as request from "request";
import * as retry from "requestretry";
import { Client, RequestMethod, RequestOptions } from "../client";
import * as schemas from "./schemas";
import * as types from "./types";

export class InvoiceApi {

    constructor(private client: Client) {}

    public get(id: string, options: Partial<RequestOptions> = {}) {
        const idValidate = joi.validate(id, schemas.invoiceIdSchema);
        if (idValidate.error) {
            throw idValidate.error;
        }
        options.uri = `/v1/invoicing/invoices/${idValidate.value}`;
        const validate = joi.validate(options, schemas.invoiceGetRequestSchema);
        if (validate.error) {
            throw validate.error;
        }
        return this.client.request(validate.value);
    }

    public list(options: Partial<RequestOptions> = {}) {
        const validate = joi.validate(options, schemas.invoiceListRequestSchema);
        if (validate.error) {
            throw validate.error;
        }
        return this.client.request(validate.value);
    }

    public search(options: Partial<RequestOptions> = {}) {
        const validate = joi.validate(options, schemas.invoiceSearchRequestSchema);
        if (validate.error) {
            throw validate.error;
        }
        return this.client.request(validate.value);
    }

    public create(options: Partial<RequestOptions> = {}) {
        const validate = joi.validate(options, schemas.invoiceCreateRequestSchema);
        if (validate.error) {
            throw validate.error;
        }
        return this.client.request(validate.value);
    }

    public send(id: string, options: Partial<RequestOptions> = {}) {
        const idValidate = joi.validate(id, schemas.invoiceIdSchema);
        if (idValidate.error) {
            throw idValidate.error;
        }
        options.uri = `/v1/invoicing/invoices/${idValidate.value}/send`;
        const validate = joi.validate(options, schemas.invoiceSendRequestSchema);
        if (validate.error) {
            throw validate.error;
        }
        return this.client.request(validate.value);
    }

    public remind(id: string, options: Partial<RequestOptions> = {}) {
        const idValidate = joi.validate(id, schemas.invoiceIdSchema);
        if (idValidate.error) {
            throw idValidate.error;
        }
        options.uri = `/v1/invoicing/invoices/${idValidate.value}/remind`;
        const validate = joi.validate(options, schemas.invoiceRemindRequestSchema);
        if (validate.error) {
            throw validate.error;
        }
        return this.client.request(validate.value);
    }

    public cancel(id: string, options: Partial<RequestOptions> = {}) {
        const idValidate = joi.validate(id, schemas.invoiceIdSchema);
        if (idValidate.error) {
            throw idValidate.error;
        }
        options.uri = `/v1/invoicing/invoices/${idValidate.value}/cancel`;
        const validate = joi.validate(options, schemas.invoiceCancelRequestSchema);
        if (validate.error) {
            throw validate.error;
        }
        return this.client.request(validate.value);
    }

    public delete(id: string, options: Partial<RequestOptions> = {}) {
        const idValidate = joi.validate(id, schemas.invoiceIdSchema);
        if (idValidate.error) {
            throw idValidate.error;
        }
        options.uri = `/v1/invoicing/invoices/${idValidate.value}`;
        const validate = joi.validate(options, schemas.invoiceDeleteRequestSchema);
        if (validate.error) {
            throw validate.error;
        }
        return this.client.request(validate.value);
    }

    public update(id: string, options: Partial<RequestOptions> = {}) {
        const idValidate = joi.validate(id, schemas.invoiceIdSchema);
        if (idValidate.error) {
            throw idValidate.error;
        }
        options.uri = `/v1/invoicing/invoices/${idValidate.value}`;
        const validate = joi.validate(options, schemas.invoiceUpdateRequestSchema, {
            stripUnknown: true,
        });
        if (validate.error) {
            throw validate.error;
        }
        return this.client.request(validate.value);
    }

    public recordPayment(id: string, options: Partial<RequestOptions> = {}) {
        const idValidate = joi.validate(id, schemas.invoiceIdSchema);
        if (idValidate.error) {
            throw idValidate.error;
        }
        options.uri = `/v1/invoicing/invoices/${idValidate.value}/record-payment`;
        const validate = joi.validate(options, schemas.invoiceRecordPaymentRequestSchema);
        if (validate.error) {
            throw validate.error;
        }
        return this.client.request(validate.value);
    }

    public recordRefund(id: string, options: Partial<RequestOptions> = {}) {
        const idValidate = joi.validate(id, schemas.invoiceIdSchema);
        if (idValidate.error) {
            throw idValidate.error;
        }
        options.uri = `/v1/invoicing/invoices/${idValidate.value}/record-refund`;
        const validate = joi.validate(options, schemas.invoiceRecordRefundRequestSchema);
        if (validate.error) {
            throw validate.error;
        }
        return this.client.request(validate.value);
    }

    public qr(id: string, options: Partial<RequestOptions> = {}) {
        const idValidate = joi.validate(id, schemas.invoiceIdSchema);
        if (idValidate.error) {
            throw idValidate.error;
        }
        options.uri = `/v1/invoicing/invoices/${idValidate.value}/qr-code`;
        const validate = joi.validate(options, schemas.invoiceQrRequestSchema);
        if (validate.error) {
            throw validate.error;
        }
        return this.client.request(validate.value);
    }

    public generateNumber(options: Partial<RequestOptions> = {}) {
        const validate = joi.validate(options, schemas.invoiceGenerateNumberRequestSchema);
        if (validate.error) {
            throw validate.error;
        }
        return this.client.request(validate.value);
    }
}
