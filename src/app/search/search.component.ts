import { Component, OnInit } from '@angular/core';
import { GraphService } from '../graph.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserDetailsComponent } from '../user-details/user-details.component';
import { GroupDetailsComponent } from '../group-details/group-details.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    UserDetailsComponent,
    GroupDetailsComponent,
    RouterModule
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
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.searchTerm = params['q'] || ''; // Get search term from query parameter
      if (this.searchTerm) {
        this.searchEntra(this.searchTerm);
      }
    });

    this.searchInput$
      .pipe(
        debounceTime(300), // Wait for 300ms pause in typing
        distinctUntilChanged() // Only emit if value actually changed
      )
      .subscribe((searchTerm) => {
        this.searchTerm = searchTerm;
        this.searchEntra(searchTerm);
      });
  }

  onSearchInput() {
    this.searchInput$.next(this.searchTerm);
  }

  async searchEntra(searchTerm: string) {
    if (searchTerm.length < 3) {
      this.searchResults = [];
      this.updateUrl(searchTerm); // Update URL even if search term is too short
      return;
    }

    try {
      const results = await this.graphService.searchEntra(searchTerm);
      this.searchResults = results;
      this.updateUrl(searchTerm); // Update URL with search term
    } catch (error) {
      console.error('Error searching Entra:', error);
    }
  }

  selectResult(result: any) {
    if (result.userPrincipalName) {
      this.router.navigate(['/user', result.id], {
        queryParams: { q: this.searchTerm },
      });
    } else if (result.mail) {
      this.router.navigate(['/group', result.id], {
        queryParams: { q: this.searchTerm },
      });
    }
  }

  private updateUrl(searchTerm: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: searchTerm },
      queryParamsHandling: 'merge',
    });
  }
}