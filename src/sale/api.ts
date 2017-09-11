import * as joi from "joi";
import { Api } from "../abstracts";
import { Client, RequestOptions } from "../client";
import {
    saleGetRequestSchema,
    saleIdSchema,
    saleRefundRequestSchema,
} from "./schemas";

export class SaleApi extends Api {

    public static paths = {
        get: `/v1/payments/sale/{id}`,
        refund: `/v1/payments/sale/{id}/refund`,
    };

    public static schemas = {
        get: saleGetRequestSchema,
        id: saleIdSchema,
        refund: saleRefundRequestSchema,
    };

    constructor(client: Client) {
        super(client, SaleApi.schemas, SaleApi.paths);
    }

    public refund(id: string, options: Partial<RequestOptions> = {}) {
        if (SaleApi.schemas.id) {
            id = this.schemaValidate(id, SaleApi.schemas.id);
        }

        options.uri = this.parsePath(SaleApi.paths.refund, { id });
        options = this.schemaValidate(options, SaleApi.schemas.refund);
        return this.client.request(options);
    }
}
