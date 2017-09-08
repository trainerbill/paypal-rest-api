import * as joi from "joi";
import { Api } from "../abstracts";
import { Client, RequestOptions } from "../client";
import {
    createPaymentRequestSchema,
    executePaymentRequestSchema,
    getPaymentRequestSchema,
    listPaymentRequestSchema,
    paymentIdSchema,
    updatePaymentRequestSchema,
} from "./schemas";

export class PaymentApi extends Api {

    public static paths = {
        create: `/v1/payments/payment`,
        execute: `/v1/payments/payment/{id}/execute`,
        get: `/v1/payments/payment/{id}`,
        list: `/v1/payments/payment`,
        update: `/v1/payments/payment/{id}`,
    };

    public static schemas = {
        create: createPaymentRequestSchema,
        execute: executePaymentRequestSchema,
        get: getPaymentRequestSchema,
        id: paymentIdSchema,
        list: listPaymentRequestSchema,
        update: updatePaymentRequestSchema,
    };

    constructor(client: Client) {
        super(client, PaymentApi.schemas, PaymentApi.paths);
    }

    public execute(id: string, options: Partial<RequestOptions> = {}) {
        if (PaymentApi.schemas.id) {
            id = this.schemaValidate(id, PaymentApi.schemas.id);
        }

        options.uri = this.parsePath(PaymentApi.paths.execute, { id });
        options = this.schemaValidate(options, PaymentApi.schemas.execute);
        return this.client.request(options);
    }
}
