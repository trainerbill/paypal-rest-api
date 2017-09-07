import * as joi from "joi";
import { Client, RequestOptions } from "../../client";
import { Api, UpdateRequest } from "../api";
import { IModel } from "./types";

export * from "./types";

export class Model<T> {

    public static async get(id: string, options: Partial<RequestOptions> = {}) {
        const response = await this.prototype.api.get(id, options);
        return new this(response.body);
    }

    public api: Api<T>;

    constructor(public model: IModel & T) {}

    public validate(schema: joi.Schema) {
        const validate = joi.validate(this.model, schema);
        if (validate.error) {
            throw validate.error;
        }
        return validate.value;
    }

    public async create(options: Partial<RequestOptions> = {}) {
        if (this.model.id) {
            // Webhook is already created
            return true;
        }
        options.body = this.model;
        const response = await this.api.create(options);
        this.model = response.body;
    }

    public async update(payload?: UpdateRequest | T, options: Partial<RequestOptions> = {}) {
        if (!this.model.id) {
            throw new Error("Model does not have an id.  Call create first");
        }
        const response = await this.api.update(this.model.id, payload, options);
        this.model = response.body;
    }

    public async delete(options: Partial<RequestOptions> = {}) {
        if (!this.model.id) {
            throw new Error("Model does not have an id.  Call create first");
        }
        const response = await this.api.delete(this.model.id, options);
        this.model = null;
    }

    public async get(options: Partial<RequestOptions> = {}) {
        if (!this.model.id) {
            throw new Error("Model does not have an id.  Call create first");
        }
        const response = await this.api.get(this.model.id, options);
        this.model = response.body;
    }
}
