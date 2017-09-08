import { PayPalRestApi } from "../src";
import { config } from "./config";

const paypal = new PayPalRestApi(config);
async function example() {
    const response = await paypal.client.request({
        body: {
            // https://developer.paypal.com/docs/api/invoicing/#invoices_create
            merchant_info: {
                business_name: "testy",
            },
        },
        maxAttempts: 3,
        method: "POST",
        retryDelay: 500,
        uri: "v1/invoicing/invoices/",
    });
    return response;
}

// tslint:disable-next-line:no-console
example().then((response) => console.log(response.body)).catch((err) => console.error);
