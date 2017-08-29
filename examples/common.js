var lib = require("../lib");

const paypal = new lib.PayPalRestApi({
    client_id: "ARkR7soWd2kUxFCNPHOmyb3IQhOwiL-wYhRmsRRD1SdslE0u-lCEps4LdN_KocpyEPgaWJXcsFuwd99M",
    client_secret: "ECSQrtNCk09UyKoHfSWuogfaQRmjbgVy9Mg7nc6JOI48z_dMfNonz-3Z3KFCLeX5qhFLGJ9e--DY59gV",
    mode: "sandbox",
});

paypal.execute("createInvoice", {
    body: {
        // https://developer.paypal.com/docs/api/invoicing/#invoices_create
        merchant_info: {
            business_name: "testy",
        },
    },
})
.then((response) => console.log(response.body))
.catch((err) => console.error);