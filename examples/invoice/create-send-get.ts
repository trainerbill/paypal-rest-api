import { PayPalRestApi } from "../../src";
import { config } from "../config";

const paypal = new PayPalRestApi(config);
async function example() {
    let response = await paypal.execute("createInvoice", {
        body: {
            // https://developer.paypal.com/docs/api/invoicing/#invoices_create
            merchant_info: {
                business_name: "testy",
            },
        },
    });
    const invoiceid = response.body.id;
    // tslint:disable-next-line:no-console
    console.log("CreateInvoiceResponse", response.body);
    response = await paypal.execute("sendInvoice", {
        helperparams: {
            invoiceid,
            notify_merchant: false,
        },
    });
    // tslint:disable-next-line:no-console
    console.log("Sent successfully");

    response = await paypal.execute("getInvoicea", {
        helperparams: {
            invoiceid,
        },
    });
    return response.body;
}

// tslint:disable-next-line:no-console
example().then((response) => console.log(response)).catch((err) => console.error(err));
