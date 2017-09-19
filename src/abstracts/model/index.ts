import { Schema } from "joi";
import { get as lget } from "lodash";
import { Client, RequestOptions } from "../../client";
import { Api, UpdateRequest } from "../api";
import { IModel } from "./types";

export * from "./types";

export abstract class Model<T> {

    public static api: Api;
    private _api: any;

    constructor(private _model: Partial<IModel & T>, private _schema?: Schema) { }

    get api() {
        return this._api;
    }

    set api(api) {
        this._api = api;
    }

    get model() {
        return this._model;
    }

    set model(model) {
        if (this._schema && model !== null) {
            model = this.api.schemaValidate(model, this._schema, { allowUnknown: true });
        }
        this._model = model;
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

    public getModelProperty(path: string) {
        return lget(this.model, path);
    }
}
