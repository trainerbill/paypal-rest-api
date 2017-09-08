import * as joi from "joi";

export const clientHeadersSchema = joi.object({
    "Accept": joi.string().default("application/json"),
    "Accept-Language": joi.string().default("en_US"),
    "Content-Type": joi.string().default("application/json"),
});

export const defaultRequestOptionsSchema = joi.object({
    baseUrl: joi.string()
                    .valid(["https://api.paypal.com", "https://api.sandbox.paypal.com"])
                    .default("https://api.paypal.com"),
    headers: clientHeadersSchema.default(),
    json: joi.boolean().default(true),
    maxAttempts: joi.number().min(1).default(5),
    promiseFactory: joi.func().default((resolver: any) => {
        return new Promise(resolver);
    }),
    retryDelay: joi.number().min(0).default(200),
});

export const requestOptionsSchema = defaultRequestOptionsSchema.keys({
    headers: clientHeadersSchema.keys({
        "PAYPAL-REQUEST-ID": joi.string().min(15).required(),
    }).default(),
    method: joi.string().required(),
    uri: joi.string().required(),
});
