import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

export interface OrderData{
    currentPage:number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    lastPage:number;
    nextPage:number;
    previousPage:number;
    orders:[]
}

@Component({
    selector:'app-bookings',
    templateUrl:'./bookings.component.html',
    styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit{

    bookingsDetails:[]=[];
    isFetching:boolean=true;
    isOrder:boolean= true;

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

    constructor(private http : HttpClient,private route:ActivatedRoute){}

    ngOnInit(){
        this.route.queryParams.subscribe((params)=>{
            this.query= params['page']
        })
        this.getBookings();
    
    }
    getBookings(){
        this.http.get<OrderData>(`http://localhost:8080/admin/bookings?page=${this.query}`)
        .subscribe(res=>{
            this.currentPage =res.currentPage;
            this.hasNextPage = res.hasNextPage;
            this.hasPreviousPage = res.hasPreviousPage;
            this.lastPage = res.lastPage;
            this.nextPage = res.nextPage;
            this.previousPage = res.previousPage;
            this.bookingsDetails = res.orders;
            if(this.bookingsDetails.length < 1){
                this.isFetching = false;
                this.showPagination = false
                this.isOrder = true;
            }else{
                this.isOrder = false;
                this.isFetching= false;
                this.showPagination = true;
            }
            console.log(res)
        })
    }

}