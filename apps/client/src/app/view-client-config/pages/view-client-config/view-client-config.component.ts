import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { ClientConfigService } from '../../../shared/config/services/client-config.service';
import { ClientApplicationConfiguration } from '../../../shared/config/model';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'da-view-client-config',
    standalone: true,
    imports: [SharedModule, CommonModule],
    templateUrl: './view-client-config.component.html',
    styleUrl: './view-client-config.component.scss',
})
export class ViewClientConfigComponent implements OnInit {
    public clientConfig: ClientApplicationConfiguration | undefined;
    constructor(private clientConfigService: ClientConfigService) {}
    ngOnInit(): void {
        this.clientConfigService.getClientConfig().subscribe((config) => {
            this.clientConfig = config;
        });
    }
}
