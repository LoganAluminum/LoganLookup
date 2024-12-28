import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../search.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  siteTitle = 'Logan Aluminum Entra Search';
  searchTerm: string = '';
  isSearchPage: boolean = true;
  private searchSubscription: Subscription | null = null;

  constructor(
    private router: Router,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    this.searchSubscription = this.searchService.currentSearchTerm.subscribe(
      (term) => {
        this.searchTerm = term;
      }
    );

    this.router.events
      .pipe(
        filter(
          (event: Event): event is NavigationEnd =>
            event instanceof NavigationEnd
        )
      )
      .subscribe((event: NavigationEnd) => {
        this.isSearchPage = event.url === '/' || event.url.startsWith('/?q=');
      });
  }

  // Call this method only when you want to trigger the search
  performSearch() {
    this.searchService.updateSearchTerm(this.searchTerm);
    if (this.searchTerm.length >= 3) {
      this.router.navigate(['/'], { queryParams: { q: this.searchTerm } });
    }
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }
}