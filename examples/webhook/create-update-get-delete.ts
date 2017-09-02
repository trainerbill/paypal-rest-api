import { PayPalRestApi } from "../../src";
import { config } from "../config";
// tslint:disable:no-console
const paypal = new PayPalRestApi(config);
async function example() {
    const webhook = new paypal.webhook.model();
    return response;
}

example().then((response) => console.log("Done!")).catch((err) => console.error(err));
// tslint:enable:no-console
