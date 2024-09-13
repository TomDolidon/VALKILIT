import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

@Component({
  standalone: true,
  selector: 'jhi-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
  imports: [
    CommonModule,
    NgbModule,
    InputIconModule,
    IconFieldModule,
    InputTextModule,
    FormsModule,
    ButtonModule,
    InputGroupModule,
    InputGroupAddonModule,
  ],
})
export class SearchBarComponent {
  searchTerm = '';

  constructor(private router: Router) {}

  clearSearch(): void {
    this.searchTerm = '';
    this.router.navigate(['/catalog']);
  }

  onSearch(): void {
    if (this.searchTerm) {
      this.router.navigate(['/catalog'], { queryParams: { search: this.searchTerm } });
    }
  }
}
