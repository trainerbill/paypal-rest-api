import * as joi from "joi";
import * as request from "request";
import * as retry from "requestretry";
import { Api } from "../abstracts";
import { Client, RequestMethod, RequestOptions } from "../client";
import { clientIdSchema, oauthAccessTokenRequestSchema, secretSchema } from "./schemas";
import { IAccessToken } from "./types";

export class Oauth extends Api {

    public static paths = {
        access: "/v1/oauth2/token",
    };

    public static schemas = {
        access: oauthAccessTokenRequestSchema,
        clientId: clientIdSchema,
        clientSecret: secretSchema,
    };

    public token: IAccessToken;

    constructor(client: Client, private _clientId: string, private _clientSecret: string) {
        super(client, {}, {});
    }

    public get clientId() {
        return this._clientId;
    }

    public set clientId(id) {
        this._clientId = this.schemaValidate(id, Oauth.schemas.clientId);
    }

    public get clientSecret() {
        return this._clientSecret;
    }

    public set clientSecret(id) {
        this._clientSecret = this.schemaValidate(id, Oauth.schemas.clientSecret);
    }

    public requestAccessToken(options: Partial<RequestOptions> = {}) {
        const validate = this.schemaValidate({
            auth: {
                password: this.clientSecret,
                user: this.clientId,
            },
        }, Oauth.schemas.access);

        return this.client.request({
            ...options,
            ...validate,
        });
    }

    public async getAccessToken() {
        if (!this.valid()) {
            const response = await this.requestAccessToken();
            this.setAccessToken(JSON.parse(response.body));
        }
        return this.token;
    }

    public setAccessToken(token: IAccessToken) {
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
