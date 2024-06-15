import { Injectable } from '@angular/core';
import { ClientConfigService } from './client-config.service';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ServerConfigService {
    constructor(
        private http: HttpClient,
        private clientConfigService: ClientConfigService,
    ) {}

    public getServerConfig(): Observable<object> {
        return this.clientConfigService.getClientConfig().pipe(
            switchMap((clientConfig) => {
                const url = `${clientConfig.server.url}/api/${clientConfig.server.apiVersion}/config`;
                return this.http.get(url).pipe(map((res) => (res as any).data));
            }),
        );
    }
}
