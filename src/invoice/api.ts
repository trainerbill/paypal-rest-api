import * as joi from "joi";
import * as request from "request";
import * as retry from "requestretry";
import { Api } from "../abstracts/api";
import { Client, RequestMethod, RequestOptions } from "../client";
import {
    invoiceCancelRequestSchema,
    invoiceCreateRequestSchema,
    invoiceDeleteRequestSchema,
    invoiceGenerateNumberRequestSchema,
    invoiceGetRequestSchema,
    invoiceIdSchema,
    invoiceListRequestSchema,
    invoiceQrRequestSchema,
    invoiceRecordPaymentRequestSchema,
    invoiceRecordRefundRequestSchema,
    invoiceRemindRequestSchema,
    invoiceSearchRequestSchema,
    invoiceSendRequestSchema,
    invoiceUpdateRequestSchema,
 } from "./schemas";
import { IInvoice } from "./types";

export class InvoiceApi extends Api {

    public static paths = {
        cancel: `/v1/invoicing/invoices/{id}/cancel`,
        create: `/v1/invoicing/invoices`,
        delete: `/v1/invoicing/invoices/{id}`,
        generateNumber: `/v1/invoicing/invoices/next-invoice-number`,
        get: `/v1/invoicing/invoices/{id}`,
        list: `/v1/invoicing/invoices`,
        qr: `/v1/invoicing/invoices/{id}/qr-code`,
        recordPayment: `/v1/invoicing/invoices/{id}/record-payment`,
        recordRefund: `/v1/invoicing/invoices/{id}/record-refund`,
        remind: `/v1/invoicing/invoices/{id}/remind`,
        search: `/v1/invoicing/search`,
        send: `/v1/invoicing/invoices/{id}/send`,
        update: `/v1/invoicing/invoices/{id}`,
    };

    public static schemas = {
        cancel: invoiceCancelRequestSchema,
        create: invoiceCreateRequestSchema,
        delete: invoiceDeleteRequestSchema,
        generateNumber: invoiceGenerateNumberRequestSchema,
        get: invoiceGetRequestSchema,
        id: invoiceIdSchema,
        list: invoiceListRequestSchema,
        qr: invoiceQrRequestSchema,
        recordPayment: invoiceRecordPaymentRequestSchema,
        recordRefund: invoiceRecordRefundRequestSchema,
        remind: invoiceRemindRequestSchema,
        search: invoiceSearchRequestSchema,
        send: invoiceSendRequestSchema,
        update: invoiceUpdateRequestSchema,
    };

    constructor(client: Client) {
        super(client, InvoiceApi.schemas, InvoiceApi.paths);
    }

    public send(id: string, options: Partial<RequestOptions> = {}) {
        if (InvoiceApi.schemas.id) {
            id = this.schemaValidate(id, InvoiceApi.schemas.id);
        }
        options.uri = this.parsePath(InvoiceApi.paths.send, { id });
        options = this.schemaValidate(options, InvoiceApi.schemas.send);
        return this.client.request(options);
    }

    public remind(id: string, options: Partial<RequestOptions> = {}) {
        if (InvoiceApi.schemas.id) {
            id = this.schemaValidate(id, InvoiceApi.schemas.id);
        }
        options.uri = this.parsePath(InvoiceApi.paths.remind, { id });
        options = this.schemaValidate(options, InvoiceApi.schemas.remind);
        return this.client.request(options);
    }

    public cancel(id: string, options: Partial<RequestOptions> = {}) {
        if (InvoiceApi.schemas.id) {
            id = this.schemaValidate(id, InvoiceApi.schemas.id);
        }
        options.uri = this.parsePath(InvoiceApi.paths.cancel, { id });
        options = this.schemaValidate(options, InvoiceApi.schemas.cancel);
        return this.client.request(options);
    }

    public recordPayment(id: string, options: Partial<RequestOptions> = {}) {
        if (InvoiceApi.schemas.id) {
            id = this.schemaValidate(id, InvoiceApi.schemas.id);
        }
        options.uri = this.parsePath(InvoiceApi.paths.recordPayment, { id });
        options = this.schemaValidate(options, InvoiceApi.schemas.recordPayment);
        return this.client.request(options);
    }

    public recordRefund(id: string, options: Partial<RequestOptions> = {}) {
        if (InvoiceApi.schemas.id) {
            id = this.schemaValidate(id, InvoiceApi.schemas.id);
        }
        options.uri = this.parsePath(InvoiceApi.paths.recordRefund, { id });
        options = this.schemaValidate(options, InvoiceApi.schemas.recordRefund);
        return this.client.request(options);
    }

    public qr(id: string, options: Partial<RequestOptions> = {}) {
        if (InvoiceApi.schemas.id) {
            id = this.schemaValidate(id, InvoiceApi.schemas.id);
        }
        options.uri = this.parsePath(InvoiceApi.paths.qr, { id });
        options = this.schemaValidate(options, InvoiceApi.schemas.qr);
        return this.client.request(options);
    }

    public generateNumber(options: Partial<RequestOptions> = {}) {
        options.uri = InvoiceApi.paths.qr;
        options = this.schemaValidate(options, InvoiceApi.schemas.generateNumber);
        return this.client.request(options);
    }
}
