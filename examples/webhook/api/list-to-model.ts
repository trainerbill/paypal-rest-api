import { PayPalRestApi } from "../../../src";
import { config } from "../../config";

const paypal = new PayPalRestApi(config);
async function example() {
    const response = await paypal.webhook.api.list();
    const webhook = new paypal.webhook(response.body.webhooks[0]);
    await webhook.update([{
        op: "replace",
        path: "/url",
        value: webhook.model.url += "/surething",
    }]);
    return webhook.model;
}

// tslint:disable-next-line:no-console
example().then((response) => console.log(response)).catch((err) => console.error(err));
