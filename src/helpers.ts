import * as joi from "joi";
import * as retry from "requestretry";
import { IConfigureOptions } from "./api";
import * as schemas from "./joi";

export interface IHelper {
  options: retry.RequestRetryOptions;
  path: string;
  schema?: joi.Schema;
}

export type helperMap = Map<string, (config: IConfigureOptions) => IHelper>;

export const helpers: helperMap = new Map();

helpers.set("getAccessToken", (config) => {
    return {
        options: {
        auth: {
            password: config.client_secret,
            user: config.client_id,
        },
        form: {
            grant_type: "client_credentials",
        },
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        json: true,
        method: "POST",
        },
        path: "v1/oauth2/token",
    };
});

helpers.set("createInvoice", (config) => {
    return {
        options: {
        json: true,
        method: "POST",
        },
        path: "v1/invoicing/invoices",
        schema: schemas.paypalInvoiceSchema,
    };
});
