import { PayPalRestApi } from "../../../src";
import { config } from "../../config";

const paypal = new PayPalRestApi(config);
async function example() {
    const payments = await paypal.payment.list({
        qs: {
            count: 100,
        },
    });
    const payment = payments.filter((lpayment) => {
        // tslint:disable-next-line:max-line-length
        if (lpayment.model.state === "created" && lpayment.model.payer && lpayment.model.payer.payer_info && lpayment.model.payer.payer_info.payer_id) {
            return lpayment;
        }
    })[0];
    if (!payment) {
        throw new Error("No approved payment found.  Run the create example and approve the payment first");
    }


    //return JSON.stringify(sale.model);
}

// tslint:disable-next-line:no-console
example().then((response) => console.log(response)).catch((err) => console.error(err));
