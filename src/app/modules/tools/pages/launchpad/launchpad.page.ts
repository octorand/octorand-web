import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environment';
import { AppHelper, LaunchpadHelper } from '@lib/helpers';
import { AppModel, LaunchpadModel } from '@lib/models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tools-launchpad',
  templateUrl: './launchpad.page.html',
  styleUrls: ['./launchpad.page.scss'],
})
export class ToolsLaunchpadPage implements OnInit, OnDestroy {

  /**
   * App state
   */
  app: AppModel = new AppModel();

  /**
   * Launchpad state
   */
  launchpad: LaunchpadModel = new LaunchpadModel();

  /**
   * App subscription
   */
  appSubscription: Subscription = new Subscription();

  /**
   * Launchpad subscription
   */
  launchpadSubscription: Subscription = new Subscription();

  /**
   * List of collections
   */
  collections: Array<any> = [];

  /**
   * List of images
   */
  images: Array<string> = [];

  /**
   * List of backgrounds
   */
  backgrounds: Array<string> = [];

  /**
   * Whether the page is ready to be rendered
   */
  ready: boolean = false;

  /**
   * Track image details loading task
   */
  private imageDetailsLoadTask: any = null;

  /**
   * Construct component
   *
   * @param router
   * @param appHelper
   * @param launchpadHelper
   */
  constructor(
    private router: Router,
    private appHelper: AppHelper,
    private launchpadHelper: LaunchpadHelper
  ) { }

  /**
   * Initialize component
   */
  ngOnInit() {
    this.initApp();
    this.initLaunchpad();
    this.initTasks();
    this.refreshView();
  }

  /**
   * Destroy component
   */
  ngOnDestroy() {
    this.appSubscription.unsubscribe();
    this.launchpadSubscription.unsubscribe();
    clearInterval(this.imageDetailsLoadTask);
  }

  /**
   * Initialize app
   */
  initApp() {
    this.app = this.appHelper.getDefaultState();
    this.appSubscription = this.appHelper.app.subscribe((value: AppModel) => {
      this.app = value;
      this.refreshView();
    });
  }

  /**
   * Initialize launchpad
   */
  initLaunchpad() {
    this.launchpad = this.launchpadHelper.getDefaultState();
    this.launchpadSubscription = this.launchpadHelper.launchpad.subscribe((value: LaunchpadModel) => {
      this.launchpad = value;
      this.refreshView();
    });
  }

  /**
   * Initialize tasks
   */
  initTasks() {
    this.loadImageDetails();
    this.imageDetailsLoadTask = setInterval(() => { this.loadImageDetails() }, 2000);
  }

  /**
   * Refresh view state
   */
  refreshView() {
    if (this.launchpad && this.launchpad.initialised) {
      this.collections = this.launchpad.collections;
      this.loadImageDetails();
      this.ready = true;
    }
  }

  /**
   * Load image details
   */
  loadImageDetails() {
    let images = [];
    let backgrounds = [];

    for (let i = 0; i < this.collections.length; i++) {
      let item = this.collections[i].items[Math.floor(Math.random() * this.collections[i].stats_count)];
      let image = item.image;
      images.push(environment.image_server + '/' + image + '?optimizer=image&width=200');
      backgrounds.push('hsl(' + item.score % 360 + ', 100%, 75%)');
    }

    this.images = images;
    this.backgrounds = backgrounds;
  }

  /**
   * Open launchpad collection page
   *
   * @param id
   */
  openCollection(id: string) {
    this.navigateToPage('/tools/launchpad/' + id + '/browse');
  }

  /**
   * Navigate to page
   *
   * @param page
   */
  navigateToPage(page: string) {
    this.router.navigate([page]);
  }
}
