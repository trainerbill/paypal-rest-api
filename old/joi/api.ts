import * as joi from "joi";

export const ConfigurationSchema = joi.object().keys({
    client_id: joi.string().required(),
    client_secret: joi.string().required(),
    mode: joi.valid(["production", "sandbox"]).required(),
    requestOptions: joi.object().optional(),
    validate: joi.boolean().default(false),
});
