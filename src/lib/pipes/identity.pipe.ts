import { Pipe, PipeTransform } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { IdentityHelper } from '@lib/helpers';
import { environment } from '@environment';

@Pipe({ name: 'identity' })
export class IdentityPipe implements PipeTransform {

    constructor(private identityHelper: IdentityHelper) { }

    transform(id: string, info: boolean = true, wrap: boolean = true): Observable<string> {
        return timer(0, 3000).pipe(
            map(() => {
                if (!id) {
                    if (wrap) {
                        return '<span>-</span>';
                    } else {
                        return '-';
                    }
                }

                let link = environment.algo_explorer + '/address/' + id;
                let value = this.identityHelper.get(id);

                if (info) {
                    if (wrap) {
                        return `
                            <div>
                                <span>${value}</span>
                                <a href="${link}" target="_blank">
                                    <i class="ml-10 fas fa-info-circle text-primary"></i>
                                </a>
                            </div>
                        `;
                    } else {
                        return value;
                    }
                } else {
                    if (wrap) {
                        return `<span>${value}</span>`;
                    } else {
                        return value;
                    }
                }
            })
        );
    }
}