import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SidebarHelper {

    /**
     * Sidebar configuration
     */
    private sidebar = [
        {
            id: 'collection',
            name: 'Collection',
            items: [
                {
                    id: 'browse',
                    name: 'Browse',
                    icon: 'fas fa-th-large',
                    color: '#f1c40f',
                    route: 'collection/browse',
                },
                {
                    id: 'market',
                    name: 'Market',
                    icon: 'fas fa-shopping-bag',
                    color: '#2980b9',
                    route: 'collection/market',
                },
                {
                    id: 'account',
                    name: 'Account',
                    icon: 'fas fa-user',
                    color: '#e74c3c',
                    route: 'collection/account',
                },
            ]
        },
        {
            id: 'platform',
            name: 'Platform',
            items: [
                {
                    id: 'tokenomics',
                    name: 'Tokenomics',
                    icon: 'fas fa-coins',
                    color: '#9b59b6',
                    route: 'platform/tokenomics',
                },
                {
                    id: 'traits',
                    name: 'Traits',
                    icon: 'fas fa-certificate',
                    color: '#2ecc71',
                    route: 'platform/traits',
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