import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ProductDetail } from 'src/app/admin/products/products.component';
import { AuthService } from 'src/app/auth/auth.service';
import { VerifyTokenService } from 'src/app/auth/verifyToken.service';

@Component({
    selector:'app-details',
    templateUrl:'./details.component.html',
    styleUrls:['./details.component.css']
})
export class DetailsComponent implements OnInit{
    isAdminAuthenticated =false;
    productDetail={title:'',price:null,description:'',_id:''};
    isProducts:boolean = false;
    productId:string;

    isFetching:boolean=true;
    isProduct:boolean=false;

    constructor(private http:HttpClient,private verifyTokenService:VerifyTokenService,
        private authService:AuthService,private route: ActivatedRoute, private router:Router){}

    ngOnInit(){
        this.route.paramMap.subscribe((paramMap:ParamMap)=>{
            if(paramMap.has('productId')){
            this.productId=paramMap.get('productId');
            //   this.editMode = true;
            this.http.get<{title:string,description:string,price:number,_id:string}>('http://localhost:8080/admin/getProduct/'+this.productId)
              .subscribe(res=>{
                  this.isFetching=false;
                  this.isProduct=true;
                  console.log(res)
                  this.productDetail.title=res.title;
                  this.productDetail.description=res.description;
                  this.productDetail.price=res.price;
                  this.productDetail._id= res._id;

                 
              })
            }else{
    }
})
        this.verifyTokenService.verifyAdminToken();
        this.authService.isAdminAuthenticated.subscribe(
            res=>{
                this.isAdminAuthenticated = res
            }
        )
    }
    onAddToCart(prodId){
        console.log(prodId)
        this.http.post('http://localhost:8080/cart',this.productDetail)
        .subscribe(res=>{
                //console.log(res)
                this.router.navigate(['/cart']);
            })
        }
    }