import { PayPalRestApi } from "../../../src";
import { config } from "../../config";

const paypal = new PayPalRestApi(config);

const invoice = new paypal.invoice({
    merchant_info: {
        business_name: "testy",
    },
});
// Create an invoice, send it, delete will throw an exception before sending the api call.
invoice.create()
    .then(() => invoice.send())
    .then(() => invoice.delete())
    // tslint:disable-next-line:no-console
    .catch((err) => console.log(err));
