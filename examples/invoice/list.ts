import { PayPalRestApi } from "../../src";
import { config } from "../config";

const paypal = new PayPalRestApi(config);
async function example() {
    const response = await paypal.execute("listInvoice", {
        qs: {
            total_count_required: true,
        },
    });
    return response.body;
}

// tslint:disable-next-line:no-console
example().then((response) => console.log(response)).catch((err) => console.error(err));
