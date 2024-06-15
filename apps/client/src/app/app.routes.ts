import { Routes } from '@angular/router';
import { ListAlertsComponent } from './list-alerts/pages/list-alerts/list-alerts.component';

export const routes: Routes = [
    {
        path: 'alerts/list',
        component: ListAlertsComponent,
    },
];
