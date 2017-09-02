import { PayPalRestApi } from "../../../src";
import { config } from "../../config";

const paypal = new PayPalRestApi(config);
async function example() {
    const invoice = new paypal.invoice.model({
        merchant_info: {
            business_name: "testy",
        },
    });
    await invoice.create();
    await invoice.recordPayment({
        method: "CASH",
    });
    await invoice.recordRefund();
    return JSON.stringify(invoice.model);
}

// tslint:disable-next-line:no-console
example().then((response) => console.log(response)).catch((err) => console.error(err.message));
