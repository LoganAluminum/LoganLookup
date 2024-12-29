import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphService } from '../graph.service';
import { Router, RouterModule } from '@angular/router';
import { GroupDetailsComponent } from '../group-details/group-details.component';
import { SearchService } from '../search.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent implements OnInit {
  userDetails: any = null;
  userGroups: any[] = [];
  userId: string | null = null;
  userPhoto: string | null = null;

  constructor(
    private graphService: GraphService,
    private router: Router,
    private route: ActivatedRoute,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.userId = params.get('userId');
      if (this.userId) {
        this.loadUserDetails();
        this.loadUserPhoto();
      }
    });

    this.route.queryParamMap.subscribe((queryParams) => {
      const searchTerm = queryParams.get('q');
      if (searchTerm) {
        this.searchService.updateSearchTerm(searchTerm);
      }
    });
  }

  async loadUserDetails() {
    if (this.userId) {
      try {
        this.userDetails = await this.graphService.getUserDetails(this.userId);
        this.userGroups = await this.graphService.getUserGroups(this.userId);
      } catch (error) {
        console.error('Error loading user details:', error);
      }
    }
  }

  async loadGroupDetails(groupId: string) {
    this.router.navigate(['/group', groupId]);
  }

  async loadUserPhoto() {
    if (this.userId) {
      try {
        const photoUrl = await this.graphService.getUserPhoto(this.userId);
        this.userPhoto = photoUrl;
      } catch (error) {
        console.error('Error loading user photo:', error);
      }
    }
  }
}