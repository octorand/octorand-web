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

    /**
     * Find skin
     *
     * @param index
     */
    find(index: number): any {
        return this.skins.find(s => s.id == index) ? this.skins.find(s => s.id == index) : this.skins[0];
    }
}