import * as joi from "joi";
import * as request from "request";
import * as retry from "requestretry";
// tslint:disable-next-line:no-submodule-imports
import * as uuid from "uuid/v1";
import { IConfigureOptions } from "./";
import { Oauth } from "./oauth";
import * as schemas from "./schemas";

export type RequestOptions = retry.RequestRetryOptions & request.UriOptions;
export type RequestMethod = (options?: Partial<RequestOptions>) => Promise<request.RequestResponse>;

export class Client {

    public oauth: Oauth;

    constructor(private config: IConfigureOptions) {
        this.oauth = new Oauth(this, config.client_id, config.client_secret);
    }

    public async request(options: Partial<RequestOptions>) {
        if (options.uri !== this.oauth.path) {
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

        options.headers["PAYPAL-REQUEST-ID"] = uuid();

        const validateRequest = joi.validate(options, schemas.requestOptionsSchema, { allowUnknown: true });
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

        if (response.statusCode > 299) {
            // tslint:disable-next-line:max-line-length
            // console.log(`curl -X POST -v -H "Content-Type:application/json" -H "Authorization: ${response.request.headers.Authorization}" -d '{ "subject": "invoice cancelled" }' ${response.request.href}`);
            throw new Error(JSON.stringify(response.body));
        }
        return response;
    }

}
