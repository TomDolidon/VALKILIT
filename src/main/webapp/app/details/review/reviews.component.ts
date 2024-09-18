/* eslint-disable */

import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IReview } from 'app/entities/review/review.model';
import { ReviewService } from 'app/entities/review/service/review.service';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'jhi-reviews',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RatingModule, FormsModule, ButtonModule],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.scss',
})
export default class ReviewsComponent implements OnInit {
  @Input() bookId: string | null = null;
  reviews: IReview[] = [];
  selfReview: IReview | null = null;
  reviewForm: FormGroup;

  ngOnInit(): void {
    this.getReviewsForBook();
    this.getSelfReviewForBook();
  }

  constructor(
    private fb: FormBuilder,
    private reviewService: ReviewService,
  ) {
    this.reviewForm = this.fb.group({
      rating: [4, Validators.required], // PrimeNG Rating Control
      comment: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  // Soumettre la review
  onSubmit() {
    if (this.reviewForm.valid && this.bookId) {
      this.reviewService.createReview(this.bookId, this.reviewForm.value).subscribe({
        next: response => {
          this.reviewForm.reset();
          if (response.body) {
            this.reviews.push(response.body);
            this.selfReview = response.body;
          }
        },
        error: error => {
          console.error('Error submitting reviews', error);
        },
      });
    }
  }

  getReviewsForBook(): void {
    if (this.bookId) {
      this.reviewService.getReviewsByBookId(this.bookId).subscribe({
        next: response => {
          this.reviews = response.body || [];
        },
        error: error => {
          console.error('Error retrieving reviews', error);
        },
      });
    }
  }

  getSelfReviewForBook(): void {
    if (this.bookId) {
      this.reviewService.getSelfReviewForBook(this.bookId).subscribe({
        next: response => {
          if (response.body && response.body.length > 0) {
            this.selfReview = response.body[0];
          }
        },
        error: error => {
          console.error('Error retrieving self review', error);
        },
      });
    }
  }
}
