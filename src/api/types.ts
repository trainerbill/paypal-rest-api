import { RequestRetryOptions } from "requestretry";
import { RequestOptions } from "../client";

export interface IConfigureOptions {
    client_id: string;
    client_secret: string;
    mode: string;
    requestOptions?: Partial<RequestOptions>;
}

export interface IAddress {
    line1: string;
    line2?: string;
    city: string;
    country_code: string;
    postal_code: string;
    state: string;
    phone?: IPhone;
    readonly normalization_status?: string;
    type?: string;
    recipient_name?: string;
}

export interface IPhone {
    country_code: string;
    national_number: string;
}

export interface IResponse {
    readonly httpStatusCode: number;
    readonly create_time?: string;
    readonly count?: number;
    readonly total_count?: number;
}

export interface IUpdateRequest {
    op: string;
    path: string;
    value: any;
}

export interface ILink {
    href: string;
    method: string;
    rel: string;
}

/*
export interface ISaleResource extends IResource {
    readonly purchase_unit_reference_id?: string;
    readonly clearing_time?: string;
    readonly payment_hold_status?: string;
    readonly payment_hold_reasons?: string[];
    readonly transaction_fee?: ICurrency;
    readonly exchange_rate?: string;
    readonly billing_agreement_id?: string;
}

export interface IAuthorizationResource extends IResource {
    readonly valid_until: string;
    readonly update_time: string;
    readonly reference_id?: string;
}

export interface ICaptureResource extends IResource {
    is_final_capture?: boolean;
    invoice_number?: string;
    transaction_fee?: ICurrency;
}

export interface IRefundResource extends IResource {
    reason?: string;
    invoice_number?: string;
    readonly sale_id?: string;
    readonly capture_id?: string;
    description?: string;
    readonly reason_code?: string;
    readonly refund_reason_code?: string;
    readonly refund_funding_type?: string;
}

export interface IRefundRequest {
    amount?: IAmount;
    description?: string;
    refund_source?: string;
    reason?: string;
    invoice_number?: string;
    refund_advice?: boolean;
    items?: Item[];
    // TODO: Type this https://developer.paypal.com/docs/api/payments/#definition-payer_info
    payer_info?: any;
    supplementary_data?: any[];
}
*/
