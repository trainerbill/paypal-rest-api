import * as joi from "joi";
import * as us from "us";

export const ClientIdSchema = joi.string().empty("");
export const SecretSchema = joi.string().empty("");

export const defaultRequestOptionsSchema = joi.object({
    baseUrl: joi.string()
                    .valid(["https://api.paypal.com/", "https://api.sandbox.paypal.com/"])
                    .default("https://api.paypal.com/"),
    headers: joi.object({
        "Accept": joi.string().default("application/json"),
        "Accept-Language": joi.string().default("en_US"),
        "Content-Type": joi.string().default("application/json"),
    }),
    json: joi.boolean().default(true),
    maxAttempts: joi.number().min(1).default(5),
    promiseFactory: joi.func().default((resolver: any) => {
        return new Promise(resolver);
    }),
    retryDelay: joi.number().min(0).default(200),
});

export const requestOptionsSchema = joi.object({
    method: joi.string().required(),
    uri: joi.string().required(),
});

export const ConfigurationSchema = joi.object({
    client_id: ClientIdSchema.required(),
    client_secret: SecretSchema.required(),
    mode: joi.valid(["production", "sandbox"]).required(),
    requestOptions: defaultRequestOptionsSchema.default(),
});

const abbrs = us.STATES.map((state: any) => {
    return state.abbr;
});

export const paypalAddressSchema = joi.object().keys({
    city: joi.string().trim().empty("").required(),
    country_code: joi.string().trim().empty("").max(2).default("US"),
    line1: joi.string().trim().empty("").required(),
    line2: joi.string().trim().empty("").optional(),
    phone: joi.string().trim().empty("").optional(),
    postal_code: joi.string().trim().empty("").required(),
    state: joi.string().trim().empty("").valid(abbrs).required(),
});

export const paypalPhoneSchema = joi.object().keys({
    country_code: joi.string().regex(/^[0-9]{1,3}?$/).trim().empty("").default("1"),
    national_number: joi.string().regex(/^[0-9]{1,14}?$/).trim().empty("").required(),
});

export const paypalCurrencySchema = joi.object().keys({
    currency: joi.string().max(3).trim().empty("").default("USD"),
    value: joi.string().trim().empty("").required(),
});

export const paypalTaxSchema = joi.object().keys({
    amount: paypalCurrencySchema.optional(),
    name: joi.string().trim().empty("").optional(),
    percent: joi.number().min(0).max(100).optional(),
});

export const paypalCostSchema = joi.object().keys({
    amount: paypalCurrencySchema.optional(),
    percent: joi.number().min(0).max(100).optional(),
});

export const paypalShippingCostSchema = joi.object().keys({
    amount: paypalCurrencySchema.required(),
    tax: paypalTaxSchema.optional(),
});

export const paypalCustomAmountSchema = joi.object().keys({
    amount: paypalCurrencySchema.required(),
    label: joi.string().trim().empty("").max(50).required(),
});

export const updateRequestObjectSchema = joi.object({
    op: joi.string().valid(["add", "replace"]).required(),
    path: joi.string().required(),
    value: joi.any().required(),
});

export const updateRequestSchema = joi.array().items(updateRequestObjectSchema).min(1).required();
