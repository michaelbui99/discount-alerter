import { Component, OnInit } from '@angular/core';
import { ServerConfigService } from '../../../shared/config/services/server-config.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'da-view-server-config',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './view-server-config.component.html',
    styleUrl: './view-server-config.component.scss',
})
export class ViewServerConfigComponent implements OnInit {
    public serverConfig: any;

    constructor(private serverConfigService: ServerConfigService) {}
    ngOnInit(): void {
        this.serverConfigService.getServerConfig().subscribe((config) => {
            console.log(config);
            this.serverConfig = config;
        });
    }
}
