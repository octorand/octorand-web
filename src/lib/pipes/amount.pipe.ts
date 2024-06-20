import { Pipe, PipeTransform } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { AssetHelper } from '@lib/helpers';

@Pipe({ name: 'amount' })
export class AmountPipe implements PipeTransform {

    constructor(private assetHelper: AssetHelper) { }

    transform(amount: number, asset: number = 0, showUnit: boolean = true, rounding: number = 2): Observable<string> {
        return timer(0, 3000).pipe(
            map(() => {
                let details = this.assetHelper.get(asset);
                if (details) {
                    let decimals = details.decimals;
                    let unit = details.unit;

                    let actual = Number(amount) / Math.pow(10, decimals);
                    actual = Math.floor(actual * Math.pow(10, rounding));
                    let format = (actual / Math.pow(10, rounding)).toFixed(rounding);
                    let parts = format.toString().split(".");
                    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    let value = parts.join(".");

                    if (showUnit) {
                        return `<span>${value} ${unit}</span>`;
                    } else {
                        return `<span>${value}</span>`;
                    }
                } else {
                    return '<i class="fas fa-ellipsis-h text-danger"></i>';
                }
            })
        );
    }
}