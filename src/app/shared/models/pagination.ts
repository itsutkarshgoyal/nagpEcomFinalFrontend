import { IProduct } from "./product";

export interface IPagination {
    value: IProduct[] ;
}

export class Pagination implements IPagination {
    value: IProduct[] = [];
}
