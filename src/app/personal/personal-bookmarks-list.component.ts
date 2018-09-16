
import {map} from 'rxjs/operators';
import {Component, OnInit} from '@angular/core';
import {Bookmark} from '../core/model/bookmark';
import {Observable} from 'rxjs';
import {List} from 'immutable';
import {PersonalBookmarksStore} from '../core/store/PersonalBookmarksStore';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-user-bookmarks',
  templateUrl: './personal-bookmarks-list.component.html',
  styleUrls: ['./personal-bookmarks-list.component.scss']
})
export class PersonalBookmarksListComponent implements OnInit {

  userBookmarks: Observable<List<Bookmark>>;
  userBookmarksLastUpdated: Observable<Bookmark[]>;
  query = '';
  showLastAccessed = true;
  autocompleteTags: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userBookmarkStore: PersonalBookmarksStore) { }

  ngOnInit(): void {
    this.query = this.route.snapshot.queryParamMap.get('q');
    if (this.query) {
      this.query = this.query.replace(/\+/g,  ' ');
    } else {
      this.query = this.route.snapshot.queryParamMap.get('search');
      if (this.query) {
        this.query = this.query.replace(/\+/g,  ' ');
      }
    }
    this.userBookmarks = this.userBookmarkStore.getBookmarks();
    this.userBookmarksLastUpdated = this.userBookmarks.pipe(map((data) => {
        return data.sort((a, b) => {
          if (a.updatedAt < b.updatedAt) { return 1; }
          if (a.updatedAt > b.updatedAt) { return -1; }
          if (a.updatedAt === b.updatedAt) { return 0; }
        }).toArray();
    }));
    this.autocompleteTags = this.userBookmarkStore.getPersonalAutomcompleteTagsForSearch();
  }

  goToAddNewPersonalBookmark(): void {
    const link = ['./new'];
    this.router.navigate(link, { relativeTo: this.route });
  }

  toggleLastAccessed(): void {
    this.showLastAccessed = true;
  }

  toggleLastModified(): void {
    this.showLastAccessed = false;
  }


}
