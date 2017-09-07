import { PayPalRestApi } from "../../../src";
import { mockInvoiceCreatedWebhookEventString } from "../../../src/webhookEvent";
import { config } from "../../config";

const paypal = new PayPalRestApi(config);
async function example() {
    return await paypal.webhookEvent.verify(mockInvoiceCreatedWebhookEventString);
}

// tslint:disable-next-line:no-console
example().then((response) => console.log(response)).catch((err) => console.error(err));
