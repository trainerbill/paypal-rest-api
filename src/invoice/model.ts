import { Schema } from "joi";
import { Model } from "../abstracts/model";
import { Client, RequestOptions } from "../client";
import { InvoiceApi } from "./api";
import { invoiceSchema } from "./schemas";
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
    public static schema: Schema = invoiceSchema;

    public static async get(id: string, options: Partial<RequestOptions> = {}) {
        const response = await this.api.get(id, options);
        return new this(response.body);
    }

    public static async search(search: IInvoiceSearchRequest, options: Partial<RequestOptions> = {}) {
        options.body = search;
        const response = await this.api.search(options);
        return (response.body as IInvoiceListResponse).invoices.map((invoice) => {
            return new this(invoice);
        });
    }

    public static async list(options: Partial<RequestOptions> = {}) {
        const response = await this.api.list(options);
        return (response.body as IInvoiceListResponse).invoices.map((invoice) => {
            return new this(invoice);
        });
    }

    public static async generate(options: Partial<RequestOptions> = {}) {
        const response = await this.api.generateNumber(options);
        return new this(response);
    }

    public static init(client: Client) {
        const api = new InvoiceApi(client);
        InvoiceModel.prototype.api = api;
        InvoiceModel.api = api;
    }

    public qrImage: any;

    constructor(public model: IInvoice) {
        super(model, InvoiceModel.schema);
    }

    public async send(options: Partial<RequestOptions> = {}) {
        if (!this.model.id) {
            throw new Error("Model id is invalid");
        }
        if (this.model.status !== "DRAFT") {
            throw new Error("Invalid Status");
        }
        const response = await this.api.send(this.model.id, options);
        // Call get to refresh the model since send api does not return anything.
        await this.get();
        return this;
    }

    public async remind(options: Partial<RequestOptions> = {}) {
        if (!this.model.id) {
            throw new Error("Model id is invalid");
        }
        const validStatuses = ["SENT"];
        if (validStatuses.indexOf(this.model.status) === -1) {
            throw new Error("Invalid Status");
        }
        const response = await this.api.remind(this.model.id, options);
        return this;
    }

    public async cancel(options: Partial<RequestOptions> = {}) {
        if (!this.model.id) {
            throw new Error("Model id is invalid");
        }
        const validStatuses = ["SENT"];
        if (validStatuses.indexOf(this.model.status) === -1) {
            throw new Error("Invalid Status");
        }
        const response = await this.api.cancel(this.model.id, options);
        return this;
    }

    // TODO:  This is kinda hacky but evidently you can't overload a methods arguments so just set the payload to model.
    public async update(payload = this.model, options?: Partial<RequestOptions>) {
        const validStatuses = ["DRAFT", "UNPAID", "SENT"];
        if (validStatuses.indexOf(this.model.status) === -1) {
            throw new Error("Invalid Status");
        }
        return super.update(payload, options);
    }

    public async delete(options: Partial<RequestOptions> = {}) {
        if (!this.model.id) {
            throw new Error("Model id is invalid");
        }
        if (this. model.status !== "DRAFT") {
            throw new Error(`Invalid status`);
        }
        return super.delete(options);
    }

    public async recordPayment(payment: IInvoiceRecordPaymentRequest, options: Partial<RequestOptions> = {}) {
        if (!this.model.id) {
            throw new Error("Model id is invalid");
        }
        const validStatuses = ["UNPAID", "SENT"];
        if (validStatuses.indexOf(this.model.status) === -1) {
            throw new Error("Invalid Status");
        }
        options.body = payment;
        const response = await this.api.recordPayment(this.model.id, options);
        await this.get();
    }

    public async recordRefund(refund: IInvoiceRecordRefundRequest = {}, options: Partial<RequestOptions> = {}) {
        if (!this.model.id) {
            throw new Error("Model id is invalid");
        }
        const validStatuses = ["UNPAID", "SENT"];
        if (validStatuses.indexOf(this.model.status) === -1) {
            throw new Error("Invalid Status");
        }
        options.body = refund;
        const response = await this.api.recordRefund(this.model.id, options);
        await this.get();
    }

    public async qr(opts: IQrQueryParams = {}, options: Partial<RequestOptions> = {}) {
        if (!this.model.id) {
            throw new Error("Model id is invalid");
        }
        options.qs = opts;
        const response = await this.api.qr(this.model.id, options);
        this.qrImage = response.image;
        return this.qrImage;
    }
}
