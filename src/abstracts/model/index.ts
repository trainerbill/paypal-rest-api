import { Client, RequestOptions } from "../../client";
import { Api, UpdateRequest } from "../api";
import { IModel } from "./types";

export * from "./types";

export class Model<T> {

    public static api: any;

    public static async get(id: string, options: Partial<RequestOptions> = {}) {
        const response = Model.api.get(id, options);
        return new this(response.body);
    }

    private _api: any;

    constructor(public model: IModel & T) {
        if (!(this.api)) {
            throw new Error("Api static not set");
        }
    }

    get api() {
        return this._api;
    }

    set api(api) {
        this._api = api;
    }

    public async create(options: Partial<RequestOptions> = {}) {
        if (this.model.id) {
            // Webhook is already created
            return this;
        }
        options.body = this.model;
        const response = await this.api.create(options);
        this.model = response.body;
        return this;
    }

    public async update(payload?: UpdateRequest | T, options: Partial<RequestOptions> = {}) {
        if (!this.model.id) {
            throw new Error("Model does not have an id.  Call create first");
        }
        const response = await this.api.update(this.model.id, payload, options);
        this.model = response.body;
        return this;
    }

    public async delete(options: Partial<RequestOptions> = {}) {
        if (!this.model.id) {
            throw new Error("Model does not have an id.  Call create first");
        }
        const response = await this.api.delete(this.model.id, options);
        this.model = null;
        return this;
    }

    public async get(options: Partial<RequestOptions> = {}) {
        if (!this.model.id) {
            throw new Error("Model does not have an id.  Call create first");
        }
        const response = await this.api.get(this.model.id, options);
        this.model = response.body;
        return this;
    }
}
