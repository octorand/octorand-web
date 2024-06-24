import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SkinHelper {

    /**
     * List of skins
     */
    private skins = [
        {
            id: 0,
            name: 'Starlegis',
        },
    ];

    /**
     * Get a list of skins
     */
    list() {
        return this.skins;
    }
}