import * as joi from "joi";
import { Api } from "../abstracts";
import { Client, RequestOptions } from "../client";
import schemas from "./schemas";
import { IWebhook } from "./types";

export class WebhookApi extends Api<IWebhook> {

    constructor(client: Client) {
        super(client, schemas, {
            create: `/v1/notifications/webhooks`,
            delete: `/v1/notifications/webhooks/{id}`,
            get: `/v1/notifications/webhooks/{id}`,
            list: `/v1/notifications/webhooks`,
            update: `/v1/notifications/webhooks/{id}`,
        });
    }

    public events(id: string, options: Partial<RequestOptions> = {}) {
        if (this.schemas.id) {
            const idValidate = joi.validate(id, this.schemas.id);
            if (idValidate.error) {
                throw idValidate.error;
            }
            id = idValidate.value;
        }

        options.uri = `/v1/notifications/webhooks/${id}/event-types`;
        const validate = joi.validate(options, schemas.events);
        if (validate.error) {
            throw validate.error;
        }
        return this.client.request(validate.value);
    }

    public types(options: Partial<RequestOptions> = {}) {
        options.uri = `/v1/notifications/webhooks-event-types`;
        const validate = joi.validate(options, schemas.types);
        if (validate.error) {
            throw validate.error;
        }
        return this.client.request(validate.value);
    }
}
