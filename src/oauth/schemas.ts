import * as joi from "joi";
import { ClientIdSchema, SecretSchema} from "../schemas";

export const OauthAccessTokenRequestSchema = joi.object({
    auth: joi.object({
        password: SecretSchema.required(),
        user: ClientIdSchema.required(),
    }),
    form: joi.object({
        grant_type: joi.string().default("client_credentials"),
    }).default(),
    headers: joi.object().keys({
        "Content-Type": joi.string().default("application/x-www-form-urlencoded"),
    }).default(),
    json: joi.boolean().default(false),
    method: joi.string().default("POST"),
    uri: joi.string().default("/v1/oauth2/token"),
});
