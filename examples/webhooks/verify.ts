import { PayPalRestApi } from "../../src";
import { config } from "../config";

// tslint:disable-next-line:max-line-length
const webhookEvent = '{"auth_algo":"SHA256withRSA","cert_url":"https://api.sandbox.paypal.com/v1/notifications/certs/CERT-360caa42-fca2a594-aecacc47","transmission_id":"6d8c47f0-8e74-11e7-ac1e-6b62a8a99ac4","transmission_sig":"zSq24taO8zQLD45UK+Klhdu+/JFYZ7dN5bkK6YC7ZXfyOSRU24gtHtM1KsF45i7eBuVbc3Kkf1STAPI7ah0+eN13t2hmOyjLZ4H3s7j2ezzuUXfwsA38QyhuC7Vqb1V1ZhzXPKmEhHYXukibhWexzwyABkaQQFDDadWU6Mli23AOc6YaAUq2+xrQdzMqFC1R17y0qiYWLAPKXbA88sXkONa2HgLZxvKp71U46AVDGPSgaiHTPJH1pwdXofGIVtQYXJq0SkOXiN9iLze1aUnAJlfbsW38UqVwSynw98OkiAPe3UEwhu9/oDeRfFGJoiDIZPNvN07RkuRlmxLv4uvyPw==","transmission_time":"2017-08-31T17:47:16Z","webhook_id":"55202735KB684492J","webhook_event":{"id":"WH-3BE52048KM9345358-3G618023B91033313","event_version":"1.0","create_time":"2017-08-31T17:47:16.251Z","resource_type":"invoices","event_type":"INVOICING.INVOICE.PAID","summary":"An invoice has been paid","resource":{"invoice":{"id":"INV2-DUVA-6QBD-F4GJ-9WHX","number":"2498","template_id":"TEMP-5ML62849WY523084R","status":"PAID","merchant_info":{"email":"seller@awesome.com","first_name":"Dennis","last_name":"Doctor","business_name":"ACME","phone":{"country_code":"1","national_number":"4082564877"},"address":{"line1":"2211 North First St","city":"San Jose","state":"CA","postal_code":"95131","country_code":"US"}},"billing_info":[{"email":"athroener@gmail.com","first_name":"Andrew","last_name":"Throener","business_name":"Andrew Throener","phone":{"country_code":"1","national_number":"4021112222"},"address":{"phone":{"country_code":"1","national_number":"4021112222"}},"additional_info":"CUST-00124"}],"shipping_info":{"first_name":"Andrew","last_name":"Throener","business_name":"Andrew Throener(CCUST-00124)"},"items":[{"name":"Item Name","quantity":1,"unit_price":{"currency":"USD","value":"60.00"}},{"name":"Item Name","quantity":1,"unit_price":{"currency":"USD","value":"100.00"}}],"invoice_date":"2017-08-31 PDT","referrer_code":"Hapi-Middleman","payment_term":{"term_type":"NET_15","due_date":"2017-09-15 PDT"},"tax_calculated_after_discount":false,"tax_inclusive":true,"note":"Thanks for your business!","total_amount":{"currency":"USD","value":"160.00"},"payments":[{"type":"PAYPAL","transaction_id":"70N57375CC0076435","transaction_type":"SALE","method":"PAYPAL","date":"2017-08-31 10:46:54 PDT","amount":{"currency":"USD","value":"160.00"}}],"metadata":{"created_date":"2017-08-31 10:45:19 PDT","last_updated_date":"2017-08-31 10:46:54 PDT","first_sent_date":"2017-08-31 10:45:20 PDT","last_sent_date":"2017-08-31 10:45:20 PDT"},"paid_amount":{"paypal":{"currency":"USD","value":"160.00"}},"links":[{"rel":"self","href":"https://api.sandbox.paypal.com/v1/invoicing/invoices/INV2-DUVA-6QBD-F4GJ-9WHX","method":"GET"}]}},"links":[{"href":"https://api.sandbox.paypal.com/v1/notifications/webhooks-events/WH-3BE52048KM9345358-3G618023B91033313","rel":"self","method":"GET"},{"href":"https://api.sandbox.paypal.com/v1/notifications/webhooks-events/WH-3BE52048KM9345358-3G618023B91033313/resend","rel":"resend","method":"POST"}]}}';

// tslint:disable-next-line:max-line-length
const other = '{"PayPal-Partner-Attribution-Id":"Hapi-Middleman","Authorization":"Bearer A21AAH0JZGElhtydETLVgrHgY6hDk3hxgiFjB1YL9pXcF9Mt6nOarBv7hzbKPNPVk0H9nTjM8hFP6P8rJh4kKkWYYvFs6coRw","Content-Length":2993,"Accept":"application/json","Content-Type":"application/json","PayPal-Request-Id":"bc7ed8e5-7efd-4a9e-ace8-f53356a18a0f","User-Agent":"PayPalSDK/PayPal-node-SDK 1.7.1 (node v8.1.4-x64-linux; OpenSSL 1.0.2l)"}';

const paypal = new PayPalRestApi(config);
async function example() {
    const response = await paypal.execute("verifyWebhook", {
        body: webhookEvent,
        headers: {
            "Content-Type": "application/json",
        },
        json: false,
    });
    return response;
}

// tslint:disable-next-line:no-console
example().then((response) => console.log(response.status)).catch((err) => console.error(err));
