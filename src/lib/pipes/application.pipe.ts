import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '@environment';

@Pipe({ name: 'application' })
export class ApplicationPipe implements PipeTransform {

    transform(id: number, info: boolean = false): string {
        let link = environment.algo_explorer + '/application/' + id;

        if (id == 0) {
            info = false;
        }

        if (info) {
            return `
                <div>
                    <span>${id}</span>
                    <a href="${link}" target="_blank">
                        <i class="ml-10 fas fa-info-circle text-primary"></i>
                    </a>
                </div>
            `;
        } else {
            return `<span>${id}</span>`;
        }
    }
}