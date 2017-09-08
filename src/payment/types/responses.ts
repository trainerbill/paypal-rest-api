import { ILink } from "../../api/types";
import { IPayment } from "./common";

export interface IPaymentListResponse {
    payments: IPayment[];
    links: ILink[];
}
