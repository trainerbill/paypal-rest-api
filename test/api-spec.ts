import * as tape from "blue-tape";
import * as request from "requestretry";
import * as sinon from "sinon";
import { PayPalRestApi } from "../src";
import { config } from "./config";

tape("request method", async (t) => {

  t.test("failure should", async (st) => {
    const sandbox = sinon.sandbox.create();
    const paypal = new PayPalRestApi(config);
    const error = { message: "error" };
    const postStub = sandbox.stub(request, "post").rejects(error);
    try {
      const response = await paypal.request("/testurl", {
        body: {
          test: "test",
        },
        method: "POST",
      });
      st.fail("not succeed");
    } catch (err) {
      st.equal(err === error, true, "throw error");
    }
    sandbox.restore();
  });

  t.test("with valid access token", async (st) => {
    const sandbox = sinon.sandbox.create();
    const paypal = new PayPalRestApi(config);
    paypal.setAccessToken({
      access_token: "testy",
      app_id: "test",
      expires_in: 200000,
      scope: "test",
      token_type: "test",
    });
    const postStub = sandbox.stub(request, "post");

    postStub
      .onCall(0)
      .resolves({
        id: "invoiceid",
      });

    const req = {
      merchant_info: {
        business_name: "testy",
      },
    };
    try {
      const response = await paypal.request("/testurl", {
        body: req,
        method: "POST",
      });
      st.pass("succeed");
    } catch (err) {
      st.fail(`not throw an error: ${err.message}`);
    }
    st.equal(postStub.calledOnce, true, "make one request");
    st.equal(postStub.withArgs(sinon.match({
      body: req,
      headers: {
        Authorization: "Bearer testy",
      },
    })).called, true, "set the authorization header and call api with payload");
    sandbox.restore();
  });

  t.test("with no access token", async (st) => {
    const sandbox = sinon.sandbox.create();
    const paypal = new PayPalRestApi(config);
    const postStub = sandbox.stub(request, "post");
    postStub
      .onCall(0)
      .resolves({
        body: {
          access_token: "testy",
          expires_in: 200,
        },
      });

    postStub
      .onCall(1)
      .returns({
        id: "invoiceid",
      });

    const req = {
      merchant_info: {
        business_name: "testy",
      },
    };
    try {
      const response = await paypal.request("/testurl", {
        body: req,
        method: "POST",
      });
      st.pass("succeed");
    } catch (err) {
      st.fail(`not throw an error: ${err.message}`);
    }
    st.equal(postStub.calledTwice, true, "make two requests");
    st.equal(postStub.withArgs(sinon.match({
      auth: {
        password: config.client_secret,
        user: config.client_id,
      },
      uri: "https://api.sandbox.paypal.com/v1/oauth2/token",
    })).called, true, "get an access token");
    st.equal(postStub.withArgs(sinon.match({
      body: req,
      headers: {
        Authorization: "Bearer testy",
      },
    })).called, true, "set the authorization header and call api with payload");
    sandbox.restore();
  });

  t.test("with expired access token should", async (st) => {
    const sandbox = sinon.sandbox.create();
    const paypal = new PayPalRestApi(config);
    paypal.setAccessToken({
      access_token: "testy",
      app_id: "test",
      expires_in: -2,
      scope: "test",
      token_type: "test",
    });

    const postStub = sandbox.stub(request, "post");
    postStub
      .onCall(0)
      .resolves({
        body: {
          access_token: "testy",
          expires_in: 200,
        },
      });

    postStub
      .onCall(1)
      .returns({
        id: "invoiceid",
      });

    const req = {
      merchant_info: {
        business_name: "testy",
      },
    };

    try {
      const response = await paypal.request("/testurl", {
        body: req,
        method: "POST",
      });
      st.pass("succeed");
    } catch (err) {
      st.fail(`not throw an error: ${err.message}`);
    }

    st.equal(postStub.calledTwice, true, "make two requests");
    st.equal(postStub.withArgs(sinon.match({
      auth: {
        password: config.client_secret,
        user: config.client_id,
      },
      uri: "https://api.sandbox.paypal.com/v1/oauth2/token",
    })).called, true, "get an access token");
    st.equal(postStub.withArgs(sinon.match({
      body: req,
      headers: {
        Authorization: "Bearer testy",
      },
    })).called, true, "set the authorization header and call api with payload");
    sandbox.restore();
  });

});

tape("execute method", async (t) => {

  t.test("succeed should", async (st) => {
    const sandbox = sinon.sandbox.create();
    const paypal = new PayPalRestApi(config);
    const requestStub = sandbox.stub(paypal, "request").resolves({ body: { test: "ok" } });
    try {
      const response = await paypal.execute("createInvoice", {
        body: {
          merchant_info: {
            business_name: "testy",
          },
        },
      });
      st.equal(requestStub.called, true, "call request function");
      st.equal(response.body.test === "ok", true, "respond with result");
    } catch (err) {
      st.fail(`not throw an error: ${err.message}`);
    }
    sandbox.restore();
  });

  t.test("fail should", async (st) => {
    const sandbox = sinon.sandbox.create();
    const paypal = new PayPalRestApi({ ...config, ...{ validate: true }});
    const requestStub = sandbox.stub(paypal, "request").resolves({ body: { test: "ok" } });
    try {
      const response = await paypal.execute("createInvoice", {
        body: {
          huh: "test",
        },
      });
      st.fail("throw validation error");
    } catch (err) {
      st.pass("throw validation error");
      st.equal(requestStub.called, false, "not call request function");
    }

    try {
      const response = await paypal.execute("testyMcTesterson", {
        body: {
          huh: "test",
        },
      });
      st.fail("throw api not found error");
    } catch (err) {
      st.pass("throw api not found error");
      st.equal(requestStub.called, false, "not call request function");
    }
    sandbox.restore();
  });
});
