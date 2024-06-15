import { Routes } from '@angular/router';
import { ListAlertsComponent } from './list-alerts/pages/list-alerts/list-alerts.component';
import { ViewClientConfigComponent } from './view-client-config/pages/view-client-config/view-client-config.component';
import { ViewServerConfigComponent } from './view-server-config/pages/view-server-config/view-server-config.component';

export const routes: Routes = [
    {
        path: 'alerts/list',
        component: ListAlertsComponent,
    },
    {
        path: 'config/client',
        component: ViewClientConfigComponent,
    },
    {
        path: 'config/server',
        component: ViewServerConfigComponent,
    },
];
