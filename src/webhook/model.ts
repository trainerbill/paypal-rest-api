import * as joi from "joi";
import { Client, RequestOptions } from "../client";
import { WebhookApi } from "./api";
import * as schemas from "./schemas";
import * as types from "./types";

// tslint:disable-next-line:interface-name
export interface WebhookModel {
    api: WebhookApi;
}

export class WebhookModel {

    constructor(public model: types.IWebhook | any) {}

    public validate() {
        const validate = joi.validate(this.model, schemas.webhookSchema);
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

    public async update(payload: types.UpdateRequest, options: Partial<RequestOptions> = {}) {
        if (!this.model.id) {
            throw new Error("Model does not have an id.  Call create first");
        }
        options.body = this.model;
        const response = await this.api.update(this.model.id, payload, options);
        this.model = response.body;
    }

    public async delete(options: Partial<RequestOptions> = {}) {
        if (!this.model.id) {
            throw new Error("Model does not have an id.  Call create first");
        }
        const response = await this.api.delete(this.model.id, options);
        this.model = {};
    }

    public async get(options: Partial<RequestOptions> = {}) {
        if (!this.model.id) {
            throw new Error("Model does not have an id.  Call create first");
        }
        const response = await this.api.get(this.model.id, options);
        this.model = response.body;
    }
}
