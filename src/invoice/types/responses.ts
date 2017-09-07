import { ILink } from "../../api/types";
import { IInvoice } from "./common";

export interface IInvoiceListResponse {
    invoices: IInvoice[];
    links: ILink[];
}
