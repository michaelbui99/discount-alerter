import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientConfigService } from './config/services/client-config.service';

@NgModule({
    imports: [CommonModule],
    providers: [ClientConfigService],
})
export class SharedModule {}
