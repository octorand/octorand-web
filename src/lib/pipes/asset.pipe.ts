import { Pipe, PipeTransform } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { AssetHelper } from '@lib/helpers';
import { environment } from '@environment';

@Pipe({ name: 'asset' })
export class AssetPipe implements PipeTransform {

    constructor(private assetHelper: AssetHelper) { }

    transform(id: number, info: boolean = false): Observable<string> {
        return timer(0, 3000).pipe(
            map(() => {
                let details = this.assetHelper.get(id);
                if (details) {
                    let unit = details.unit;
                    let link = environment.algo_explorer + '/asset/' + id;

                    if (id == 0) {
                        info = false;
                    }

                    if (info) {
                        return `
                            <div>
                                <span>${unit}</span>
                                <a href="${link}" target="_blank">
                                    <i class="ml-10 fas fa-info-circle text-primary"></i>
                                </a>
                            </div>
                        `;
                    } else {
                        return `<span>${unit}</span>`;
                    }
                } else {
                    return '<i class="fas fa-cog text-danger fa-spin"></i>';
                }
            })
        );
    }
}