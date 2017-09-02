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
    await invoice.delete();
}

// tslint:disable-next-line:no-console
example().then((response) => console.log(response)).catch((err) => console.error(err.message));
