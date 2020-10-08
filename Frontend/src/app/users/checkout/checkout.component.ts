import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Params } from '@angular/router';

// import {Stripe} from 'stripe'

declare var Stripe

@Component({
    selector:'app-checkout',
    templateUrl:'./checkout.component.html',
    styleUrls:['./checkout.component.css']
})
export class CheckoutComponent implements OnInit{
    productDetails:[]=[];
    total:number;
    //show:boolean=false;
    sessionId:string;
    dummyData = null

    stripe;
    query;
    isFetching:boolean = true;
    isOrder:boolean = true;
    userId:string;
    isPaid:boolean = false;

constructor(private http:HttpClient, private route:ActivatedRoute){}

ngOnInit(){

    this.http.get<{products:[],totalSum:number,sessionId:string}>('http://localhost:8080/checkout')
    .subscribe(res=>{
        console.log(res)
        this.productDetails = res.products
        this.total = res.totalSum;
        this.sessionId = res.sessionId
      
        if(this.productDetails.length < 1){
            this.isFetching = false;
            this.isOrder = true
        }else{
            this.isFetching = false;
            this.isOrder = false
        }
        //this.checkoutDetail=res;
    })

    this.route.paramMap.subscribe((paramMap:ParamMap)=>{
        if(paramMap.get('userId')){
            this.userId=paramMap.get('userId');
            this.http.get('http://localhost:8080/checkout/success/'+this.userId)
            .subscribe(res=>{
                console.log(res)
                this.isPaid = true;
           })
        }else{
            this.isPaid =false;
        }
        
    })
}

onOrder(){
    console.log(this.productDetails)
    this.stripe = Stripe('pk_test_51HI8Q3CqPaATR62WrBZ8m8RJXq0NckOqxS1hO3WVQ3BeOKrd5JV4wpF9gGbhTVaUe9ryr3k6zyAVLfNjEU4FJ5mR00D4liKjKd');
    this.stripe.redirectToCheckout({
        sessionId: this.sessionId
      }).then(function (result) {
        console.log(result);
      });
}

}