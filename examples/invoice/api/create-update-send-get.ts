import { PayPalRestApi } from "../../../src";
import { config } from "../../config";

const paypal = new PayPalRestApi(config);
async function example() {
    let response = await paypal.invoice.api.create({
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
    response = await paypal.invoice.api.send(invoiceid);
    // tslint:disable-next-line:no-console
    console.log("Sent successfully");
    response = await paypal.invoice.api.get(invoiceid);
    return response.body;
}

// tslint:disable-next-line:no-console
example().then((response) => console.log(response)).catch((err) => console.error(err));
