import { Schema } from "joi";
import { Model } from "../abstracts";
import { Client, RequestOptions } from "../client";
import { PaymentApi } from "./api";
import { paymentSchema } from "./schemas";
import { IPayment, IPaymentListResponse } from "./types";

export class PaymentModel extends Model<IPayment> {

    public static api: PaymentApi;
    public static schema: Schema = paymentSchema;

    public static async get(id: string, options: Partial<RequestOptions> = {}) {
        const response = await this.api.get(id, options);
        return new this(response.body);
    }

    public static async list(options: Partial<RequestOptions> = {}) {
        const response = await this.api.list(options);
        return (response.body as IPaymentListResponse).payments.map((payment) => {
            return new this(payment);
        });
    }

    public static init(client: Client) {
        const api = new PaymentApi(client);
        PaymentModel.api = api;
        PaymentModel.prototype.api = api;
    }

    constructor(model: Partial<IPayment>) {
        super(model, PaymentModel.schema);
    }

    public async execute(options: Partial<RequestOptions> = {}) {
        if (!this.model.id) {
            throw new Error("Model does not have an id.  Call create first");
        }
        if (!this.model.payer.payer_info || !this.model.payer.payer_info.payer_id) {
            throw new Error("Model does not have a payer id.  Call get first");
        }
        options.body = {
            ...options.body,
            ...{
                payer_id: this.model.payer.payer_info.payer_id,
            },
        };
        const response = await this.api.execute(this.model.id, options);
        this.model = response.body;
        return this;
    }
}
