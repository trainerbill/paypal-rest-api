import { RequestResponse, UriOptions } from "request";
import { RequestRetryOptions } from "requestretry";

export type RequestOptions = RequestRetryOptions & UriOptions;
export type RequestMethod = (options?: Partial<RequestOptions>) => Promise<RequestResponse>;
