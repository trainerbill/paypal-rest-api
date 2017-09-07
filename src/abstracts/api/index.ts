import * as joi from "joi";
import { Client, RequestOptions } from "../../client";
import { IApiPaths, IApiSchemas, UpdateRequest } from "./types";

export * from "./types";

export class Api<T> {

    constructor(protected client: Client, protected schemas: IApiSchemas, protected paths: IApiPaths) {}

    public async get(id: string, options: Partial<RequestOptions> = {}) {
        if (!this.paths.get) {
            throw new Error("Get path not available for this api");
        }
        if (this.schemas.id) {
            const idValidate = joi.validate(id, this.schemas.id);
            if (idValidate.error) {
                throw idValidate.error;
            }
            id = idValidate.value;
        }

        options.uri = this.paths.get.replace("{id}", id);
        const validate = joi.validate(options, this.schemas.get);
        if (validate.error) {
            throw validate.error;
        }
        return this.client.request(validate.value);
    }

    public create(options: Partial<RequestOptions> = {}) {
        if (!this.paths.create) {
            throw new Error("Create path not available for this api");
        }
        const validate = joi.validate(options, this.schemas.create);
        if (validate.error) {
            throw validate.error;
        }
        return this.client.request(validate.value);
    }

    public delete(id: string, options: Partial<RequestOptions> = {}) {
        if (!this.paths.delete) {
            throw new Error("Delete path not available for this api");
        }
        if (this.schemas.id) {
            const idValidate = joi.validate(id, this.schemas.id);
            if (idValidate.error) {
                throw idValidate.error;
            }
            id = idValidate.value;
        }
        options.uri = this.paths.delete.replace("{id}", id);
        const validate = joi.validate(options, this.schemas.delete);
        if (validate.error) {
            throw validate.error;
        }

        return this.client.request(validate.value);
    }

    public async list(options: Partial<RequestOptions> = {}) {
        if (!this.paths.list) {
            throw new Error("Get path not available for this api");
        }
        const validate = joi.validate(options, this.schemas.list);
        if (validate.error) {
            throw validate.error;
        }
        return this.client.request(validate.value);
    }

    public search(options: Partial<RequestOptions> = {}) {
        const validate = joi.validate(options, this.schemas.search);
        if (validate.error) {
            throw validate.error;
        }
        return this.client.request(validate.value);
    }

    public update(id: string, payload: UpdateRequest | T, options: Partial<RequestOptions> = {}) {
        if (!this.paths.update) {
            throw new Error("Get path not available for this api");
        }
        if (this.schemas.id) {
            const idValidate = joi.validate(id, this.schemas.id);
            if (idValidate.error) {
                throw idValidate.error;
            }
            id = idValidate.value;
        }
        options.uri = this.paths.update.replace("{id}", id);
        options.body = payload;
        const validate = joi.validate(options, this.schemas.update, {
            stripUnknown: true,
        });
        if (validate.error) {
            throw validate.error;
        }

        return this.client.request(validate.value);
    }

}
