import { Component, inject, signal, ViewChild, OnInit } from '@angular/core';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ActivatedRoute, Router } from '@angular/router';
import { ReviewsService } from '../../core/services/reviews/reviews';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.html',
  styleUrl: './reviews.scss',
  standalone: true,
  imports: [TableModule, CommonModule, FormsModule, IconFieldModule, InputIconModule, InputTextModule, RatingModule, ButtonModule, TagModule]
})
export class Reviews implements OnInit {
  @ViewChild('dt') dt!: Table;
  private reviewsService = inject(ReviewsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  reviews = signal<any[]>([]);
  totalRecords = signal(0);
  loading = signal(false);

  // Filters
  searchValue = signal('');
  private searchSubject = new Subject<string>();
  patientIdParam = signal<string | null>(null);
  doctorIdParam = signal<string | null>(null);

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['patientId']) this.patientIdParam.set(params['patientId']);
      if (params['doctorId']) this.doctorIdParam.set(params['doctorId']);
      
      // reload table if it was already initialized
      setTimeout(() => this.reloadTable(), 0);
    });

    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(value => {
      this.searchValue.set(value);
      this.reloadTable();
    });
  }

  onSearch(value: string) {
    this.searchSubject.next(value);
  }

  loadReviews(event: TableLazyLoadEvent) {
    this.loading.set(true);

    const page = (event.first ?? 0) / (event.rows ?? 10) + 1;
    const pageSize = event.rows ?? 10;
    
    let sortBy = '';
    let sortOrder = '';

    if (event.sortField) {
      sortBy = event.sortField as string; // Will usually be 'rating'
      sortOrder = event.sortOrder === 1 ? 'ASC' : 'DESC';
    }

    const params: any = {
      page: page,
      size: pageSize,
    };

    if (this.searchValue()) params.search = this.searchValue();
    if (this.patientIdParam()) params.patientId = this.patientIdParam();
    if (this.doctorIdParam()) params.doctorId = this.doctorIdParam();
    
    if (sortBy) {
      params.sortBy = sortBy;
      params.sortOrder = sortOrder;
    }

    this.reviewsService.getReviewsOverview(params).subscribe({
      next: (response) => {
        const result = response.JsonResult;
        this.reviews.set(result.data);
        this.totalRecords.set(result.totalCount);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error fetching reviews:', error);
        this.loading.set(false);
      }
    });
  }
  
  reloadTable() {
    if (this.dt) {
      this.dt.reset();
    }
  }

  viewDoctor(id: string) {
    this.router.navigate(['/doctors', id]);
  }

  viewPatient(id: string) {
    this.router.navigate(['/patients', id]);
  }

  clearFilters() {
    this.searchValue.set('');
    this.patientIdParam.set(null);
    this.doctorIdParam.set(null);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
      replaceUrl: true
    });
    this.reloadTable();
  }
}
