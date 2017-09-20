import { WebhookEventModel } from "./";
import { IWebhookEvent } from "./types";

// tslint:disable
export const mockInvoiceWebhookHeaders = {
    "paypal-transmission-id": "dbae9240-93ee-11e7-ac1e-6b62a8a99ac4",
    "paypal-transmission-time": "2017-09-07T17:06:15Z",
    "paypal-cert-url": "https://api.sandbox.paypal.com/v1/notifications/certs/CERT-360caa42-fca2a594-aecacc47",
    "paypal-auth-algo": "SHA256withRSA",
    "paypal-transmission-sig": "iy43ZeB6C9bv8hm3TYihYKwVhjCLdwmMHNdFETRtUgOUqI+nRwaHYPfQoEC9sutK3xDzs+Z+CxLqSg36yXghq8G/h7QT3H5jK2DNwF3tVzEeti4+O1MRAptTi2VOIaAAoc0RbnLMReY6csa+MeHZPKR6orh9f8js5LNWuF1QX3P7YlykApIkb04pvGTRsjdr8FCe8cOUaeqhLUyGeNcUHPhWQ5JfR9v3j2rDNucW82Js0N7yEDQfnkozCRGmQP1zPI4bsHNWNsL7nbtkZWCGD1jCjnPRaYgCRbHYnvAKJGxNuybhGyY+8XIeSQNNXBbSQqnx+dCC68Y0EKNbhMT/7A==",
};
export const mockInvoiceWebhookId = "1X200851AC360471T";
export const mockInvoiceWebhookEvent = '{"id":"WH-7DY07755ND361601N-9HP8009531439713D","event_version":"1.0","create_time":"2017-09-07T17:06:15.389Z","resource_type":"invoices","event_type":"INVOICING.INVOICE.CREATED","summary":"An invoice has been created","resource":{"invoice":{"id":"INV2-9BTP-HZQP-2P35-KZ92","number":"test0042","template_id":"TEMP-5ML62849WY523084R","status":"DRAFT","merchant_info":{"business_name":"testy"},"invoice_date":"2017-09-07 PDT","tax_calculated_after_discount":false,"tax_inclusive":false,"total_amount":{"currency":"USD","value":"0.00"},"metadata":{"created_date":"2017-09-07 10:05:49 PDT"},"links":[{"rel":"self","href":"https://api.sandbox.paypal.com/v1/invoicing/invoices/INV2-9BTP-HZQP-2P35-KZ92","method":"GET"},{"rel":"send","href":"https://api.sandbox.paypal.com/v1/invoicing/invoices/INV2-9BTP-HZQP-2P35-KZ92/send","method":"POST"},{"rel":"update","href":"https://api.sandbox.paypal.com/v1/invoicing/invoices/INV2-9BTP-HZQP-2P35-KZ92/update","method":"PUT"},{"rel":"delete","href":"https://api.sandbox.paypal.com/v1/invoicing/invoices/INV2-9BTP-HZQP-2P35-KZ92","method":"DELETE"}]}},"links":[{"href":"https://api.sandbox.paypal.com/v1/notifications/webhooks-events/WH-7DY07755ND361601N-9HP8009531439713D","rel":"self","method":"GET"},{"href":"https://api.sandbox.paypal.com/v1/notifications/webhooks-events/WH-7DY07755ND361601N-9HP8009531439713D/resend","rel":"resend","method":"POST"}]}';
// tslint:enable
