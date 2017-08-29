import * as joi from "joi";

export const ConfigurationSchema = joi.object().keys({
    client_id: joi.string().required(),
    client_secret: joi.string().required(),
    mode: joi.valid(["production", "sandbox"]).required(),
    parse: joi.boolean().default(true),
    requestOptions: joi.object().optional(),
    retry: joi.number().default(0),
});
