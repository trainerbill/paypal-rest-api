import { PayPalRestApi } from "../../../src";
import { config } from "../../config";

const paypal = new PayPalRestApi(config);
async function example() {
    const webhookEvent = await paypal.webhookEvent.simulate({
        event_type: "PAYMENT.AUTHORIZATION.CREATED",
        url: "https://www.example.com/webhook",
    });
    return webhookEvent.model;
}

// tslint:disable-next-line:no-console
example().then((response) => console.log(response)).catch((err) => console.error(err));
