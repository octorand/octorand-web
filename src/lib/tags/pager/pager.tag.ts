import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'lib-tags-pager',
  templateUrl: './pager.tag.html',
  styleUrls: ['./pager.tag.scss'],
})
export class PagerTag {

  /**
   * Currently selected page
   */
  @Input() currentPage: number = 1;

  /**
   * Total pages to be rendered
   */
  @Input() totalPages: number = 1;

  /**
   * Fired when selected page changed
   */
  @Output() onPageChange = new EventEmitter<number>();

  /**
   * Change to first page
   */
  firstPage() {
    this.changePage(1);
  }

  /**
   * Change to last page
   */
  lastPage() {
    this.changePage(this.totalPages);
  }

  /**
   * Change to next page
   */
  nextPage() {
    this.changePage(Math.min(this.currentPage + 1, this.totalPages));
  }

  /**
   * Change to previous page
   */
  previousPage() {
    this.changePage(Math.max(this.currentPage - 1, 1));
  }

  /**
   * Change selected page
   * @param page
   */
  changePage(page: number) {
    this.onPageChange.emit(page);
  }
}
