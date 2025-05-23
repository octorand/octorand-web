import { AfterViewInit, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AppHelper, SidebarHelper, SocialHelper, WalletHelper } from '@lib/helpers';
import { AppModel } from '@lib/models';
import { Subscription } from 'rxjs';
import { environment } from '@environment';

import { PeraWalletConnect } from "@perawallet/connect";
import { DeflyWalletConnect } from "@blockshake/defly-connect";

declare var window: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {

  /**
   * App state
   */
  app: AppModel = new AppModel();

  /**
   * App subscription
   */
  appSubscription: Subscription = new Subscription();

  /**
   * The pera wallet connection
   */
  peraConnection: PeraWalletConnect = new PeraWalletConnect({
    chainId: environment.production ? 416001 : 416002,
    shouldShowSignTxnToast: false
  });

  /**
   * The defly wallet connection
   */
  deflyConnection: DeflyWalletConnect = new DeflyWalletConnect({
    chainId: environment.production ? 416001 : 416002,
    shouldShowSignTxnToast: false
  });

  /**
   * True if page in loaded in a mobile device
   */
  isMobile: boolean = false;

  /**
   * Social links
   */
  socials: Array<any> = [];

  /**
   * Supported wallets
   */
  wallets: Array<any> = [];

  /**
   * Sidebar links
   */
  sidebar: Array<any> = [];

  /**
   * Application version
   */
  version: string = environment.version;

  /**
   * Platform asset id
   */
  platformAssetId: number = environment.platform.asset_id;

  /**
   * Platform asset balance
   */
  platformAssetBalance: number = 0;

  /**
   * Core asset balance
   */
  coreAssetBalance: number = 0;

  /**
   * Construct component
   *
   * @param router
   * @param appHelper
   * @param sidebarHelper
   * @param socialHelper
   * @param walletHelper
   */
  constructor(
    private router: Router,
    private appHelper: AppHelper,
    private sidebarHelper: SidebarHelper,
    private socialHelper: SocialHelper,
    private walletHelper: WalletHelper
  ) { }

  /**
   * Initialize component
   */
  ngOnInit() {
    this.initApp();
    this.detectMobile();
    this.scrollToTop();
    this.reconnectWallet();
  }

  /**
   * Destroy component
   */
  ngOnDestroy() {
    this.appSubscription.unsubscribe();
  }

  /**
   * After the view is initialized
   */
  ngAfterViewInit() {
    this.appHelper.refreshInterface();
  }

  /**
   * Listen to window resize event
   */
  @HostListener('window:resize')
  onResize() {
    this.detectMobile();
  }

  /**
   * Initialize app
   */
  initApp() {
    this.app = this.appHelper.getDefaultState();
    this.appSubscription = this.appHelper.app.subscribe((value: any) => {
      this.app = value;
      this.refreshBalances();
    });

    this.socials = this.socialHelper.list();
    this.wallets = this.walletHelper.list();
    this.sidebar = this.sidebarHelper.list();
  }

  /**
   * Refresh asset balances
   */
  refreshBalances() {
    let core = this.app.assets.find(a => a.id == 0);
    if (core) {
      this.coreAssetBalance = core.amount;
    }

    let platform = this.app.assets.find(a => a.id == this.platformAssetId);
    if (platform) {
      this.platformAssetBalance = platform.amount;
    }
  }

  /**
   * Detect whether the screen is mobile
   */
  detectMobile() {
    if (window.innerWidth <= 768) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }

  /**
   * Scroll to the top of page
   */
  scrollToTop() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      document.body.scrollTop = 0;
    });
  }

  /**
   * Toggle sidebar
   */
  toggleSidebar() {
    this.appHelper.toggleSidebar();
  }

  /**
   * Navigate to page
   *
   * @param page
   */
  navigateToPage(page: string) {
    if (this.isMobile) {
      this.hideSidebar();
    }

    this.router.navigate([page]);
  }

  /**
   * Select a wallet to connect
   *
   * @param wallet
   */
  selectWallet(wallet: any) {
    switch (wallet.id) {
      case 'exodus':
        this.manageExodus(wallet.id);
        break;
      case 'pera-wallet':
        this.managePeraWallet(wallet.id);
        break;
      case 'defly-wallet':
        this.manageDeflyWallet(wallet.id);
        break;
    }

    this.hideConnectDropdown();
  }

  /**
   * Reconnect to wallet
   */
  reconnectWallet() {
    let wallet = this.appHelper.getWallet();
    if (wallet) {
      switch (wallet) {
        case 'exodus':
          this.reconnectExodus(wallet);
          break;
        case 'pera-wallet':
          this.reconnectPeraWallet(wallet);
          break;
        case 'defly-wallet':
          this.reconnectDeflyWallet(wallet);
          break;
      }
    }
  }

  /**
   * Manage the connection of exodus
   *
   * @param wallet
   */
  manageExodus(wallet: string) {
    if (window && window.exodus && window.exodus.algorand) {
      window.exodus.algorand.connect().then(() => {
        let accounts = window.exodus.algorand.accounts;
        if (accounts.length > 0) {
          this.connectAccount(wallet, accounts);
        } else {
          this.appHelper.showError("Exodus is not configured with accounts.");
        }
      }).catch(() => {
        this.appHelper.showError("Exodus is not connected.");
      });
    } else {
      this.appHelper.showError("Exodus is not installed.");
    };
  }

  /**
   * Manage the connection of pera connect
   *
   * @param wallet
   */
  managePeraWallet(wallet: string) {
    this.peraConnection.connect().then((accounts) => {
      this.connectAccount(wallet, accounts);
      this.peraConnection.connector?.on("disconnect", () => {
        this.disconnectAccount();
      });
    }).catch(() => {
      this.appHelper.showError("Could not connect to Pera wallet.");
    });
  }

  /**
   * Manage the connection of defly connect
   *
   * @param wallet
   */
  manageDeflyWallet(wallet: string) {
    this.deflyConnection.connect().then((accounts) => {
      this.connectAccount(wallet, accounts);
      this.deflyConnection.connector?.on("disconnect", () => {
        this.disconnectAccount();
      });
    }).catch(() => {
      this.appHelper.showError("Could not connect to Defly wallet.");
    });
  }

  /**
   * Reconnect the connection of exodus
   *
   * @param wallet
   */
  reconnectExodus(wallet: string) {
    if (window && window.exodus && window.exodus.algorand) {
      let accounts = window.exodus.algorand.accounts;
      if (accounts && accounts.length > 0) {
        this.connectAccount(wallet, accounts);
      }
    } else {
      this.appHelper.showError("Could not reconnect to Exodus.");
      this.disconnectAccount();
    };
  }

  /**
   * Reconnect the connection of pera connect
   *
   * @param wallet
   */
  reconnectPeraWallet(wallet: string) {
    this.peraConnection.reconnectSession().then((accounts) => {
      this.connectAccount(wallet, accounts);
      this.peraConnection.connector?.on("disconnect", () => {
        this.disconnectAccount();
      });
    }).catch(() => {
      this.appHelper.showError("Could not reconnect to Pera wallet.");
      this.disconnectAccount();
    });
  }

  /**
   * Reconnect the connection of defly connect
   *
   * @param wallet
   */
  reconnectDeflyWallet(wallet: string) {
    this.deflyConnection.reconnectSession().then((accounts) => {
      this.connectAccount(wallet, accounts);
      this.deflyConnection.connector?.on("disconnect", () => {
        this.disconnectAccount();
      });
    }).catch(() => {
      this.appHelper.showError("Could not reconnect to Defly wallet.");
      this.disconnectAccount();
    });
  }

  /**
   * Connect to a wallet account
   *
   * @param wallet
   * @param addresses
   */
  connectAccount(wallet: string, addresses: Array<string>) {
    if (addresses.length > 0) {
      for (let i = 0; i < addresses.length; i++) {
        addresses[i] = addresses[i].toUpperCase();
      }

      this.appHelper.setWallet(wallet);
      this.appHelper.setAddress(addresses[0]);
      this.appHelper.setAccounts(addresses);
      this.appHelper.loadAccountDetails();
    }
  }

  /**
   * Disconnect account
   */
  disconnectAccount() {
    this.appHelper.setWallet('');
    this.appHelper.setAddress('');
    this.appHelper.setAccounts([]);
    this.appHelper.loadAccountDetails();

    this.peraConnection.disconnect();
    this.deflyConnection.disconnect();

    this.hideConnectDropdown();
    localStorage.clear();
  }

  /**
   * Select wallet address
   *
   * @param address
   */
  selectAddress(address: string) {
    this.appHelper.setAddress(address);
    this.appHelper.loadAccountDetails();
    this.hideConnectDropdown();
  }

  /**
   * Hide the connect dropdown
   */
  hideConnectDropdown() {
    let dropdown = document.querySelector('.connect-dropdown');
    if (dropdown) {
      dropdown.classList.remove('show');
      let button = dropdown.querySelector('.btn');
      if (button) {
        button.classList.remove('active');
      }
    }
  }

  /**
   * Hide sidebar
   */
  hideSidebar() {
    let wrapper = document.querySelector('.page-wrapper');
    if (wrapper) {
      wrapper.setAttribute("data-sidebar-hidden", "hidden");
    }
  }
}
