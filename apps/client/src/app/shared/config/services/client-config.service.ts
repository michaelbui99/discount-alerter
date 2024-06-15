import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClientApplicationConfiguration } from '../model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ClientConfigService {
    constructor(private http: HttpClient) {}

    public getClientConfig(): Observable<ClientApplicationConfiguration> {
        return this.http.get(
            'assets/config.json',
        ) as Observable<ClientApplicationConfiguration>;
    }
}
