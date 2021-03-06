
import {map} from 'rxjs/operators';
import {Component, OnInit} from '@angular/core';
import {Codingmark} from '../core/model/codingmark';
import {Observable} from 'rxjs';
import {List} from 'immutable';
import {PersonalCodingmarksStore} from '../core/store/personal-codingmarks-store.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-user-codingmarks',
  templateUrl: './personal-codingmarks-list.component.html',
  styleUrls: ['./personal-codingmarks-list.component.scss']
})
export class PersonalCodingmarksListComponent implements OnInit {

  personalCodingmarks$: Observable<List<Codingmark>>;
  lastUpdatedPersonalCodingmarks$: Observable<Codingmark[]>;
  query = '';
  showLastAccessed = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private personalCodingmarksStore: PersonalCodingmarksStore) { }

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
    this.personalCodingmarks$ = this.personalCodingmarksStore.getPersonalCodingmarks();
    this.lastUpdatedPersonalCodingmarks$ = this.personalCodingmarks$.pipe(map((data) => {
        return data.sort((a, b) => {
          if (a.updatedAt < b.updatedAt) { return 1; }
          if (a.updatedAt > b.updatedAt) { return -1; }
          if (a.updatedAt === b.updatedAt) { return 0; }
        }).toArray();
    }));
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
