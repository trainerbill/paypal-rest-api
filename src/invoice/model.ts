import * as joi from "joi";
import { Model } from "../abstracts/model";
import { Client, RequestOptions } from "../client";
import { InvoiceApi } from "./api";
import * as schemas from "./schemas";
import {
    IInvoice,
    IInvoiceListResponse,
    IInvoiceRecordPaymentRequest,
    IInvoiceRecordRefundRequest,
    IInvoiceSearchRequest,
    IQrQueryParams,
} from "./types";

export class InvoiceModel extends Model<IInvoice> {

    public static api: InvoiceApi;

    public static async search(search: IInvoiceSearchRequest, options: Partial<RequestOptions> = {}) {
        options.body = search;
        const response = await this.prototype.api.search(options);
        return (response.body as IInvoiceListResponse).invoices.map((invoice) => {
            return new this(invoice);
        });
    }

    public static async list(options: Partial<RequestOptions> = {}) {
        const response = await this.prototype.api.list(options);
        return (response.body as IInvoiceListResponse).invoices.map((invoice) => {
            return new this(invoice);
        });
    }

    public static init(client: Client) {
        const api = new InvoiceApi(client);
        InvoiceModel.prototype.api = api;
        InvoiceModel.api = api;
    }

    public qrImage: any;

    constructor(public model: IInvoice) {
        super(model);
    }

    public validate() {
        const validate = joi.validate(this.model, schemas.invoiceSchema);
        if (validate.error) {
            throw validate.error;
        }
        return validate.value;
    }

    public async send(options: Partial<RequestOptions> = {}) {
        if (!this.model.id) {
            throw new Error("Model does not have an id.  Call create first");
        }
        const response = await InvoiceModel.api.send(this.model.id, options);
        // Call get to refresh the model since send api does not return anything.
        await this.get();
        return this;
    }

    public async remind(options: Partial<RequestOptions> = {}) {
        if (!this.model.id) {
            throw new Error("Model does not have an id.  Call create first");
        }
        const response = await InvoiceModel.api.remind(this.model.id, options);
        return this;
    }

    public async cancel(options: Partial<RequestOptions> = {}) {
        if (!this.model.id) {
            throw new Error("Model does not have an id.  Call create first");
        }
        const response = await InvoiceModel.api.cancel(this.model.id, options);
        return this;
    }

    // TODO:  This is kinda hacky but evidently you can't overload a methods arguments so just set the payload to model.
    public async update(payload = this.model, options?: Partial<RequestOptions>) {
        return super.update(this.model, options);
    }

    public async delete(options: Partial<RequestOptions> = {}) {
        if (this. model.status !== "DRAFT") {
            throw new Error(`Only draft invoices can be deleted`);
        }
        super.delete(options);
    }

    public async recordPayment(payment: IInvoiceRecordPaymentRequest, options: Partial<RequestOptions> = {}) {
        if (!this.model.id) {
            throw new Error("Model does not have an id.  Call create first");
        }
        options.body = payment;
        const response = await InvoiceModel.api.recordPayment(this.model.id, options);
        await this.get();
    }

    public async recordRefund(refund: IInvoiceRecordRefundRequest = {}, options: Partial<RequestOptions> = {}) {
        if (!this.model.id) {
            throw new Error("Model does not have an id.  Call create first");
        }
        options.body = refund;
        const response = await InvoiceModel.api.recordRefund(this.model.id, options);
        await this.get();
    }

    public async qr(opts: IQrQueryParams = {}, options: Partial<RequestOptions> = {}) {
        if (!this.model.id) {
            throw new Error("Model does not have an id.  Call create first");
        }
        options.qs = opts;
        const response = await InvoiceModel.api.qr(this.model.id, options);
        this.qrImage = response.image;
        return this.qrImage;
    }

    public async generateNumber(options: Partial<RequestOptions> = {}) {
        const response = await InvoiceModel.api.generateNumber(options);
        return response.number;
    }
}
