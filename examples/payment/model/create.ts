import * as opn from "opn";
import { PayPalRestApi } from "../../../src";
import { config } from "../../config";

const paypal = new PayPalRestApi(config);
async function example() {
    const payment = new paypal.payment({
        transactions: [{
            amount: {
                currency: "USD",
                total: "30.00",
            },
            description: "The payment transaction description.",
        }],
    });

    await payment.create();
    await payment.update([{
        op: "replace",
        path: "/transactions/0/description",
        value: "Updated Description for payment",
    }]);

    return payment.model;
}

// tslint:disable
example().then((response) => {
    console.log(JSON.stringify(response));
    opn(`https://www.sandbox.paypal.com/checkoutnow?token=${response.id}`);
    console.log("After approving the transaction you can run the execute example.");
}).catch((err) => console.error(err));
// tslint:enable
