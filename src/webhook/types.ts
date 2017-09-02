import { ILink, IResponse } from "../types";
export { UpdateRequest } from "../types";

export interface INotificationEventType {
    readonly description?: string;
    name: string;
    status?: string;
}
export interface IEventTypesResponse extends IResponse {
    event_types: INotificationEventType[];
}

export interface IWebhook {
    event_types: INotificationEventType[];
    readonly id?: string;
    readonly links?: ILink[];
    url: string;
}
export interface IWebhookListResponse extends IResponse {
    readonly webhooks: IWebhook[];
}
