import * as tape from "blue-tape";
import * as request from "requestretry";
import * as sinon from "sinon";
import { PayPalRestApi } from "../src";
import { config } from "./config";

tape("request method should", async (t) => {
  const sandbox = sinon.sandbox.create();
  const paypal = new PayPalRestApi(config);
  const postStub = sandbox.stub(request, "post");
  const req = {
    merchant_info: {
      business_name: "testy",
    },
  };
  postStub
    .onCall(0)
    .returns({
      access_token: "testy",
      expires_in: 200,
    });
  postStub
    .onCall(1)
    .returns({
      id: "invoiceid",
    });
  try {
    const response = await paypal.execute("createInvoice", {
      body: req,
    });
    t.pass("succeed");
  } catch (err) {
    t.fail("not throw an error");
  }

  t.equal(postStub.withArgs(sinon.match({
    body: req,
    headers: {
      Authorization: "Bearer testy",
    },
  })).called, true, "set the authorization header and call api with payload");
  sandbox.restore();
});

tape("execute method should", async (t) => {

  t.test("succeed", async (st) => {
    const sandbox = sinon.sandbox.create();
    const paypal = new PayPalRestApi(config);
    const requestStub = sandbox.stub(paypal, "request").resolves({ test: "ok" });
    try {
      const response = await paypal.execute("createInvoice", {
        body: {
          merchant_info: {
            business_name: "testy",
          },
        },
      });
      st.pass("succeed and");
      st.equal(requestStub.called, true, "call request function");
      st.equal(response.test === "ok", true, "respond with result");
    } catch (err) {
      st.fail("not throw an error");
    }
    sandbox.restore();
  });

  t.test("fail and", async (st) => {
    const sandbox = sinon.sandbox.create();
    const paypal = new PayPalRestApi(config);
    const requestStub = sandbox.stub(paypal, "request").resolves({ test: "ok" });
    try {
      const response = await paypal.execute("createInvoice", {
        body: {
          huh: "test",
        },
      });
      t.fail("throw validation error");
    } catch (err) {
      t.pass("throw validation error");
      t.equal(requestStub.called, false, "not call request function");
    }
    sandbox.restore();
  });
});
