import { Routes } from '@angular/router';
import { RegisterProductsComponent } from './pages/product/register-products/register-products.component';
import { ReportProductsComponent } from './pages/report/report-products/report-products.component';
import { ReportSalesComponent } from './pages/report/report-sales/report-sales.component';
import { HomeComponent } from './pages/home/home.component';
import { ReportCostsComponent } from './pages/report/report-costs/report-costs.component';
import { UploadComponent } from './pages/upload/upload.component';
import { RegisterCostsComponent } from './pages/costs/register-costs/register-costs.component';
import { RegisterSalesComponent } from './pages/sales/register-sales/register-sales.component';
import { ProfileComponent } from './pages/login/profile/profile.component';
import { AuthComponent } from './pages/login/auth/auth.component';
import { CalculateComponent } from './pages/costs/calculate/calculate.component';

export const routes: Routes = [
    {path: '', redirectTo:'/auth',pathMatch: 'full'},
    {path: 'home',component: HomeComponent},
    {path: 'register-products',component: RegisterProductsComponent},
    {path: 'register-costs', component: RegisterCostsComponent},
    {path: 'register-sales', component: RegisterSalesComponent},
    {path: 'report-sales',component: ReportSalesComponent },
    {path: 'report-products',component: ReportProductsComponent },
    {path: 'report-costs',component: ReportCostsComponent },
    {path: 'calculate',component: CalculateComponent },
    {path: 'upload',component: UploadComponent },
    {path: 'profile', component:ProfileComponent},
    {path: 'auth', component:AuthComponent}
];
