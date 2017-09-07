// you would use: var PayPalRestApi = require("paypal-rest-api").PayPalRestApi;
var PayPalRestApi = require("../../lib").PayPalRestApi;

const paypal = new PayPalRestApi({
    client_id: "ARkR7soWd2kUxFCNPHOmyb3IQhOwiL-wYhRmsRRD1SdslE0u-lCEps4LdN_KocpyEPgaWJXcsFuwd99M",
    client_secret: "ECSQrtNCk09UyKoHfSWuogfaQRmjbgVy9Mg7nc6JOI48z_dMfNonz-3Z3KFCLeX5qhFLGJ9e--DY59gV",
    mode: "sandbox",
});

paypal.invoice.api.create({
    body: {
        // https://developer.paypal.com/docs/api/invoicing/#invoices_create
        merchant_info: {
            business_name: "testy",
        },
    },
})
.then((response) => {
    console.log("Invoice", response.body);
    return response.body.id;
})
.then((id) => paypal.invoice.api.delete)
.catch((err) => console.error);
