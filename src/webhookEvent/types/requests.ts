import { Schema } from "joi";
import { IApiSchemas } from "../../abstracts/api";
export interface IWebhookEventApiSchemas extends IApiSchemas {
    resend: Schema;
    simulate: Schema;
    verify: Schema;
}

export interface IWebhookSimulateRequestSchema {
    event_type: string;
    url: string;
}
