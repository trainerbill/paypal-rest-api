import * as joi from "joi";
import * as request from "request";
import * as retry from "requestretry";
import { Client, RequestMethod, RequestOptions } from "../client";
import { OauthAccessTokenRequestSchema } from "./schemas";
import * as types from "./types";

export class Oauth {

    public path = "/v1/oauth2/token";
    private token: types.IAccessToken;

    constructor(private client: Client, private clientId: string, private clientSecret: string) {}

    public requestAccessToken(options: Partial<RequestOptions> = {}) {
        const validate = joi.validate({
            auth: {
                password: this.clientSecret,
                user: this.clientId,
            },
        }, OauthAccessTokenRequestSchema);

        if (validate.error) {
            throw validate.error;
        }

        return this.client.request({
            ...options,
            ...validate.value,
        });
    }

    public async getAccessToken() {
        if (!this.valid()) {
            const response = await this.requestAccessToken();
            this.setAccessToken(JSON.parse(response.body));
        }
        return this.token;
    }

    public setAccessToken(token: types.IAccessToken) {
        token.expiration = new Date().setSeconds(token.expires_in);
        this.token = token;
    }

    public expired() {
        if (Date.now() > this.token.expiration) {
        return true;
        }
        return false;
    }

    public valid() {
        if (!this.token || !this.token.access_token || !this.token.expiration || this.expired()) {
            return false;
        }
        return true;
    }

}
