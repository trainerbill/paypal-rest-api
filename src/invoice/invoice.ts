import { Client, RequestMethod, RequestOptions } from "../client";
import { InvoiceApi } from "./api";
import { InvoiceModel } from "./model";

export class Invoice {
    public model = InvoiceModel;
    public api: InvoiceApi;

    constructor(private client: Client) {
        this.api = new InvoiceApi(client);
        this.model.prototype.api = this.api;
    }
}
