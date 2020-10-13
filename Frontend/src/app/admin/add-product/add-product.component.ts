import { HttpClient } from '@angular/common/http';

import { Component, ViewChild } from "@angular/core";
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { UIService } from 'src/app/shared/uiService.service';


export interface ProductData{
  title:string;
  price:number;
  fd:any;
  description:string
}

@Component({
    selector:'app-add-product',
    templateUrl:'./add-product.component.html',
    styleUrls:['./add-product.component.css']
})

export class AddProductComponent {
//'../../../assets/images/profile_pic_boys.jpg'
addProduct:FormGroup;
    onLoadingState=false;
    imgSrc:string;
    // imageUpload:FormGroup;
    selectedFile:File=null;
    editMode:boolean = false;
    productId:string;
  
    @ViewChild(FormGroupDirective) formGroupDirective:FormGroupDirective
  
    constructor(private http:HttpClient,private uiService:UIService,public route:ActivatedRoute) {}
  
    ngOnInit() {


      this.addProduct=new FormGroup({
        'title':new FormControl(null,[Validators.required,Validators.minLength(3)]),
        'price':new FormControl(null,[Validators.required]),
        // 'imageUrl' : new FormControl('',Validators.required)
        'image': new FormControl(null,Validators.required),
        'description': new FormControl('',[Validators.required,Validators.minLength(5)])
      })
      this.uiService.isSignupLoadingState.subscribe(res=>{
        this.onLoadingState=res;
      })

      this.route.paramMap.subscribe((paramMap:ParamMap)=>{
        if(paramMap.has('productId')){
          this.productId=paramMap.get('productId');
          this.editMode = true;
          this.http.get<{title:string,description:string,price:number}>('http://localhost:8080/admin/getProduct/'+this.productId)
          .subscribe(res=>{
              const prodDetail = res;
              this.addProduct.patchValue({"title":prodDetail?.title})
              this.addProduct.patchValue({"description":prodDetail?.description})
              this.addProduct.patchValue({"price":prodDetail?.price})
             
          })
        }else{
          console.log('failed')
          this.editMode = false;
          this.productId=null;
          }
      })

  
    
    }

  //   onFileSelect(event){
   
  //     this.selectedFile=<File>event.target.files[0];
  //     if(event.target.files && event.target.files[0]){
  //         const reader=new FileReader();
  //         reader.onload=(e:any)=>this.imgSrc=e.target.result;
  //         reader.readAsDataURL(event.target.files[0]);
  //         this.selectedFile=event.target.files[0];
  //     }else{
  //         this.imgSrc='../../../assets/images/profile_pic_boys.jpg';
  //         this.selectedFile=null;
  //     }
  //     console.log(this.selectedFile)
  // }
  
    onSubmit(){


      this.onLoadingState=true;
      const title = this.addProduct.value.title;
      const price = this.addProduct.value.price;
      const description = this.addProduct.value.description;
      const image = this.addProduct.value.image;
     // const imageUrl = this.addProduct.value;
      //console.log(imageUrl)
      const fd= new FormData();
      fd.append('image',this.selectedFile);
      fd.append('title',title);
      fd.append('price',price);
      fd.append('description',description);
      fd.append('image',image);

      //console.log(this.selectedFile)
      // const productData:ProductData = {title:title,price:price,description:description,fd:fd}
      console.log(this.editMode)

      if(this.editMode){
        this.http.post('http://localhost:8080/admin/edit-product',{productId:this.productId ,title:title,price:price,description:description,image:image})
        .subscribe(res=>{
          this.onLoadingState=false;
          console.log(res);
          this.uiService.showSnackBar('Product Edited Successfully!!!',null,3000);
        })
      }else{
        this.http.post('http://localhost:8080/admin/add-product',{title:title,price:price,description:description,image:image})
        .subscribe(res=>{
          console.log(res)
          this.onLoadingState=false;
          this.uiService.showSnackBar('Product Added Successfully!!!',null,3000);
        })
      }


    
     
     
     // this.authService.createUser(email,password)
      this.addProduct.reset();
      setTimeout(() => this.formGroupDirective.resetForm(), 0)
         
  }

}