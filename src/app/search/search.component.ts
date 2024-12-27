import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { GraphService } from '../graph.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [ FormsModule, CommonModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchTerm = '';
  searchResults: any[] = [];
  private searchInput$ = new Subject<string>();

  constructor(
    private msalService: MsalService,
    private graphService: GraphService
  ) { }

  ngOnInit(): void {
    this.msalService.instance.handleRedirectPromise().then(res => {
      if (res != null && res.account != null) {
        this.msalService.instance.setActiveAccount(res.account);
      }
    });

    this.searchInput$
    .pipe(
      debounceTime(300), // Wait for 300ms pause in typing
      distinctUntilChanged() // Only emit if value actually changed
    )
    .subscribe(searchTerm => {
      this.searchEntra(searchTerm);
    });
  }

  onSearchInput() {
    this.searchInput$.next(this.searchTerm);
  }

  async searchEntra(searchTerm: string) {
    if (!this.isUserLoggedIn()) {
      // Handle case where user is not logged in
      console.warn('User is not logged in.');
      return;
    }

    if (searchTerm.length < 3) {
      this.searchResults = [];
      return;
    }

    try {
      const results = await this.graphService.searchEntra(searchTerm);
      this.searchResults = results;
    } catch (error) {
      console.error('Error searching Entra:', error);
      // Handle error appropriately (e.g., display an error message)
    }
  }

  isUserLoggedIn(): boolean {
    return this.msalService.instance.getActiveAccount() != null
  }

  login() {
    this.msalService.instance.loginRedirect(); // Use the instance property
  }
  logout() {
    this.msalService.instance.logout(); // Use the instance property
  }
}