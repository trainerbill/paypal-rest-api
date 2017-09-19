import { PayPalRestApi } from "../../../src";
import { config } from "../../config";

const paypal = new PayPalRestApi(config);
async function example() {
    // Returns model
    const invoice = await paypal.invoice.get("INV2-NHZH-Q42S-XVXM-CK4U");
    return JSON.stringify(invoice.model);
}

// tslint:disable-next-line:no-console
example().then((response) => console.log(response)).catch((err) => console.error(err.message));
