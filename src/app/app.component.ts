import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AppHelper, SidebarHelper, SocialHelper, WalletHelper } from '@lib/helpers';
import { AppModel } from '@lib/models';
import { Subscription } from 'rxjs';
import { environment } from '@environment';

import { PeraWalletConnect } from "@perawallet/connect";
import { DeflyWalletConnect } from "@blockshake/defly-connect";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "algorand-walletconnect-qrcode-modal";

declare var window: any;
declare var halfmoon: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  /**
   * App state
   */
  app: AppModel = new AppModel();

  /**
   * App subscription
   */
  appSubscription: Subscription = new Subscription();

  /**
   * The wallet connect connection
   */
  walletConnectConnection: any = null;

  /**
   * The pera wallet connection
   */
  peraConnection: any = null;

  /**
   * The defly wallet connection
   */
  deflyConnection: any = null;

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
  }

  /**
   * Destroy component
   */
  ngOnDestroy() {
    this.appSubscription.unsubscribe();
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
    });

    this.socials = this.socialHelper.list();
    this.wallets = this.walletHelper.list();
    this.sidebar = this.sidebarHelper.list();
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
      window.scrollTo(0, 0);
    });
  }

  /**
   * Toggle sidebar
   */
  toggleSidebar() {
    halfmoon.toggleSidebar();
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
      case 'wallet-connect':
        this.manageWalletConnect(wallet.id);
        break;
    }

    this.hideConnectDropdown();
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
    let peraConnection: PeraWalletConnect;

    if (environment.production) {
      peraConnection = new PeraWalletConnect({
        shouldShowSignTxnToast: false,
        chainId: 416001
      });
    } else {
      peraConnection = new PeraWalletConnect({
        shouldShowSignTxnToast: false,
        chainId: 416002
      });
    }

    peraConnection.connect().then((accounts) => {
      this.connectAccount(wallet, accounts);

      peraConnection.connector?.on("disconnect", () => {
        this.disconnectAccount();
      });
    }).catch(() => {
      this.appHelper.showError("Pera wallet is not connected.");
    });

    this.peraConnection = peraConnection;
  }

  /**
   * Manage the connection of defly connect
   *
   * @param wallet
   */
  manageDeflyWallet(wallet: string) {
    let deflyConnection: DeflyWalletConnect;

    if (environment.production) {
      deflyConnection = new DeflyWalletConnect({
        shouldShowSignTxnToast: false,
        chainId: 416001
      });
    } else {
      deflyConnection = new DeflyWalletConnect({
        shouldShowSignTxnToast: false,
        chainId: 416002
      });
    }

    deflyConnection.connect().then((accounts) => {
      this.connectAccount(wallet, accounts);

      deflyConnection.connector?.on("disconnect", () => {
        this.disconnectAccount();
      });
    }).catch(() => {
      this.appHelper.showError("Defly wallet is not connected.");
    });

    this.deflyConnection = deflyConnection;
  }

  /**
   * Manage the connection of wallet connect
   *
   * @param wallet
   */
  manageWalletConnect(wallet: string) {
    let walletConnectConnection = new WalletConnect({
      bridge: "https://bridge.walletconnect.org",
      qrcodeModal: QRCodeModal,
    });

    if (!walletConnectConnection.connected) {
      walletConnectConnection.createSession();
    } else {
      this.connectAccount(wallet, walletConnectConnection.accounts);
    }

    walletConnectConnection.on("connect", (error, payload) => {
      if (!error) {
        this.connectAccount(wallet, payload.params[0].accounts);
      }
    });

    walletConnectConnection.on("session_update", (error, payload) => {
      if (!error) {
        this.connectAccount(wallet, payload.params[0].accounts);
      }
    });

    walletConnectConnection.on("disconnect", (error) => {
      if (!error) {
        this.disconnectAccount();
      }
    });

    this.walletConnectConnection = walletConnectConnection;
  }

  /**
   * Connect to a wallet account
   *
   * @param wallet
   * @param accounts
   */
  connectAccount(wallet: string, addresses: Array<string>) {
    if (addresses.length > 0) {
      for (let i = 0; i < addresses.length; i++) {
        addresses[i] = addresses[i].toUpperCase();
      }

      this.appHelper.setWallet(wallet);
      this.appHelper.setAccount(addresses[0]);
      this.appHelper.setAddresses(addresses);
      this.appHelper.loadAccountDetails();
    }
  }

  /**
   * Disconnect account
   */
  disconnectAccount() {
    this.appHelper.setWallet('');
    this.appHelper.setAccount('');
    this.appHelper.setAddresses([]);
    this.appHelper.loadAccountDetails();

    localStorage.clear();

    if (this.walletConnectConnection) {
      this.walletConnectConnection.killSession();
    }

    if (this.peraConnection) {
      this.peraConnection.disconnect();
    }

    if (this.deflyConnection) {
      this.deflyConnection.disconnect();
    }

    this.hideConnectDropdown();
  }

  /**
   * Select wallet address
   *
   * @param address
   */
  selectAddress(address: string) {
    this.appHelper.setAccount(address);
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
