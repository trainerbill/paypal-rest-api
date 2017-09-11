import { Schema } from "joi";
import { IApiSchemas } from "../../abstracts/api";
import { IAddress, ILink, IPhone, IResponse} from "../../api/types";
import { ICurrency } from "../../payment/types";

export interface IInvoice {
    allow_tip?: boolean;
    billing_info?: [IBillingInfo];
    discount?: ICost;
    shipping_cost?: IShippingCost;
    readonly id?: string;
    invoice_date?: string;
    items?: IInvoiceItem[];
    merchant_info?: IMerchant;
    readonly metadata?: {
        created_date?: string;
        created_by?: string;
        cancelled_date?: string;
        cancelled_by?: string;
        last_updated_date?: string;
        last_updated_by?: string;
        first_sent_date?: string;
        last_sent_date?: string;
        last_sent_by?: string;
        payer_view_url?: string;
    };
    note?: string;
    number?: string;
    payment_term?: IPaymentTerm;
    reference?: string;
    shipping_info?: {
        address: IAddress;
        business_name?: string;
        first_name: string;
        last_name: string;
    };
    phone?: IPhone;
    readonly status?: string;
    tax_calculated_after_discount?: boolean;
    tax_inclusive?: boolean;
    template_id?: string;
    readonly total_amount?: ICurrency;
    readonly uri?: string;
    cc_info?: IParticipant[];
    custom?: ICustomAmount;
    allow_partial_payment?: boolean;
    minimum_amount_due?: ICurrency;
    terms?: string;
    merchant_memo?: string;
    logo_url?: string;
    readonly payments?: IPaymentDetail[];
    readonly refunds?: IDetail[];
    readonly payment_summary?: {
        paypal: ICurrency;
        other: ICurrency;
    };
    readonly refunded_amount?: {
        paypal: ICurrency;
        other: ICurrency;
    };
    readonly paid_amount?: {
        paypal: ICurrency;
        other: ICurrency;
    };
    attachments?: IFileAttachment[];
    readonly links?: ILink[];
}

export interface IFileAttachment {
    name: string;
    url: string;
}

export interface IBillingInfo extends IPerson {
    email?: string;
    language?: string;
    notification_channel?: string;
    additional_info?: string;
}
export interface IInvoiceItem {
    name: string;
    description?: string;
    quantity: number;
    unit_price: ICurrency;
    tax?: ITax;
    date?: string;
    discount?: ICost;
    unit_of_measure?: string;
}
export interface ICustomAmount {
    label: string;
    amount: ICurrency;
}
export interface IShippingCost {
    amount?: ICurrency;
    tax?: ITax;
}
export interface ITax extends ICost {
    id?: string;
    name?: string;
}
export interface ICost {
    percent?: number;
    amount?: ICurrency;
}
export interface IPaymentTerm {
    term_type?: string;
    due_date?: string;
}
export interface IPerson {
    email?: string;
    first_name?: string;
    last_name?: string;
    business_name?: string;
    phone?: IPhone;
    website?: string;
    address?: IAddress;
}
export interface IMerchant extends IPerson {
    tax_id?: string;
    fax?: IPhone;
    additional_info_label?: string;
    additional_info?: string;
}
export interface IParticipant extends IPerson {
    email: string;
    fax?: IPhone;
    additional_info?: string;
}
export interface IDetail {
    type: string;
    transaction_id: string;
    date: string;
    note?: string;
    amount: ICurrency;
}
export interface IPaymentDetail extends IDetail {
    transaction_type: string;
    method: string;
}
