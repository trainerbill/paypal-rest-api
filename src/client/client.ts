import * as joi from "joi";
import * as request from "request";
import * as retry from "requestretry";
// tslint:disable-next-line:no-submodule-imports
import * as uuid from "uuid/v1";
import { IConfigureOptions } from "../";
import { Oauth } from "../oauth";
import { requestOptionsSchema } from "./schemas";
import { RequestOptions } from "./types";

export class Client {

    public oauth: Oauth;

    constructor(private _config: IConfigureOptions) {
        this.oauth = new Oauth(this, this.config.client_id, this.config.client_secret);
    }

    get config() {
        return this._config;
    }

    set config(config) {
        this._config = config;
    }

    public async request(options: Partial<RequestOptions>) {
        if (options.uri !== Oauth.paths.access) {
            const token = await this.oauth.getAccessToken();
            options.headers = {
                ...options.headers,
                ...{ Authorization: `Bearer ${token.access_token}` },
            };
        }

        options = {
            ...this.config.requestOptions,
            ...options,
        };

        if (!options.headers["PAYPAL-REQUEST-ID"]) {
            options.headers["PAYPAL-REQUEST-ID"] = uuid();
        }

        const validateRequest = joi.validate(options, requestOptionsSchema, { allowUnknown: true });
        if (validateRequest.error) {
            throw validateRequest.error;
        }
        options = validateRequest.value;

        // use the .post .get helpers for easy stubbing in tests
        let response: any;
        if (options.method === "POST") {
            response = await retry.post(options as RequestOptions);
        } else if (options.method === "GET") {
            response = await retry.get(options as RequestOptions);
        } else if (options.method === "PATCH") {
            response = await retry.patch(options as RequestOptions);
        } else if (options.method === "DELETE") {
            response = await retry.delete(options as RequestOptions);
        } else if (options.method === "PUT") {
            response = await retry.put(options as RequestOptions);
        } else {
            throw new Error(`Method ${options.method} is not configured.`);
        }

        if (process.env.PAYPAL_DEBUG) {
            // tslint:disable
            console.log(response.toJSON());
            console.log(`curl -X ${response.request.method.toUpperCase()} -v -H "Content-Type:application/json" -H "Authorization: ${response.request.headers.Authorization}" -d '${typeof response.request.body === "string" ? response.request.body : JSON.stringify(response.request.body)}' ${response.request.href}`);
            // tslint:enable
        }

        if (response.statusCode > 299) {
            throw new Error(JSON.stringify(response.body));
        }
        return response;
    }

}
