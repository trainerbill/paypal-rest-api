import { PayPalRestApi } from "../../../src";
import { config } from "../../config";

const paypal = new PayPalRestApi(config);
async function example() {
    const invoice = new paypal.invoice({
        billing_info: [{
            address: {
                city: "Omaha",
                country_code: "US",
                line1: "test address",
                postal_code: "68136",
                state: "Nebraska",
            },
            business_name: "testy",
        }],
        merchant_info: {
            address: {
                city: "Omaha",
                country_code: "US",
                line1: "test address",
                postal_code: "68136",
                state: "Nebraska",
            },
            business_name: "testy",
        },
        payment_term: {
            term_type: "NET_15",
        },
    });
    await invoice.create();
    await invoice.send();
    // tslint:disable-next-line:no-console
    console.log(`${invoice.model.status} should be "UNPAID" or "SENT"`);
    invoice.model.merchant_info.first_name = "Fred";
    invoice.model.billing_info[0].address.phone = {
        country_code: "1",
        national_number: "4025001111",
    };
    invoice.model = {
        ...invoice.model,
    };
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
