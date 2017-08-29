import { PayPalRestApi } from "../src";
import { config } from "./config";

const paypal = new PayPalRestApi(config);
async function example() {
    const response = await paypal.execute("createInvoice", {
        body: {
            // https://developer.paypal.com/docs/api/invoicing/#invoices_create
            merchant_info: {
                business_name: "testy",
            },
        },
    });
    return response;
}

// tslint:disable-next-line:no-console
example().then((response) => console.log(response.body)).catch((err) => console.error);
