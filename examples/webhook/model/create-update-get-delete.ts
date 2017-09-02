// tslint:disable-next-line:no-submodule-imports
import * as uuid from "uuid/v1";
import { PayPalRestApi } from "../../../src";
import { config } from "../../config";
// tslint:disable:no-console
const paypal = new PayPalRestApi(config);
async function example() {
    const webhook = new paypal.webhook.model({
        event_types: [{
            name: "INVOICING.INVOICE.PAID",
        }, {
            name: "INVOICING.INVOICE.CANCELLED",
        }],
        url: "https://www.example.com/" + uuid(),
    });
    await webhook.create();
    await webhook.update([{
        op: "replace",
        path: "/url",
        value: webhook.model.url + "/update",
    }]);
    await webhook.get();
    console.log(`URL ${webhook.model.url} should have /update at the end.`);
    await webhook.delete();
    return "Done";
}

example().then((response) => console.log("Done!")).catch((err) => console.error(err));
// tslint:enable:no-console
