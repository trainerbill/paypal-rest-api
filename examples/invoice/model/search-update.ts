import { PayPalRestApi } from "../../../src";
import { config } from "../../config";

const paypal = new PayPalRestApi(config);
async function example() {
    const invoices = await paypal.invoice.search({
        status: ["UNPAID", "SENT"],
    });
    const invoice = invoices[0];
    invoice.model.merchant_info.first_name = "Tesyt";
    invoice.update();
    return invoice.model;
}

// tslint:disable-next-line:no-console
example().then((response) => console.log(response)).catch((err) => console.error(err.message));
