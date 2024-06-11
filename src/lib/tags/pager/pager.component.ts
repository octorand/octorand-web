import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tags-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.scss'],
})
export class PagerTagComponent {

  /**
   * Currently selected page
   */
  @Input() currentPage: number;

  /**
   * Total pages to be rendered
   */
  @Input() totalPages: number;

  /**
   * Fired when selected page changed
   */
  @Output() onPageChange = new EventEmitter<any>();

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
  changePage(page) {
    this.onPageChange.emit(page);
  }
}
