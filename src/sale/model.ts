import * as joi from "joi";
import { Model } from "../abstracts";
import { Client, RequestOptions } from "../client";
import { SaleApi } from "./api";
// import { ISale } from "./types";

export class SaleModel extends Model<any> {

    public static api: SaleApi;

    public static async get(id: string, options: Partial<RequestOptions> = {}) {
        const response = await this.api.get(id, options);
        return new this(response.body);
    }

    public static init(client: Client) {
        const api = new SaleApi(client);
        SaleModel.api = api;
        SaleModel.prototype.api = api;
    }

    constructor(public model: any) {
        super(model);
    }

    public async refund(options: Partial<RequestOptions> = {}) {
        if (!this.model.id) {
            throw new Error("Model does not have an id.  Call create first");
        }
        const response = await this.api.refund(this.model.id, options);
        this.model = response.body;
        return this;
    }
}
