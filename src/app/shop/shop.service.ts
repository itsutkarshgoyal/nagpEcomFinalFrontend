import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBrand } from '../shared/models/brand';
import { IPagination, Pagination } from '../shared/models/pagination';
import { IType } from '../shared/models/productType';
import { map } from 'rxjs/operators';
import { ShopParams } from '../shared/models/shopParams';
import { IProduct } from '../shared/models/product';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  baseUrl = "https://nagp-product-final.wonderfulplant-99cca541.eastus.azurecontainerapps.io/";
  products: IProduct[] = [];
  brands: IBrand[] = [];
  types: IType[] = [];
  pagination = new Pagination();
  shopParams = new ShopParams();
  productCache = new Map();

  constructor(private http: HttpClient) { }

  searchProducts(search){
    let baseUrl  = 'https://searchroduct.search.windows.net/indexes/cosmosdb-index/docs';
    let queryKey = 'IYRlAyNcNdt53xAxKrFS7Xos1qT47j6XDcmcOi395uAzSeBhrMET';
    let params = new HttpParams();
    params = params.append('count', true);
    params = params.append('queryType', 'simple');
    params = params.append('search', search);
    params = params.append('searchMode', 'any');
    params = params.append('skip', 0);
    params = params.append('top', 50);

    let url = `${baseUrl}?api-version=2020-06-30`
    return this.http.get<IPagination>(url , { headers: {
      'api-key': queryKey
    }, observe: 'response', params })
      .pipe(
        map(response => {
          this.productCache.set(Object.values(this.shopParams).join('-'), response.body.value);
          this.pagination = response.body;
          return this.pagination;
        })
      )
  }

  getProducts(useCache: boolean) {
    if (useCache === false) {
      this.productCache = new Map();
    }

    if (this.productCache.size > 0 && useCache === true) {
      if (this.productCache.has(Object.values(this.shopParams).join('-'))) {
        this.pagination.value = this.productCache.get(Object.values(this.shopParams).join('-'));
        return of(this.pagination);
      }
    }

    let baseUrl  = 'https://searchroduct.search.windows.net/indexes/cosmosdb-index/docs';
    let queryKey = 'IYRlAyNcNdt53xAxKrFS7Xos1qT47j6XDcmcOi395uAzSeBhrMET';
    let params = new HttpParams();
    params = params.append('count', true);
    params = params.append('queryType', 'simple');
    params = params.append('search', '');
    params = params.append('searchMode', 'any');
    params = params.append('skip', 0);
    params = params.append('top', 50);

    let url = `${baseUrl}?api-version=2020-06-30`
    return this.http.get<IPagination>(url , { headers: {
      'api-key': queryKey
    }, observe: 'response', params })
      .pipe(
        map(response => {
          this.productCache.set(Object.values(this.shopParams).join('-'), response.body.value);
          this.pagination = response.body;
          return this.pagination;
        })
      )
  }

  setShopParams(params: ShopParams) {
    this.shopParams = params;
  }

  getShopParams() {
    return this.shopParams;
  }

  getProduct(id: number) {
    let product: IProduct;
    this.productCache.forEach((products: IProduct[]) => {
      console.log(product);
      product = products.find(p => p.id === id);
    })

    if (product) {
      return of(product);
    }

    return this.http.get<IProduct>(this.baseUrl + 'items/' + id);
  }

  getBrands() {
    if (this.brands.length > 0) {
      return of(this.brands);
    }
    return this.http.get<IBrand[]>(this.baseUrl + 'products/brands').pipe(
      map(response => {
        this.brands = response;
        return response;
      })
    )
  }

  getTypes() {
    if (this.types.length > 0) {
      return of(this.types);
    }
    return this.http.get<IType[]>(this.baseUrl + 'products/types').pipe(
      map(response => {
        this.types = response;
        return response;
      })
    )
  }
}
