import * as joi from "joi";
import { Client, RequestOptions } from "../../client";
import { IApiPaths, IApiSchemas, IPathReplacers, UpdateRequest } from "./types";

export * from "./types";

export class Api {

    constructor(private _client: Client, private _schemas: IApiSchemas, private _paths: IApiPaths) {}

    get client() {
        return this._client;
    }

    get schemas() {
        return this._schemas;
    }

    get paths() {
        return this._paths;
    }

    public async get(id: string, options: Partial<RequestOptions> = {}) {
        if (!this.paths.get) {
            throw new Error("Get path not available for this api");
        }
        if (this.schemas.id) {
            id = this.schemaValidate(id, this.schemas.id);
        }
        options.uri = this.parsePath(this.paths.get, { id });
        options = this.schemaValidate(options, this.schemas.get);
        return this.client.request(options);
    }

    public create(options: Partial<RequestOptions> = {}) {
        if (!this.paths.create) {
            throw new Error("Create path not available for this api");
        }
        options = this.schemaValidate(options, this.schemas.create);
        return this.client.request(options);
    }

    public delete(id: string, options: Partial<RequestOptions> = {}) {
        if (!this.paths.delete) {
            throw new Error("Delete path not available for this api");
        }
        if (this.schemas.id) {
            id = this.schemaValidate(id, this.schemas.id);
        }
        options.uri = this.parsePath(this.paths.delete, { id });
        options = this.schemaValidate(options, this.schemas.delete);
        return this.client.request(options);
    }

    public async list(options: Partial<RequestOptions> = {}) {
        if (!this.paths.list) {
            throw new Error("Get path not available for this api");
        }
        options = this.schemaValidate(options, this.schemas.list);
        return this.client.request(options);
    }

    public search(options: Partial<RequestOptions> = {}) {
        if (!this.paths.search) {
            throw new Error("Search path not available for this api");
        }
        options = this.schemaValidate(options, this.schemas.search);
        return this.client.request(options);
    }

    public update(id: string, payload: UpdateRequest | any, options: Partial<RequestOptions> = {}) {
        if (!this.paths.update) {
            throw new Error("Update path not available for this api");
        }
        if (this.schemas.id) {
            id = this.schemaValidate(id, this.schemas.id);
        }
        options.uri = this.parsePath(this.paths.update, { id });
        options.body = payload;
        options = this.schemaValidate(options, this.schemas.update, {
            stripUnknown: true,
        });
        return this.client.request(options);
    }

    protected schemaValidate(what: any, schema: joi.Schema, additional: joi.ValidationOptions = {}) {
        const validate = joi.validate(what, schema, additional);
        if (validate.error) {
            throw validate.error;
        }
        return validate.value;
    }

    protected parsePath(path: string, replacers: IPathReplacers) {
        const rpath = path.replace("{id}", replacers.id);
        return rpath;
    }

}
