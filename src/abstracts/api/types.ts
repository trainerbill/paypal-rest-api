import { Schema } from "joi";

export interface IApiSchemas {
    id?: Schema;
    get?: Schema;
    create?: Schema;
    update?: Schema;
    list?: Schema;
    delete?: Schema;
    search?: Schema;
}

export interface IApiPaths {
    get?: string;
    create?: string;
    update?: string;
    list?: string;
    delete?: string;
    search?: string;
}

export interface IUpdateRequestParam {
    op: string;
    path: string;
    value: any;
}

export type UpdateRequest = IUpdateRequestParam[];
