import { PayPalRestApi } from "../../../src";
import { config } from "../../config";

const paypal = new PayPalRestApi(config);
async function example() {
    const response = await paypal.invoice.api.search({
        body: {
            page: 0,
            page_size: 25,
            status: ["SENT"],
        },
    });
    return response.body;
}

// tslint:disable-next-line:no-console
example().then((response) => console.log(response)).catch((err) => console.error(err));
