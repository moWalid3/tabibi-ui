import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingsService } from '../../../core/services/bookings/bookings';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.html',
  styleUrl: './booking-details.scss',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, RatingModule, FormsModule, TagModule]
})
export class BookingDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private bookingsService = inject(BookingsService);

  booking = signal<any>(null);
  loading = signal(true);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadBookingDetails(id);
    } else {
      this.router.navigate(['/appointments']);
    }
  }

  loadBookingDetails(id: string) {
    this.loading.set(true);
    this.bookingsService.getBookingDetails(id).subscribe({
      next: (data: any) => {
        this.booking.set(data);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Error fetching booking details:', err);
        this.loading.set(false);
      }
    });
  }

  goBack() {
    this.router.navigate(['/appointments']);
  }

  viewPatient(id: string) {
    this.router.navigate(['/patients', id]);
  }

  viewDoctor(id: string) {
    this.router.navigate(['/doctors', id]);
  }

  getBookingStatusSeverity(status: number): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    switch(status) {
      case 0: return 'warn'; // AwaitingPayment
      case 1: return 'info'; // Confirmed
      case 2: return 'success'; // Completed
      case 3: return 'danger'; // Canceled
      case 4: return 'secondary'; // Refunded
      default: return 'info';
    }
  }

  getBookingStatusLabel(status: number): string {
    switch(status) {
      case 0: return 'Awaiting Payment';
      case 1: return 'Confirmed';
      case 2: return 'Completed';
      case 3: return 'Canceled';
      case 4: return 'Refunded';
      default: return 'Unknown';
    }
  }

  getBookingTypeLabel(type: number): string {
    return type === 0 ? 'Clinic' : 'Video Call';
  }

  getGenderLabel(gender: number): string {
    return gender === 1 ? 'Male' : gender === 2 ? 'Female' : 'Unknown';
  }
}
