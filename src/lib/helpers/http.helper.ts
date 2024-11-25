import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HttpHelper {

    constructor(private http: HttpClient) { }

    /**
     * Send a post request to api
     *
     * @param url
     * @param data
     */
    post(url: string, data: any): Observable<any> {
        return this.http.post<any>(environment.api_server + '/' + url, data);
    }

    /**
     * Send a put request to api
     *
     * @param url
     * @param data
     */
    put(url: string, data: any): Observable<any> {
        return this.http.put<any>(environment.api_server + '/' + url, data);
    }

    /**
     * Send a get request to api
     *
     * @param url
     */
    get(url: string): Observable<any> {
        return this.http.get<any>(environment.api_server + '/' + url);
    }

    /**
     * Send a delete request to api
     *
     * @param url
     */
    delete(url: string): Observable<any> {
        return this.http.delete<any>(environment.api_server + '/' + url);
    }
}