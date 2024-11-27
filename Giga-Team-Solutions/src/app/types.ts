import { HttpHeaders } from "@angular/common/http";
import { HttpContext } from "@angular/common/http";
import { HttpParams } from "@angular/common/http";

export interface Options {
    headers?: HttpHeaders | {
        [header: string]: string | string[];
    };
    observe?: 'body';
    context?: HttpContext;
    params?: HttpParams | {
        [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
    };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
    transferCache?: {
        includeHeaders?: string[];
    } | boolean;
}
export interface Products{
    items: Product[];
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
}
export interface Product{
    id: number;
    image: string;
    name: string;
    oldprice: number;
    price: number;
    category: string;
    onoffer: boolean;
    bestselling: boolean;
    description: string;
}
export interface CartItem {
    id: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
  }
 export interface PaginatorState {
    first?: number;
    rows?: number;
  }
  
export interface Category {
    name: string;
    subOptions: SubOption[];
  }
export interface SubOption {
    name: string;
  }