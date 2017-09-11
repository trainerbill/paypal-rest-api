import { PayPalRestApi } from "../../../src";
import { config } from "../../config";

const paypal = new PayPalRestApi(config);
async function example() {
    const payments = await paypal.payment.list({
        qs: {
            count: 100,
        },
    });
    const refundablePayment = payments.filter((lpayment) => {
        return lpayment.model.transactions[0].related_resources.filter((resource) => {
            if (resource.sale && resource.sale.state === "completed") {
                return resource.sale;
            }
        });
    })[0];
    if (!refundablePayment) {
        throw new Error("No refundable payment found.  Run the execute payment example first");
    }

    const sale = new paypal.sale(refundablePayment);
    await sale.refund();

    return JSON.stringify(sale.model);
}

// tslint:disable-next-line:no-console
example().then((response) => console.log(response)).catch((err) => console.error(err));
