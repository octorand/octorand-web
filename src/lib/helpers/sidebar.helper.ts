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
                    route: 'browse',
                },
                {
                    id: 'market',
                    name: 'Market',
                    icon: 'fas fa-shopping-bag',
                    color: '#2980b9',
                    route: 'market',
                },
                {
                    id: 'account',
                    name: 'Account',
                    icon: 'fas fa-user',
                    color: '#e74c3c',
                    route: 'account',
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
                    id: 'statistics',
                    name: 'Statistics',
                    icon: 'fas fa-signal',
                    color: '#2ecc71',
                    route: 'platform/statistics',
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