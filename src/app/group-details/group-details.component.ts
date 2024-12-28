import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphService } from '../graph.service';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-group-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.scss'],
})
export class GroupDetailsComponent implements OnInit {
  group: any = null;
  groupId: string | null = null;
  groupMembers: any[] = [];

  constructor(
    private graphService: GraphService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.groupId = params.get('groupId');
      console.log('GroupDetailsComponent - ngOnInit - groupId:', this.groupId);
      if (this.groupId) {
        this.loadGroupDetails(this.groupId);
        this.loadGroupMembers();
      }
    });
  }

  async loadGroupDetails(groupId: string) {
    try {
      this.group = await this.graphService.getGroupDetails(groupId);
      console.log('GroupDetailsComponent - loadGroupDetails - group:', this.group);
    } catch (error) {
      console.error('Error loading group details:', error);
    }
  }

  async loadGroupMembers() {
    if (this.groupId) {
      try {
        this.groupMembers = await this.graphService.getGroupMembers(
          this.groupId
        );
        console.log(
          'GroupDetailsComponent - loadGroupMembers - groupMembers:',
          this.groupMembers
        );
      } catch (error) {
        console.error('Error loading group members:', error);
      }
    }
  }
}