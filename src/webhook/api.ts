import * as joi from "joi";
import { Client, RequestOptions } from "../client";
import * as schemas from "./schemas";
import * as types from "./types";

export class WebhookApi {

    constructor(private client: Client) {}

    public get(id: string, options: Partial<RequestOptions> = {}) {
        const idValidate = joi.validate(id, schemas.webhookIdSchema);
        if (idValidate.error) {
            throw idValidate.error;
        }
        options.uri = `/v1/notifications/webhooks/${idValidate.value}`;
        const validate = joi.validate(options, schemas.webhookGetRequestSchema);
        if (validate.error) {
            throw validate.error;
        }
        return this.client.request(validate.value);
    }

    public create(options: Partial<RequestOptions> = {}) {
        const validate = joi.validate(options, schemas.webhookCreateRequestSchema);
        if (validate.error) {
            throw validate.error;
        }
        return this.client.request(validate.value);
    }

    public list(options: Partial<RequestOptions> = {}) {
        const validate = joi.validate(options, schemas.webhookListRequestSchema);
        if (validate.error) {
            throw validate.error;
        }
        return this.client.request(validate.value);
    }

    public update(id: string, payload: types.UpdateRequest, options: Partial<RequestOptions> = {}) {
        const idValidate = joi.validate(id, schemas.webhookIdSchema);
        if (idValidate.error) {
            throw idValidate.error;
        }
        options.uri = `/v1/notifications/webhooks/${idValidate.value}`;
        options.body = payload;
        const validate = joi.validate(options, schemas.webhookUpdateRequestSchema);
        if (validate.error) {
            throw validate.error;
        }

        return this.client.request(validate.value);
    }

    public delete(id: string, options: Partial<RequestOptions> = {}) {
        const idValidate = joi.validate(id, schemas.webhookIdSchema);
        if (idValidate.error) {
            throw idValidate.error;
        }
        options.uri = `/v1/notifications/webhooks/${idValidate.value}`;
        const validate = joi.validate(options, schemas.webhookDeleteRequestSchema);
        if (validate.error) {
            throw validate.error;
        }

        return this.client.request(validate.value);
    }
}
