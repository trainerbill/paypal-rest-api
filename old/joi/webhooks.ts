import * as joi from "joi";
import { paypalUpdateRequestObjectSchema } from "./common";

export const createWebhookRequestSchema = joi.object().keys({
    event_types: joi.array().items(
        joi.object().keys({
            name: joi.string().required(),
        }),
    ).min(1).required(),
    url: joi.string().uri({
        scheme: [ "https" ],
    }).required(),
});

export const updateWebhookRequestSchema = joi.array().items(
    paypalUpdateRequestObjectSchema.keys({
        op: joi.string().valid("replace"),
    }),
);
