import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private searchTermSubject = new BehaviorSubject<string>('');
  currentSearchTerm = this.searchTermSubject.asObservable();

  constructor() {}

  updateSearchTerm(searchTerm: string) {
    this.searchTermSubject.next(searchTerm);
  }
}