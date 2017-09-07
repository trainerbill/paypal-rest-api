import { Schema } from "joi";
import { IApiSchemas } from "../../abstracts/api";
import { IModel } from "../../abstracts/model";
import { ILink, IResponse } from "../../api/types";

export interface IWebhook extends IModel {
    event_types: IWebhookEventType[];
    readonly id?: string;
    readonly links?: ILink[];
    url: string;
}

export interface IWebhookListResponse {
    readonly webhooks: IWebhook[];
}

export interface IWebhookRequestSchemas extends IApiSchemas {
    events: Schema;
    types: Schema;
}

export interface IWebhookEventType {
    name: string;
    readonly description?: string;
    readonly status?: string;
}

export interface IWebhookEventTypeListResponse {
    readonly events: IWebhookEventType[];
}
