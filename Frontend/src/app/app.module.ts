import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';



import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';

import { SideNavComponent } from './side-nav/side-nav.component';

import { PageNotFoundComponent } from './shared/page-not-found/pageNotFound.component';

import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthInterceptor } from './auth/auth-interceptors.service';
import { AdminAuthComponent } from './auth/admin/adminAuth.component';
import { AdminComponent } from './admin/admin.component';
import { AddProductComponent } from './admin/add-product/add-product.component';
import { CartComponent } from './users/cart/cart.component';
import { OrdersComponent } from './users/orders/orders.component';
import { CheckoutComponent } from './users/checkout/checkout.component';
import { ProductsComponent } from './admin/products/products.component';
import { BookingsComponent } from './admin/bookings/bookings.component';
import { ShopComponent } from './users/shop/shop.component';
import { DetailsComponent } from './users/details/details.component';

// import { MatButtonModule } from '@angular/material/button';
// import { MatCardModule } from '@angular/material/card';
// import { MatSnackBarModule } from '@angular/material/snack-bar';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
//import { MatSidenavModule } from '@angular/material/sidenav';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SideNavComponent,
    PageNotFoundComponent,
    LoginComponent,
    SignupComponent,
    AdminAuthComponent,
    AdminComponent,
    AddProductComponent,
    CartComponent,
    OrdersComponent,
    CheckoutComponent,
    ProductsComponent,
    BookingsComponent,
    ShopComponent,
    DetailsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    HttpClientModule,

    // MatButtonModule,
    // MatCardModule,
    // MatSnackBarModule,
    // MatFormFieldModule,
    // MatInputModule,
    //MatSidenavModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass:AuthInterceptor,multi:true}
  ],
  bootstrap: [AppComponent],
    
    entryComponents:[]
})
export class AppModule { }
