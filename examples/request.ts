import { PayPalRestApi } from "../src";
import { config } from "./config";

const paypal = new PayPalRestApi(config);
async function example() {
    return await paypal.client.request({
        // Any options from the following
        // https://github.com/FGRibreau/node-request-retry
        // https://github.com/request/request
        body: {
            // https://developer.paypal.com/docs/api/invoicing/#invoices_create
            merchant_info: {
                business_name: "testy",
            },
        },
        method: "POST",
        uri: "v1/invoicing/invoices/",
    });
}

// tslint:disable-next-line:no-console
example().then((response) => console.log(response.body)).catch((err) => console.error);
