import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { RandrPolicyComponent } from './components/randr-policy/randr-policy.component';
import { authGuard } from './guards/auth.guard';
import { CartComponent } from './components/cart/cart.component';
import { ShopComponent } from './shop/shop.component';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'shop',
        component: ShopComponent
    },
    {
        path: 'search',
        component: SearchResultsComponent
    },
    {
        path: 'product',
        component: ProductDetailComponent
    },
    {
        path: 'cart',
        component: CartComponent
    },
    {
        path: 'admin-home',
        loadChildren:()=> import('./modules/admin-home/admin-home.module').then(
            (m) => m.AdminHomeModule
        ),
        canActivate:[authGuard]
    },
    {
        path: 'privacy-policy',
        component: PrivacyPolicyComponent,
    },
    {
        path: 'randr-policy',
        component: RandrPolicyComponent,
    },
    {
        path: 'about-us',
        loadChildren:()=> import('./modules/about-us/about-us.module').then(
            (m) => m.AboutUsModule
        )
    },
    {
        path: 'contact-us',
        loadChildren:()=> import('./modules/contact-us/contact-us.module').then(
            (m) => m.ContactUsModule
        )
    },
];
