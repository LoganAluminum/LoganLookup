import { Component, OnInit } from '@angular/core';
import { GraphService } from '../graph.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserDetailsComponent } from '../user-details/user-details.component';
import { GroupDetailsComponent } from '../group-details/group-details.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  searchTerm = '';
  searchResults: any[] = [];
  private searchInput$ = new Subject<string>();

  constructor(
    private graphService: GraphService,
    private router: Router,
    private route: ActivatedRoute,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.searchTerm = params['q'] || '';
      this.searchService.updateSearchTerm(this.searchTerm);
      if (this.searchTerm) {
        this.searchEntra(this.searchTerm);
      }
    });

    this.searchInput$
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((searchTerm) => {
        this.searchTerm = searchTerm;
        this.searchEntra(searchTerm);
      });

    this.searchService.currentSearchTerm.subscribe((term) => {
      this.searchTerm = term;
    });
  }

  onSearchInput() {
    this.searchService.updateSearchTerm(this.searchTerm);
    this.searchInput$.next(this.searchTerm);
  }

  async searchEntra(searchTerm: string) {
    if (searchTerm.length < 3) {
      this.searchResults = [];
      return;
    }

    try {
      const results = await this.graphService.searchEntra(searchTerm);
      this.searchResults = results;
    } catch (error) {
      console.error('Error searching Entra:', error);
    }
  }

  selectResult(result: any) {
    const searchTerm = this.searchService.getCurrentSearchTerm(); // Get the current search term

    if (result.userPrincipalName) {
      this.router.navigate(['/user', result.id], {
        queryParams: { q: searchTerm }, // Pass the current search term as a query parameter
      });
    } else if (result.mail) {
      this.router.navigate(['/group', result.id], {
        queryParams: { q: searchTerm }, // Pass the current search term as a query parameter
      });
    }
  }
}