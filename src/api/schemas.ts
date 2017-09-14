import * as joi from "joi";
import * as us from "us";
import { defaultRequestOptionsSchema } from "../client/schemas";

const customJoi = joi.extend((cjoi: any) => ({
    base: cjoi.string(),
    language: {
        state: "needs to be a 2 character state",
    },
    name: "string",
    pre(value: string, state: any, options: any) {

        if (options.convert && value.length > 2) {
            value = us.lookup(value).abbr;
        }

        return value;
    },
    rules: [
        {
            name: "convertState",
            setup(params: any) {

                this._flags.convertState = true;
            },
            validate(params: any, value: any, state: any, options: any) {

                return value;
            },
        },
     ],
}));

export const clientIdSchema = joi.string().empty("");
export const secretSchema = joi.string().empty("");

export const configurationSchema = joi.object({
    client_id: clientIdSchema.required(),
    client_secret: secretSchema.required(),
    mode: joi.valid(["production", "sandbox"]).required(),
    requestOptions: defaultRequestOptionsSchema.default(),
});

export const stateAbbreviations = us.STATES.map((state: any) => {
    return state.abbr;
});

export const paypalPhoneSchema = joi.object().keys({
    country_code: joi.string().regex(/^[0-9]{1,3}?$/).trim().empty("").default("1"),
    national_number: joi.string().regex(/^[0-9]{1,14}?$/).trim().empty("").required(),
});

export const paypalAddressSchema = joi.object().keys({
    city: joi.string().trim().empty("").required(),
    country_code: joi.string().trim().empty("").max(2).default("US"),
    line1: joi.string().trim().empty("").required(),
    line2: joi.string().trim().empty("").optional(),
    phone: paypalPhoneSchema.optional(),
    postal_code: joi.string().trim().empty("").required(),
    state: customJoi.string().convertState().length(2).required(),
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
    path: joi.string().regex(/\/.*/).required(),
    value: joi.any().required(),
});

export const updateRequestSchema = joi.array().items(updateRequestObjectSchema).min(1).required();
