import { PayPalRestApi } from "../../../src";
import { config } from "../../config";

const paypal = new PayPalRestApi(config);
async function example() {
    const payment = new paypal.payment({
        intent: "sale",
        payer: {
            payment_method: "paypal",
        },
        redirect_urls: {
            cancel_url: "http://localhost",
            return_url: "http://localhost",
        },
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
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:no-console
    console.log("Open the following link and approve the payment", `https://www.sandbox.paypal.com/checkoutnow?token=${payment.model.id}`);
    return JSON.stringify(payment.model);
}

// tslint:disable-next-line:no-console
example().then((response) => console.log(response)).catch((err) => console.error(err));
