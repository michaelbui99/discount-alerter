import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { ClientConfigService } from './shared/config/services/client-config.service';
import { ClientApplicationConfiguration } from './shared/config/model';
import { CommonModule } from '@angular/common';
import { ListAlertsComponent } from './list-alerts/pages/list-alerts/list-alerts.component';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        SharedModule,
        ListAlertsComponent,
        NavbarComponent,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
    public clientConfig: ClientApplicationConfiguration | undefined;

    constructor(private clientConfigService: ClientConfigService) {
        clientConfigService.getClientConfig().subscribe((data) => {
            console.log('DATA', data);
            this.clientConfig = data;
        });
    }
}
