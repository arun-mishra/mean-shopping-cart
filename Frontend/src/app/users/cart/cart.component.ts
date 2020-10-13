import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

export interface ProductDetail{

    productId:string;
    quantity:number;
    _id:string;
    
}

@Component({
    selector:'app-cart',
    templateUrl:'./cart.component.html',
    styleUrls:['./cart.component.css']
})

export class CartComponent implements OnInit{
    // increaseQuantity:FormGroup;

    productDetails:ProductDetail[]=[];
    isFetching:boolean =true;
    isProduct:boolean=true;

    constructor(private router:Router, private http:HttpClient){}

   @ViewChild('increaseQuantity') increaseQuantity:ElementRef;

    ngOnInit(){
        this.getCartItems();
      
    }
    getCartItems(){
        this.http.get<ProductDetail[]>('http://localhost:8080/cart')
        .subscribe(res=>{
            console.log(res)
            this.productDetails = res;
            if(this.productDetails.length < 1){
                this.isProduct = true;
                this.isFetching = false;
            }else{
                this.isProduct = false
                this.isFetching = false;
            }
            console.log(res)
            
        })
    }

    onDelete(productId){
        this.http.post("http://localhost:8080/cart-delete-item",{productId:productId})
        .subscribe(res=>{
            console.log(res);
            this.getCartItems();
           
        })
    }
    onAddQuantity(id,increasedQty:number){
       console.log(id,"----",increasedQty)
       this.productDetails.forEach(row=>{
           if(row._id === id){
               row.quantity = (+increasedQty);
               console.log(this.productDetails)
               this.http.post('http://localhost:8080/multi-cart-item',this.productDetails)
               .subscribe(res=>{
                    //    console.log(res)
                      
                   })
           }
       })
      
    }
    
         
    
}