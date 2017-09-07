import { ILink } from "../../types";
import { IInvoice } from "./common";

export interface IInvoiceListResponse {
    invoices: IInvoice[];
    links: ILink[];
}
