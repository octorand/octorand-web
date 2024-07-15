import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { GenOnePrimeClaimContract, GenOnePrimeUpgradeContract, GenTwoPrimeClaimContract, GenTwoPrimeUpgradeContract } from '@lib/contracts';
import { AppHelper, DataHelper, IndexerHelper } from '@lib/helpers';
import { AppModel, DataModel, PrimeModel } from '@lib/models';
import { environment } from '@environment';

@Component({
  selector: 'app-collection-prime-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class CollectionPrimeHistoryPage implements OnInit, OnChanges {

  /**
   * App state
   */
  @Input() app: AppModel = new AppModel();

  /**
   * Data state
   */
  @Input() data: DataModel = new DataModel();

  /**
   * Prime details
   */
  @Input() prime: PrimeModel = new PrimeModel();

  /**
   * List of events
   */
  events: Array<any> = [];

  /**
   * Construct component
   *
   * @param appHelper
   * @param dataHelper
   * @param indexerHelper
   */
  constructor(
    private appHelper: AppHelper,
    private dataHelper: DataHelper,
    private indexerHelper: IndexerHelper
  ) { }

  /**
   * Initialize component
   */
  ngOnInit() {
    this.refreshView();
  }

  /**
   * Component parameters changed
   */
  ngOnChanges() {
    this.refreshView();
  }

  /**
   * Refresh view state
   */
  refreshView() {
    if (this.prime) {
      this.indexerHelper.lookupApplicationLogs(this.prime.application_id).then((value) => {
        this.events = value.sort((first, second) => second.timestamp - first.timestamp);
      });
    }
  }
}
