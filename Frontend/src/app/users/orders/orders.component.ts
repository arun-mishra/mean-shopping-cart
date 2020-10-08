import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from "@angular/core";

@Component({
    selector:'app-orders',
    templateUrl:'./orders.component.html',
    styleUrls:['./orders.component.css']
})

export class OrdersComponent implements OnInit{
    orderDetails:[]=[];
    isFetching:boolean = true;
    isOrder:boolean=true;
    constructor(private http:HttpClient){}
    
    ngOnInit(){
        this.http.get<[]>('http://localhost:8080/orders')
        .subscribe(res=>{
            this.orderDetails = res
            if(this.orderDetails.length < 1)
            {
                this.isOrder = true;
                this.isFetching = false;
            }
            else {
                this.isOrder = false;
                this.isFetching = false;
            }
            console.log(res)
        })
    }
    onInvoice(orderId){
     this.http.get('http://localhost:8080/orders/'+orderId)
     .subscribe(res=>{
         console.log(res)
     })
    }
}