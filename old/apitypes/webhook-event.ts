import { IResponse } from "./common";

export interface IWebhookEvent {
    readonly id?: string;
    readonly create_time?: string;
    readonly resource_type?: string;
    readonly event_version?: string;
    readonly event_type?: string;
    readonly summary?: string;
    readonly resource?: any;
}
export interface IWebhookEventListResponse extends IResponse {
    events: IWebhookEvent[];
}
export interface IWebhookVerifyResponse {
    verification_status: string;
}
