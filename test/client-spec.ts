import * as tape from "blue-tape";
import * as joi from "joi";
import * as request from "requestretry";
import * as sinon from "sinon";
import { Client, Oauth, requestOptionsSchema } from "../src";
import { config } from "./config";

tape("client.ts constructor should", async (t) => {
    const sandbox = sinon.sandbox.create();
    const client = new Client(config);
    t.equal(client.oauth instanceof Oauth, true, "construct an instance of Oauth");
    sandbox.restore();
});

tape("client.ts request method", async (t) => {

    t.test("with no access token should", async (st) => {
        const sandbox = sinon.sandbox.create();
        const client = new Client(config);
        const postStub = sandbox.stub(request, "post");
        postStub
            .onCall(0)
            .resolves({
                body: JSON.stringify({
                    access_token: "testy",
                    expires_in: 200,
                }),
                statusCode: 200,
            });

        postStub
            .onCall(1)
            .resolves({
                body: {
                    id: "invoiceid",
                },
                statusCode: 200,
            });
        const req = {
            body: {
                merchant_info: {
                    business_name: "testy",
                },
            },
            method: "POST",
            uri: "/testurl",
        };

        try {
            const response = await client.request(req);
            st.equal(response.body.id === "invoiceid", true, "resolve the body");

        } catch (err) {
            st.fail(`not throw an error: ${err.message}`);
        }
        st.equal(postStub.calledTwice, true, "make two requests");
        st.equal(postStub.withArgs(sinon.match({
            auth: {
                password: config.client_secret,
                user: config.client_id,
            },
            uri: "/v1/oauth2/token",
        })).called, true, "get an access token");
        st.equal(postStub.withArgs(sinon.match({
            body: {
                merchant_info: {
                    business_name: "testy",
                },
            },
            headers: {
                Authorization: "Bearer testy",
            },
        })).called, true, "set the authorization header and call api with payload");

        // tslint:disable-next-line:max-line-length
        st.equal(postStub.getCall(0).args[0].headers["PAYPAL-REQUEST-ID"] !== postStub.getCall(1).args[0].headers["PAYPAL-REQUEST-ID"], true, "generate a new request id for every request.")

        sandbox.restore();
    });

    t.test("with expired access token should", async (st) => {
        const sandbox = sinon.sandbox.create();
        const client = new Client(config);
        const postStub = sandbox.stub(request, "post");
        postStub
            .onCall(0)
            .resolves({
                body: JSON.stringify({
                    access_token: "testy",
                    expires_in: -2,
                }),
                statusCode: 200,
            })
            .onCall(1)
            .resolves({
                body: JSON.stringify({
                    access_token: "testy",
                    expires_in: 200,
                }),
                statusCode: 200,
            })
            .onCall(2)
            .resolves({
                body: {
                    id: "invoiceid",
                },
                statusCode: 200,
            });

        const req = {
            body: {
                merchant_info: {
                    business_name: "testy",
                },
            },
            method: "POST",
            uri: "/testurl",
        };

        try {
            await client.oauth.getAccessToken();
            const response = await client.request(req);
            st.equal(response.body.id === "invoiceid", true, "resolve the body");

        } catch (err) {
            st.fail(`not throw an error: ${err.message}`);
        }
        st.equal(postStub.calledThrice, true, "make three requests");
        sandbox.restore();
    });

    t.test("with valid access token", async (st) => {
        const sandbox = sinon.sandbox.create();
        const client = new Client(config);
        client.oauth.setAccessToken({
            access_token: "testy",
            app_id: "test",
            expires_in: 200,
            scope: "test",
            token_type: "test",
        });
        const postStub = sandbox.stub(request, "post");
        postStub
            .onCall(0)
            .resolves({
                body: {
                    id: "invoiceid",
                },
                statusCode: 200,
            });

        const req = {
            body: {
                merchant_info: {
                    business_name: "testy",
                },
            },
            method: "POST",
            uri: "/testurl",
        };

        try {
            const response = await client.request(req);
            st.equal(response.body.id === "invoiceid", true, "resolve the body");

        } catch (err) {
            st.fail(`not throw an error: ${err.message}`);
        }
        st.equal(postStub.calledOnce, true, "make one request");
        sandbox.restore();
    });

});
