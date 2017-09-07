import * as joi from "joi";
import { Api } from "../abstracts";
import { Client, RequestOptions } from "../client";
import schemas from "./schemas";
import * as types from "./types";

export class WebhookEventApi extends Api<types.IWebhookEvent> {

    constructor(client: Client) {
        super(client, schemas, {
            get: `/v1/notifications/webhooks-events/{id}`,
            list: `/v1/notifications/webhooks-events`,
        });
    }

    public resend(id: string, options: Partial<RequestOptions> = {}) {
        if (this.schemas.id) {
            const idValidate = joi.validate(id, this.schemas.id);
            if (idValidate.error) {
                throw idValidate.error;
            }
            id = idValidate.value;
        }

        options.uri = `/v1/notifications/webhooks-events/${id}/resend`;
        const validate = joi.validate(options, schemas.resend);
        if (validate.error) {
            throw validate.error;
        }
        return this.client.request(validate.value);
    }

    public verify(options: Partial<RequestOptions> = {}) {
        const validate = joi.validate(options, schemas.verify);
        if (validate.error) {
            throw validate.error;
        }
        return this.client.request(validate.value);
    }

    public simulate(options: Partial<RequestOptions> = {}) {
        const validate = joi.validate(options, schemas.simulate);
        if (validate.error) {
            throw validate.error;
        }
        return this.client.request(validate.value);
    }
}
