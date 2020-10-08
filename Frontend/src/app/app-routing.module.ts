import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'
import { AppComponent } from './app.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './home/home.component';
import { AdminAuthComponent } from './auth/admin/adminAuth.component';
import { AddProductComponent } from './admin/add-product/add-product.component';
import { CartComponent } from './users/cart/cart.component';
import { OrdersComponent } from './users/orders/orders.component';
import { CheckoutComponent } from './users/checkout/checkout.component';
import { ProductsComponent } from './admin/products/products.component';
import { BookingsComponent } from './admin/bookings/bookings.component';
import { ShopComponent } from './users/shop/shop.component';
import { DetailsComponent } from './users/details/details.component';


const appRoutes:Routes = [
    {path:'',component:HomeComponent},
    {path:'auth',children:[
        {path:'signup',component:SignupComponent},
        {path: 'login',component:LoginComponent},
        {path: 'admin',component: AdminAuthComponent}
    ]},
    {path: 'admin/add-product',component:AddProductComponent},
    {path:'admin/edit-product/:productId',component:AddProductComponent},
    {path:'cart',component:CartComponent},
    {path:'orders',component:OrdersComponent},
    {path:'checkout',component:CheckoutComponent},
    {path:'checkout/:userId',component:CheckoutComponent},
    {path:'details/:productId',component:DetailsComponent},
    {path:'admin/products',component:ProductsComponent},
    {path:'admin/bookings',component:BookingsComponent},
    {path:'shop',component:ShopComponent}
]
 @NgModule({
     imports:[RouterModule.forRoot(appRoutes)],
     exports:[RouterModule]
 })

 export class AppRoutingModule{

 }