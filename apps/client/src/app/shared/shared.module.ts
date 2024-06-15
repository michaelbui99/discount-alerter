import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientConfigService } from './config/services/client-config.service';
import { ServerConfigService } from './config/services/server-config.service';

@NgModule({
    imports: [CommonModule],
    providers: [ClientConfigService, ServerConfigService],
})
export class SharedModule {}
