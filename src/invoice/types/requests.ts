import { Schema } from "joi";
import { IApiSchemas } from "../../abstracts/api";
import { ICurrency } from "../../payment/types";

export interface IInvoiceRequestSchemas extends IApiSchemas {
    cancel: Schema;
    generate: Schema;
    qr: Schema;
    remind: Schema;
    recordPayment: Schema;
    recordRefund: Schema;
    send: Schema;
    search: Schema;
}

export interface IInvoiceRecordPaymentRequest extends IInvoiceRecordRefundRequest {
    method: string;
}

export interface IInvoiceRecordRefundRequest {
    date?: string;
    note?: string;
    amount?: ICurrency;
}

export interface IQrQueryParams {
    height?: number;
    width?: number;
}

export interface IInvoiceSearchRequest {
    email?: string;
    recipient_first_name?: string;
    recipient_last_name?: string;
    recipient_business_name?: string;
    number?: string;
    status?: string[];
    lower_total_amount?: string;
    upper_total_amount?: string;
    start_invoice_date?: string;
    end_invoice_date?: string;
    start_due_date?: string;
    end_due_date?: string;
    start_payment_date?: string;
    end_payment_date?: string;
    start_creation_date?: string;
    end_creation_date?: string;
    page?: number;
    page_size?: number;
    total_count_required?: boolean;
    archived?: boolean;
}
