import {Observable, of as observableOf} from 'rxjs';

import {catchError, debounceTime, switchMap} from 'rxjs/operators';
import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Router} from '@angular/router';
import {BookmarkFilterService} from '../../core/filter.service';
import {Bookmark} from '../../core/model/bookmark';
import {List} from 'immutable';
import {languages} from '../language-options';
import {PublicBookmarksStore} from '../../public/bookmark/store/public-bookmarks.store';
import {startWith, map} from 'rxjs/operators';

@Component({
    selector: 'app-bookmark-search',
    templateUrl: './bookmark-search.component.html',
    styleUrls: [ './bookmark-search.component.scss' ]
})
export class BookmarkSearchComponent implements OnInit, AfterViewInit {

  @Input()
  bookmarks: Observable<List<Bookmark>>;

  @Input()
  query: string;

  @Input()
  context: string;

  @Input()
  autocompleteTags?: string[];

  filteredBookmarks: Observable<Bookmark[]>;
  private filterBookmarksBySearchTerm: Bookmark[];

  term = new FormControl();
  queryText: string;
  public showNotFound = false;
  public numberOfResultsFiltered: number;
  counter = 10;
  previousTerm: string;
  language = 'all';

  languages = languages;

  filteredOptions: Observable<string[]>;

  constructor(private router: Router, private bookmarkStore: PublicBookmarksStore, private bookmarkFilterService: BookmarkFilterService) {}

  ngOnInit(): void {

    this.filteredBookmarks = this.term.valueChanges.pipe(
      debounceTime(1500),
      // TODO - next line should be reactived when getting results via HTTP
      // .distinctUntilChanged()   ignore if next search term is same as previous
      switchMap(term => {
        // this.counter = 0; // we initialise the counter
        if (term) { // switch to new observable each time

          if (this.previousTerm !== term ) {
            this.previousTerm = term;
            this.counter = 10;
          }

          this.queryText = term;
          this.filterBookmarksBySearchTerm = this.bookmarkFilterService.filterBookmarksBySearchTerm(term, this.language, this.bookmarks);
          this.numberOfResultsFiltered = this.filterBookmarksBySearchTerm.length;
          if (this.numberOfResultsFiltered > 0 ) {
            this.showNotFound = false;
            return observableOf(this.filterBookmarksBySearchTerm.slice(0, this.counter)); // get the first 10 results
          } else {
            this.showNotFound = true;
            return observableOf<Bookmark[]>([]);
          }
        } else {
          this.numberOfResultsFiltered = 0;
          // or the observable of empty bookmarks if no search term
          return observableOf<Bookmark[]>([]);
        }
      }),
      catchError(error => {
        console.log(error);
        return observableOf<Bookmark[]>([]);
      }), );

    this.filteredOptions = this.term.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );


  }

  showMoreResults() {
    this.term.setValue(this.queryText); // trigger this.term.valueChanges
    this.counter += 10;
  }

  ngAfterViewInit(): void {
    if (this.query) {
      this.term.setValue(this.query);
    }
  }

  /**
   *
   * @param bookmark
   */
  gotoDetail(bookmark: Bookmark): void {
    const link = ['/bookmarks', bookmark._id];
    this.router.navigate(link);
  }

  setQueryFromParentComponent(queryFromOutside: string) {
    this.term.setValue(queryFromOutside);
  }

  onLanguageChange(newValue) {
    console.log('onLanguageChange' + newValue);
    this.language = newValue;
    this.term.setValue(this.queryText);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.autocompleteTags.filter(option => option.toLowerCase().includes(filterValue));
  }

}
