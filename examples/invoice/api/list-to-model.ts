import { PayPalRestApi } from "../../../src";
import { config } from "../../config";

const paypal = new PayPalRestApi(config);
async function example() {
    const response = await paypal.invoice.api.list();
    const invoice = new paypal.invoice(response.body.invoices[0]);
    invoice.model.merchant_info.first_name = "Fred";
    return invoice.model;
}

// tslint:disable-next-line:no-console
example().then((response) => console.log(response)).catch((err) => console.error(err));
