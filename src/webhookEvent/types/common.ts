import { IModel } from "../../abstracts/model";
import { ILink } from "../../types";

export interface IWebhookEvent extends IModel {
    readonly id?: string;
    readonly create_time?: string;
    readonly resource_type?: string;
    readonly event_version?: string;
    readonly event_type?: string;
    readonly links: ILink[];
    readonly summary?: string;
    readonly resource?: any;
}
