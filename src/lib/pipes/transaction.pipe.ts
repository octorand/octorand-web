import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '@environment';

@Pipe({ name: 'transaction' })
export class TransactionPipe implements PipeTransform {

    transform(id: string, info: boolean = true): any {

        if (!id) {
            return '<span>-</span>';
        }

        let value = id;
        if (id.length > 12) {
            value = id.slice(0, 6) + '...' + id.slice(-3);
        }

        let link = environment.algo_explorer + '/tx/' + id;

        if (info) {
            return `
                <div>
                    <span>${value}</span>
                    <a href="${link}" target="_blank">
                        <i class="ml-10 fas fa-info-circle text-primary"></i>
                    </a>
                </div>
            `;
        } else {
            return `<span>${value}</span>`;
        }
    }
}