import { PayPalRestApi } from "../../../src";
import { config } from "../../config";

const paypal = new PayPalRestApi(config);
async function example() {
    // tslint:disable-next-line:no-console
    let response = await paypal.invoice.api.search({
        body: {
            status: ["UNPAID"],
        },
    });
    response = await paypal.invoice.api.cancel(response.body.invoices[0].id);
    // tslint:disable-next-line:no-console
    console.log("Cancelled successfully");
    return response.body;
}

// tslint:disable-next-line:no-console
example().then((response) => console.log(response)).catch((err) => {
    // tslint:disable-next-line:no-console
    console.error(err);
});
