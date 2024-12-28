import { Routes } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { GroupDetailsComponent } from './group-details/group-details.component';
import { UserDetailsComponent } from './user-details/user-details.component';

export const routes: Routes = [
  { path: '', component: SearchComponent },
  { path: 'group/:groupId', component: GroupDetailsComponent },
  { path: 'user/:userId', component: UserDetailsComponent }, // Add route for user details
];