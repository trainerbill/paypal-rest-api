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

export interface IFraudManagementFiltersDetails {
    filter_type: string;
    filter_id: string;
    name: string;
    description: string;
}

export interface IResponse {
    readonly httpStatusCode: number;
    readonly create_time?: string;
    readonly count?: number;
    readonly total_count?: number;
}

export interface IFilterOptions {
    page_size: number;
    start_time: string;
    end_time: string;
}

export interface IUpdateRequest {
    op: string;
    path: string;
    value: any;
}

export interface IAmount {
    currency: string;
    total: string;
    details?: {
        subtotal?: string;
        shipping?: string;
        tax?: string;
        handling_fee?: string;
        shipping_discout?: string;
        insurance?: string;
        gift_wrap?: string;
    };
}

export interface ICurrency {
    currency: string;
    value: string;
}

export interface ILink {
    href: string;
    method: string;
    rel: string;
}

export interface IPayee {
    email: string;
    merchant_id: string;
    payee_display_metadata?: {
        email?: string;
        display_phone?: IPhone;
        brand_name?: string;
    };
}

export interface IResource {
    readonly id: string;
    amount: IAmount;
    readonly payment_mode?: string;
    readonly state?: string;
    readonly reason_code?: string;
    readonly protection_eligibility?: string;
    readonly protection_eligibility_type?: string;
    readonly fmf_details?: IFraudManagementFiltersDetails;
    readonly receipt_id?: string;
    readonly parent_payment?: string;
    readonly processor_response?: any;
    readonly create_time?: string;
    readonly update_time?: string;
    readonly links?: ILink[];
}

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

export interface Item {
    currency: string;
    name: string;
    price: string;
    quantity: number;
    sku?: string;
    description?: string;
    tax?: string;
    url?: string;
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

export interface IRelatedResources {
    sale?: ISaleResource;
    authorization?: IAuthorizationResource;
    order?: any;
    capture?: ICaptureResource;
    refund?: IRefundResource;
}
