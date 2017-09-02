import * as joi from "joi";
import { Client, RequestOptions } from "../client";
import { InvoiceApi } from "./api";
import * as schemas from "./schemas";
import * as types from "./types";

export interface InvoiceModel {
    api: InvoiceApi;
}

export class InvoiceModel {

    public qrImage: any;

    constructor(public model: types.IInvoice) {}

    public validate() {
        const validate = joi.validate(this.model, schemas.invoiceSchema);
        if (validate.error) {
            throw validate.error;
        }
        return validate.value;
    }

    public async create(options: Partial<RequestOptions> = {}) {
        if (this.model.id) {
            // Invoice is already created
            return true;
        }
        options.body = this.model;
        const response = await this.api.create(options);
        this.model = response.body;
    }

    public async send(options: Partial<RequestOptions> = {}) {
        if (!this.model.id) {
            throw new Error("Model does not have an id.  Call create first");
        }
        const response = await this.api.send(this.model.id, options);
        // Call get to refresh the model since send api does not return anything.
        await this.get();
        return this;
    }

    public async remind(options: Partial<RequestOptions> = {}) {
        if (!this.model.id) {
            throw new Error("Model does not have an id.  Call create first");
        }
        const response = await this.api.remind(this.model.id, options);
        return this;
    }

    public async cancel(options: Partial<RequestOptions> = {}) {
        if (!this.model.id) {
            throw new Error("Model does not have an id.  Call create first");
        }
        const response = await this.api.cancel(this.model.id, options);
        return this;
    }

    public async get(options: Partial<RequestOptions> = {}) {
        if (!this.model.id) {
            throw new Error("Model does not have an id.  Call create first");
        }
        const response = await this.api.get(this.model.id, options);
        this.model = response.body;
    }

    public async update(options: Partial<RequestOptions> = {}) {
        if (!this.model.id) {
            throw new Error("Model does not have an id.  Call create first");
        }
        options.body = this.model;

        const response = await this.api.update(this.model.id, options);
        this.model = response.body;
    }

    public async delete(options: Partial<RequestOptions> = {}) {
        if (!this.model.id) {
            throw new Error("Model does not have an id.  Call create first");
        }
        if (this. model.status !== "DRAFT") {
            throw new Error(`Only draft invoices can be deleted`);
        }
        const response = await this.api.delete(this.model.id, options);
        this.model = {};
    }

    public async recordPayment(payment: types.IInvoiceRecordPaymentRequest, options: Partial<RequestOptions> = {}) {
        if (!this.model.id) {
            throw new Error("Model does not have an id.  Call create first");
        }
        options.body = payment;
        const response = await this.api.recordPayment(this.model.id, options);
        await this.get();
    }

    public async recordRefund(refund: types.IInvoiceRecordRefundRequest = {}, options: Partial<RequestOptions> = {}) {
        if (!this.model.id) {
            throw new Error("Model does not have an id.  Call create first");
        }
        options.body = refund;
        const response = await this.api.recordRefund(this.model.id, options);
        await this.get();
    }

    public async qr(opts: types.IQrQueryParams = {}, options: Partial<RequestOptions> = {}) {
        if (!this.model.id) {
            throw new Error("Model does not have an id.  Call create first");
        }
        options.qs = opts;
        const response = await this.api.qr(this.model.id, options);
        this.qrImage = response.image;
        return this.qrImage;
    }

    public async generateNumber(options: Partial<RequestOptions> = {}) {
        const response = await this.api.generateNumber(options);
        return response.number;
    }
}
