import { Routes } from '@angular/router';
import { ProductListComponent } from './Pages/product-list/product-list.component';
import { CartComponent } from './Pages/cart/cart.component';
import { CheckoutComponent } from './Pages/checkout/checkout.component';
import { ConfirmationComponent } from './Pages/confirmation/confirmation.component';




export const routes: Routes = [

        {path:'',redirectTo:'/products',pathMatch:'full'},
        {path:'products',component:ProductListComponent},
        {path:'cart',component:CartComponent},
        {path:'checkout',component:CheckoutComponent},
        {path:'confirmation',component:ConfirmationComponent},
        {path:'**',redirectTo:'/products'}
];//end


