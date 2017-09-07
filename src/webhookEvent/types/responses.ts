import { IWebhookEvent } from "./";

export interface IWebhookEventListResponse {
    readonly events: IWebhookEvent[];
}
