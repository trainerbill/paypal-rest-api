import * as joi from "joi";
import * as request from "request";
import * as retry from "requestretry";
import { Api } from "../abstracts/api";
import { Client, RequestMethod, RequestOptions } from "../client";
import { invoiceRequestSchemas } from "./schemas";
import { IInvoice } from "./types";

export class InvoiceApi extends Api<IInvoice> {

    constructor(client: Client) {
        super(client, invoiceRequestSchemas, {
            create: `/v1/invoicing/invoices`,
            delete: `/v1/invoicing/invoices/{id}`,
            get: `/v1/invoicing/invoices/{id}`,
            list: `/v1/invoicing/invoices`,
            search: `/v1/invoicing/search`,
            update: `/v1/invoicing/invoices/{id}`,
        });
    }

    public send(id: string, options: Partial<RequestOptions> = {}) {
        const idValidate = joi.validate(id, invoiceRequestSchemas.id);
        if (idValidate.error) {
            throw idValidate.error;
        }
        options.uri = `/v1/invoicing/invoices/${idValidate.value}/send`;
        const validate = joi.validate(options, invoiceRequestSchemas.send);
        if (validate.error) {
            throw validate.error;
        }
        return this.client.request(validate.value);
    }

    public remind(id: string, options: Partial<RequestOptions> = {}) {
        const idValidate = joi.validate(id, invoiceRequestSchemas.id);
        if (idValidate.error) {
            throw idValidate.error;
        }
        options.uri = `/v1/invoicing/invoices/${idValidate.value}/remind`;
        const validate = joi.validate(options, invoiceRequestSchemas.remind);
        if (validate.error) {
            throw validate.error;
        }
        return this.client.request(validate.value);
    }

    public cancel(id: string, options: Partial<RequestOptions> = {}) {
        const idValidate = joi.validate(id, invoiceRequestSchemas.id);
        if (idValidate.error) {
            throw idValidate.error;
        }
        options.uri = `/v1/invoicing/invoices/${idValidate.value}/cancel`;
        const validate = joi.validate(options, invoiceRequestSchemas.cancel);
        if (validate.error) {
            throw validate.error;
        }

        return this.client.request(validate.value);
    }

    public recordPayment(id: string, options: Partial<RequestOptions> = {}) {
        const idValidate = joi.validate(id, invoiceRequestSchemas.id);
        if (idValidate.error) {
            throw idValidate.error;
        }
        options.uri = `/v1/invoicing/invoices/${idValidate.value}/record-payment`;
        const validate = joi.validate(options, invoiceRequestSchemas.recordPayment);
        if (validate.error) {
            throw validate.error;
        }
        return this.client.request(validate.value);
    }

    public recordRefund(id: string, options: Partial<RequestOptions> = {}) {
        const idValidate = joi.validate(id, invoiceRequestSchemas.id);
        if (idValidate.error) {
            throw idValidate.error;
        }
        options.uri = `/v1/invoicing/invoices/${idValidate.value}/record-refund`;
        const validate = joi.validate(options, invoiceRequestSchemas.recordRefund);
        if (validate.error) {
            throw validate.error;
        }
        return this.client.request(validate.value);
    }

    public qr(id: string, options: Partial<RequestOptions> = {}) {
        const idValidate = joi.validate(id, invoiceRequestSchemas.id);
        if (idValidate.error) {
            throw idValidate.error;
        }
        options.uri = `/v1/invoicing/invoices/${idValidate.value}/qr-code`;
        const validate = joi.validate(options, invoiceRequestSchemas.qr);
        if (validate.error) {
            throw validate.error;
        }
        return this.client.request(validate.value);
    }

    public generateNumber(options: Partial<RequestOptions> = {}) {
        const validate = joi.validate(options, invoiceRequestSchemas.generate);
        if (validate.error) {
            throw validate.error;
        }
        return this.client.request(validate.value);
    }
}
