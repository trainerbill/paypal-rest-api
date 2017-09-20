import { PayPalRestApi } from "../../../src";
import { mockInvoiceWebhookEvent, mockInvoiceWebhookHeaders, mockInvoiceWebhookId } from "../../../src/webhookEvent";
import { config } from "../../config";

const paypal = new PayPalRestApi(config);
async function example() {
    const response = await paypal.webhookEvent.verify(
        mockInvoiceWebhookId,
        mockInvoiceWebhookHeaders,
        mockInvoiceWebhookEvent,
    );
    return response;
}

// tslint:disable-next-line:no-console
example().then((response) => console.log(response)).catch((err) => console.error(err));
