import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SidebarHelper {

    sidebar = [
        {
            id: 'collection',
            name: 'Collection',
            items: [
                {
                    id: 'browse',
                    name: 'Browse',
                    icon: 'fas fa-piggy-bank',
                    color: '#8e44ad',
                    route: 'browse',
                },
            ]
        },
    ];

    /**
     * Get a list of sidebar links
     */
    list() {
        return this.sidebar;
    }
}