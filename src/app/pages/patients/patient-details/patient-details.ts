import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Patients as PatientsService } from '../../../core/services/patients/patients';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.html',
  styleUrl: './patient-details.scss',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, RatingModule, FormsModule, TagModule]
})
export class PatientDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private patientsService = inject(PatientsService);

  patient = signal<any>(null);
  loading = signal(true);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPatientDetails(id);
    } else {
      this.router.navigate(['/patients']);
    }
  }

  loadPatientDetails(id: string) {
    this.loading.set(true);
    this.patientsService.getPatientDetails(id).subscribe({
      next: (data: any) => {
        this.patient.set(data);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Error fetching patient details:', err);
        this.loading.set(false);
      }
    });
  }

  goBack() {
    this.router.navigate(['/patients']);
  }

  viewAllReviews() {
    const id = this.patient()?.id;
    if (id) {
      this.router.navigate(['/reviews'], { queryParams: { patientId: id } });
    }
  }

  viewAllBookings() {
    const id = this.patient()?.id;
    if (id) {
      this.router.navigate(['/appointments'], { queryParams: { patientId: id } });
    }
  }

  viewTodayBookings() {
    const id = this.patient()?.id;
    if (id) {
      const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
      this.router.navigate(['/appointments'], { queryParams: { patientId: id, startDate: today, endDate: today } });
    }
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
}
