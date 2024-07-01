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
                    icon: 'fas fa-trophy',
                    color: '#2ecc71',
                    route: 'platform/traits',
                },
                {
                    id: 'statistics',
                    name: 'Statistics',
                    icon: 'fas fa-signal',
                    color: '#1abc9c',
                    route: 'platform/statistics',
                },
                {
                    id: 'migration',
                    name: 'Migration',
                    icon: 'fas fa-retweet',
                    color: '#8e44ad',
                    route: 'platform/migration',
                },
                {
                    id: 'guide',
                    name: 'Guide',
                    icon: 'fas fa-book-open',
                    color: '#f39c12',
                    route: 'platform/guide',
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