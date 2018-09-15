import {NgModule} from '@angular/core';
import {HighLightPipe} from './highlight.pipe';
import {HighLightHtmlPipe} from './highlight.no-html-tags.pipe';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AsyncBookmarkListComponent} from './async-bookmark-list.component';
import {TagsValidatorDirective} from './tags-validation.directive';
import {BookmarkSearchComponent} from './search/bookmark-search.component';
import {MatAutocompleteModule, MatFormFieldModule, MatIconModule, MatInputModule} from '@angular/material';


/**
 * Add a SharedModule to hold the common components, directives, and pipes and share them with the modules that need them.
 * See - https://angular.io/guide/sharing-ngmodules
 */
@NgModule({
  imports:      [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatAutocompleteModule,
  ],
  declarations: [
    HighLightPipe,
    HighLightHtmlPipe,
    AsyncBookmarkListComponent,
    TagsValidatorDirective,
    BookmarkSearchComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HighLightPipe,
    HighLightHtmlPipe,
    AsyncBookmarkListComponent,
    BookmarkSearchComponent
  ]
})
export class SharedModule { }
