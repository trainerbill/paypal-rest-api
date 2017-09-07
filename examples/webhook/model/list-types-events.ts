import { PayPalRestApi } from "../../../src";
import { config } from "../../config";
// tslint:disable:no-console
const paypal = new PayPalRestApi(config);
async function example() {
    console.log("WebhookTypes", await paypal.webhook.types());
    const webhooks = await paypal.webhook.list();
    const webhook = webhooks[0];
    webhook.model.event_types = null;
    await webhook.events();
    console.log("WebhookEvents", webhook.model.event_types);
    return webhook.model;
}

example().then((response) => console.log("Webhook", response)).catch((err) => console.error(err));
// tslint:enable:no-console
