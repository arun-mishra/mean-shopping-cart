import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductDetail } from 'src/app/admin/products/products.component';
import { AuthService } from 'src/app/auth/auth.service';
import { VerifyTokenService } from 'src/app/auth/verifyToken.service';

export interface ShopData{
    currentPage:number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    lastPage:number;
    nextPage:number;
    previousPage:number;
    products:[]
}

@Component({
    selector:'app-shop',
    templateUrl:'./shop.component.html',
    styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit{
    isAdminAuthenticated =false;
    isAuthenticated = false;
    product_details:ProductDetail[] =[];
    isProducts:boolean = false;
    showPagination:boolean = false;

    currentPage:number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    lastPage:number;
    nextPage:number;
    previousPage:number;
    totalItems:number;
    query;
    queryParam;

    product_Id = {_id:''};

    constructor(private http:HttpClient,private verifyTokenService:VerifyTokenService,
        private authService:AuthService, private route:ActivatedRoute,private router: Router){}

    ngOnInit(){
        
        this.verifyTokenService.verifyAdminToken();
        this.authService.isAdminAuthenticated.subscribe(
            res=>{
                this.isAdminAuthenticated = res
            }
        )
        this.verifyTokenService.verifyUserToken();
        this.authService.isAuthenticated.subscribe(
            res=>{
                this.isAuthenticated = res
            }
        )
        this.route.queryParams.subscribe((params)=>{
            this.query= params['page']
        })

        this.getProduct();
    }
    
getProduct(){
    this.http.get<ShopData>(`http://localhost:8080/?page=${this.query}`)
    .subscribe(res=>{
        this.currentPage =res.currentPage;
        this.hasNextPage = res.hasNextPage;
        this.hasPreviousPage = res.hasPreviousPage;
        this.lastPage = res.lastPage;
        this.nextPage = res.nextPage;
        this.previousPage = res.previousPage;
        this.product_details = res.products;
        this.showPagination = true;
        console.log(res)
    })
}
addToCart(prodId){
    console.log(prodId)
    this.product_Id._id = prodId;
    this.http.post('http://localhost:8080/cart',this.product_Id)
    .subscribe(res=>{
            //console.log(res)
            this.router.navigate(['/cart']);
        })
    }


}