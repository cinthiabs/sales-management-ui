import { Routes } from '@angular/router';
import { ImportExcelSalesComponent } from './pages/sales/import-excel-sales/import-excel-sales.component';
import { RegisterSalesComponent } from './pages/sales/register-sales/register-sales.component';
import { RegisterProductsComponent } from './pages/product/register-products/register-products.component';
import { ReportProductsComponent } from './pages/report/report-products/report-products.component';
import { ReportSalesComponent } from './pages/report/report-sales/report-sales.component';

export const routes: Routes = [
    {path: '', redirectTo:'/',pathMatch: 'full'},
    {path: 'import-excel-sales',component: ImportExcelSalesComponent},
    {path: 'register-sales',component: RegisterSalesComponent},
    {path: 'register-products',component: RegisterProductsComponent},
    {path: 'report-sales',component: ReportSalesComponent },
    {path: 'report-products',component: ReportProductsComponent }
];
