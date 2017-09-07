import { PayPalRestApi } from "../../../src";
import { config } from "../../config";

const paypal = new PayPalRestApi(config);
async function example() {
    const invoice = new paypal.invoice({
        merchant_info: {
            business_name: "testy",
        },
    });
    await invoice.create();
    await invoice.send();
    // tslint:disable-next-line:no-console
    console.log(`${invoice.model.status} should be "UNPAID" or "SENT"`);
    invoice.model.merchant_info.first_name = "Fred";
    await invoice.update();
    // tslint:disable-next-line:no-console
    console.log(`${invoice.model.merchant_info.first_name} should be "Fred"`);
    invoice.model.merchant_info.first_name = "surething";
    await invoice.get();
    // tslint:disable-next-line:no-console
    console.log(`${invoice.model.merchant_info.first_name} should be "Fred"`);
    await invoice.remind();
    await invoice.cancel();
    await invoice.get();
    return JSON.stringify(invoice.model);
}

// tslint:disable-next-line:no-console
example().then((response) => console.log(response)).catch((err) => console.error(err.message));
