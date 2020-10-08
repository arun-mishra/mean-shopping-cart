import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { UIService } from 'src/app/shared/uiService.service';
import { ShopData } from 'src/app/users/shop/shop.component';

export interface ProductDetail{
    title:string;
    price:number;
    description:string;
    imageUrl;
}

@Component({
    selector:'app-products',
    templateUrl:'./products.component.html',
    styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit{
    product_title:string;
    product_price:string;
    prooduct_description:string;
    isProducts :boolean= true;
    imageUrl;

    isFetching:boolean=true;

    product_details:ProductDetail[] =[];

    currentPage:number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    lastPage:number;
    nextPage:number;
    previousPage:number;
    totalItems:number;
    query;
    queryParam;
    showPagination:boolean = false;

    product_Id = {_id:''};

    constructor(private http:HttpClient,private uiService:UIService,private route:ActivatedRoute){}

ngOnInit(){

    this.route.queryParams.subscribe((params)=>{
        this.query= params['page']
    })

    this.getProduct();
   
}

getProduct(){
    this.http.get<ShopData>(`http://localhost:8080/admin/products?page=${this.query}`)
    .subscribe(res=>{
        this.currentPage =res.currentPage;
        this.hasNextPage = res.hasNextPage;
        this.hasPreviousPage = res.hasPreviousPage;
        this.lastPage = res.lastPage;
        this.nextPage = res.nextPage;
        this.previousPage = res.previousPage;
        this.product_details = res.products;
        if(this.product_details.length < 1){
            this.isProducts =true;
            this.isFetching = false;
            this.showPagination = false;
        }else{
            this.isProducts =false;
            this.isFetching = false;
            this.showPagination = true;
        }
    })
}

// getProduct(){
//     this.http.get<ShopData>('http://localhost:8080/admin/products')
//     .subscribe(res=>{
//         console.log(res)
//         // this.product_details=res
       
//     })
// }

onDelete(productId){
    this.http.delete('http://localhost:8080/admin/product/'+productId)
    .subscribe(res=>{

        this.uiService.showSnackBar('Successfully Deleted!!!',null,3000)
        this.getProduct();
    })
}


    
}