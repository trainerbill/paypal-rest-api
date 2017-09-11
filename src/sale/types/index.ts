import { Schema } from "joi";
import { IModel } from "../../abstracts/model";
import { ICurrency, ILink, IResponse } from "../../api/types";
import { IResource } from "../../payment/types";

export interface ISale extends IResource {
    readonly purchase_unit_reference_id?: string;
    readonly clearing_time?: string;
    readonly payment_hold_status?: string;
    readonly payment_hold_reasons?: string[];
    readonly transaction_fee?: ICurrency;
    readonly exchange_rate?: string;
    readonly billing_agreement_id?: string;
}
