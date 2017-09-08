import * as tape from "blue-tape";
import * as joi from "joi";
import * as sinon from "sinon";
import { Client, InvoiceModel, Oauth, PayPalRestApi, WebhookEventModel, WebhookModel } from "../src";
import { config } from "./config";

tape("api constructor should", async (t) => {
    const sandbox = sinon.sandbox.create();
    const invoiceInitSpy = sandbox.spy(InvoiceModel, "init");
    const webhookEventInitSpy = sandbox.spy(WebhookEventModel, "init");
    const webhookInitSpy = sandbox.spy(WebhookModel, "init");
    let paypal = new PayPalRestApi(config);

    t.equal(paypal.client instanceof Client, true, "construct an instance of Client");

    t.equal(paypal.invoice === InvoiceModel, true, "expose invoice model");
    t.equal(invoiceInitSpy.calledWith(paypal.client), true, "initialize invoice model");

    t.equal(paypal.webhook === WebhookModel, true, "expose webhook model");
    t.equal(webhookInitSpy.calledWith(paypal.client), true, "initialize webhook model");

    t.equal(paypal.webhookEvent === WebhookEventModel, true, "expose webhook event model");
    t.equal(webhookEventInitSpy.calledWith(paypal.client), true, "initialize webhook event model");

    // tslint:disable-next-line:max-line-length
    t.equal(paypal.config.requestOptions.baseUrl === "https://api.sandbox.paypal.com", true, "configure sandbox environment");

    paypal = new PayPalRestApi({
        client_id: "asdfasdfasdfasfd",
        client_secret: "asdfasdfasdfasdf",
        mode: "production",
    });
    // tslint:disable-next-line:max-line-length
    t.equal(paypal.config.requestOptions.baseUrl === "https://api.paypal.com", true, "configure production environment");

    sandbox.restore();
});

tape("api constructor should", async (t) => {
    try {
        const paypal = new PayPalRestApi({
            client_id: "",
            client_secret: "",
            mode: "asdf",
        });
        t.fail("throw validation error");
    } catch (err) {
        t.equal(err.name === "ValidationError", true, "throw validation error");
    }
});
