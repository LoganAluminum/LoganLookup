import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphService } from '../graph.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-group-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.scss']
})
export class GroupDetailsComponent implements OnChanges {
  @Input() group: any;
  groupId: string | null = null;
  groupMembers: any[] = [];

  constructor(private graphService: GraphService, private route: ActivatedRoute) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['group'] && this.group) {
      this.groupId = this.group.id;
      this.loadGroupMembers();
    }
  }

  async loadGroupMembers() {
    if (this.groupId) {
      try {
        this.groupMembers = await this.graphService.getGroupMembers(this.groupId);
      } catch (error) {
        console.error('Error loading group members:', error);
      }
    }
  }
}