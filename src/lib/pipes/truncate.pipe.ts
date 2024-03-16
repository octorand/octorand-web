import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {

    transform(value: string, limit = 30, completeWords = true, ellipsis = '...'): any {
        if (!value || value.length <= limit) {
            return value;
        }
        else {
            if (completeWords) {
                limit = value.substring(0, limit).lastIndexOf(' ');
            }

            return value.length > limit ? value.substring(0, limit) + ellipsis : value;
        }
    }
}