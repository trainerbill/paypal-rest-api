import { IAddress, ILink, IPhone } from "../../api/types";
import { ISale } from "../../sale/types";

export interface IPayment {
    readonly id?: string;
    intent: string;
    payer: {
        payment_method: string;
        readonly payer_info?: {
            readonly email: string;
            readonly salutation?: string;
            readonly first_name?: string;
            readonly middle_name?: string;
            readonly last_name?: string;
            readonly suffix?: string;
            readonly payer_id: string;
            readonly phone?: string;
            readonly phone_type?: string;
            readonly birth_date?: string;
            readonly tax_id_type?: string;
            readonly country_code?: string;
            readonly billing_address?: IAddress;
        }
    };
    transactions: [ ITransaction ];
    readonly state?: string;
    experience_profile_id?: string;
    note_to_payer?: string;
    redirect_urls?: {
        return_url?: string;
        cancel_url?: string;
    };
    readonly failure_reason?: string;
    readonly create_time?: string;
    readonly update_time?: string;
    readonly links?: ILink[];
}

export interface ITransaction {
    reference_id?: string;
    amount: IAmount;
    description?: string;
    item_list?: {
        items: ITransactionItem[];
        shipping_address?: IAddress;
        shipping_method?: string;
        shipping_phone_number?: string;
    };
    payee?: IPayee;
    note_to_payee?: string;
    custom?: string;
    invoice_number?: string;
    purchase_order?: string;
    soft_descriptor?: string;
    payment_options?: {
        allowed_payment_method: string;
    };
    notify_url?: string;
    order_url?: string;
    readonly related_resources?: IRelatedResources[];
}

export interface ITransactionItem {
    currency: string;
    name: string;
    price: string;
    quantity: number;
    sku?: string;
    description?: string;
    tax?: string;
    url?: string;
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

export interface IPayee {
    email: string;
    merchant_id: string;
    payee_display_metadata?: {
        email?: string;
        display_phone?: IPhone;
        brand_name?: string;
    };
}

export interface IRelatedResources {
    readonly sale?: ISale;
    readonly authorization?: IAuthorizationResource;
    readonly order?: any;
    readonly capture?: ICaptureResource;
    readonly refund?: IRefundResource;
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

export interface ICurrency {
    currency: string;
    value: string;
}

export interface IFraudManagementFiltersDetails {
    filter_type: string;
    filter_id: string;
    name: string;
    description: string;
}
