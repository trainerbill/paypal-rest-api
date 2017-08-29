import { IAmount } from "./common";

export interface ICaptureRequest {
    amount?: IAmount;
    is_final_capture?: boolean;
    invoice_number?: string;
}
