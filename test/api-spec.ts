import * as tape from "blue-tape";
import * as request from "requestretry";
import * as sinon from "sinon";
import { PayPalRestApi } from "../src";
import { config } from "./config";

tape("request method", async (t) => {

  t.test("with no access token should", async (st) => {
    const sandbox = sinon.sandbox.create();
    const paypal = new PayPalRestApi(config);
    const postStub = sandbox.stub(request, "post");
    const executeStub = sandbox.stub(paypal, "execute").resolves({
      body: {
        access_token: "testy",
        expires_in: 200,
      },
    });
    const req = {
      merchant_info: {
        business_name: "testy",
      },
    };

    postStub
      .returns({
        id: "invoiceid",
      });
    try {
      const response = await paypal.request("/testurl", {
        body: req,
        method: "POST",
      });
      t.pass("succeed");
    } catch (err) {
      t.fail(`not throw an error: ${err.message}`);
    }
    t.equal(executeStub.withArgs("getAccessToken").called, true, "get an access token");
    t.equal(postStub.withArgs(sinon.match({
      body: req,
      headers: {
        Authorization: "Bearer testy",
      },
    })).called, true, "set the authorization header and call api with payload");
    sandbox.restore();
  });

  t.test("with access token should", async (st) => {
    const sandbox = sinon.sandbox.create();
    const paypal = new PayPalRestApi(config);
    const postStub = sandbox.stub(request, "post");
    const executeStub = sandbox.stub(paypal, "execute").resolves({
      body: {
        access_token: "testy",
        expires_in: 200,
      },
    });
    const req = {
      merchant_info: {
        business_name: "testy",
      },
    };
    postStub
      .onCall(0)
      .returns({
        id: "invoiceid",
      });
    try {
      let response = await paypal.request("/testurl", {
        body: req,
        method: "POST",
      });
      postStub.reset();
      executeStub.reset();
      response = await paypal.request("/testurl", {
        body: req,
        method: "POST",
      });
      t.pass("succeed");
    } catch (err) {
      t.fail(`not throw an error: ${err.message}`);
    }

    t.equal(executeStub.called, false, "not get an access token");
    t.equal(postStub.withArgs(sinon.match({
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
    const postStub = sandbox.stub(request, "post");
    const executeStub = sandbox.stub(paypal, "execute").resolves({
      body: {
        access_token: "testy",
        expires_in: -2,
      },
    });
    const req = {
      merchant_info: {
        business_name: "testy",
      },
    };
    postStub
      .onCall(0)
      .returns({
        id: "invoiceid",
      });
    try {
      const response = await paypal.request("/testurl", {
        body: req,
        method: "POST",
      });
      t.pass("succeed");
    } catch (err) {
      t.fail(`not throw an error: ${err.message}`);
    }

    t.equal(executeStub.called, true, "get an access token");
    t.equal(postStub.withArgs(sinon.match({
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
