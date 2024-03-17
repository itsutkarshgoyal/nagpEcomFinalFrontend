import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IBrand } from '../shared/models/brand';
import { IProduct } from '../shared/models/product';
import { IType } from '../shared/models/productType';
import { ShopParams } from '../shared/models/shopParams';
import { ShopService } from './shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  @ViewChild('search', {static: false}) searchTerm: ElementRef;
  products: IProduct[];
  brands: IBrand[];
  types: IType[];
  shopParams: ShopParams;
  totalCount: number;
  sortOptions = [
    {name: 'Alphabetical', value: 'name'},
    {name: 'Price: Low to high', value: 'priceAsc'},
    {name: 'Price: High to low', value: 'priceDesc'},
  ]

  constructor(private shopService: ShopService) { 
    this.shopParams = this.shopService.getShopParams();
  }

  ngOnInit(): void {
    this.getProducts(true);
    this.getBrands();
    this.getTypes();
  }
  
  getProducts(useCache = false) {
    this.shopService.getProducts(useCache).subscribe(response => {
      this.products = response.value;
      this.totalCount = response.value.length;
    }, error => {
      console.log(error);
    })
  }

  getBrands() {
    // this.shopService.getBrands().subscribe(response => {
    //   this.brands = [{id: 0, name: 'All'}, ...response];
    // }, error => {
    //   console.log(error);
    // })
    this.brands = [{id:1, name:"Nike"},{id:2,name:"Rebook"}]
  }

  getTypes() {
    // this.shopService.getTypes().subscribe(response => {
    //   this.types = [{id: 0, name: 'All'}, ...response];
    // }, error => {
    //   console.log(error);
    // })
  }

  onBrandSelected(brandId: number) {
    const params = this.shopService.getShopParams();
    params.brandId = brandId;
    params.pageNumber = 1;
    this.shopService.setShopParams(params);
    this.getProducts();
  }

  onTypeSelected(typeId: number) {
    const params = this.shopService.getShopParams();
    params.typeId = typeId;
    params.pageNumber = 1;
    this.shopService.setShopParams(params);
    this.getProducts();
  }

  onSortSelected(sort: string) {
    const params = this.shopService.getShopParams();
    params.sort = sort;
    this.shopService.setShopParams(params);
    this.getProducts();
  }

  onPageChanged(event: any) {
    const params = this.shopService.getShopParams();
    if (params.pageNumber !== event) {
      params.pageNumber = event;
      this.shopService.setShopParams(params);
      this.getProducts(true);
    }
  }

  onSearch() {
    this.shopService.searchProducts(this.searchTerm.nativeElement.value).subscribe(response => {
      this.products = response.value;
      this.totalCount = response.value.length;
    }, error => {
      console.log(error);
    })
  }

  onReset() {
    this.searchTerm.nativeElement.value = '';
    this.shopParams = new ShopParams();
    this.shopService.setShopParams(this.shopParams);
    this.getProducts();
  }

}
