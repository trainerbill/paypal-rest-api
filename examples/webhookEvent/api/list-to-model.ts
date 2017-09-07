import { PayPalRestApi } from "../../../src";
import { config } from "../../config";

const paypal = new PayPalRestApi(config);
async function example() {
    const response = await paypal.webhookEvent.api.list();
    const webhookEvent = new paypal.webhookEvent(response.body.events[0]);
    await webhookEvent.resend();
    return webhookEvent.model;
}

// tslint:disable-next-line:no-console
example().then((response) => console.log(response)).catch((err) => console.error(err));
