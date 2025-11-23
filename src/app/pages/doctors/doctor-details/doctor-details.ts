import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Doctors as DoctorsService } from '../../../core/services/doctors/doctors';
import { IDoctorDetailsDto } from '../../../core/models/doctors/doctor.model';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { ImageModule } from 'primeng/image';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DoctorStatus, Gender, DayOfWeek } from '../../../core/models/doctors/enums';

@Component({
  selector: 'app-doctor-details',
  templateUrl: './doctor-details.html',
  styleUrl: './doctor-details.scss',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, TagModule, ChipModule, ImageModule, ToastModule],
  providers: [MessageService]
})
export class DoctorDetails {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private doctorsService = inject(DoctorsService);
  private messageService = inject(MessageService);

  doctor = signal<IDoctorDetailsDto | null>(null);
  loading = signal(true);
  showImagePreview = false;
  Gender = Gender;
  DayOfWeek = DayOfWeek;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadDoctorDetails(id);
    } else {
      this.router.navigate(['/doctors']);
    }
  }

  loadDoctorDetails(id: string) {
    this.loading.set(true);
    this.doctorsService.getDoctorById(id).subscribe({
      next: (data) => {
        this.doctor.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading doctor details:', error);
        this.loading.set(false);
        // Handle error (e.g., show notification, redirect)
      }
    });
  }

  goBack() {
    this.router.navigate(['/doctors']);
  }

  getGenderLabel(gender: number): string {
    return gender === Gender.Male ? 'Male' : gender === Gender.Female ? 'Female' : 'Unknown';
  }

  getDayName(day: number): string {
    return DayOfWeek[day] || 'Unknown';
  }

  isActionable(): boolean {
    const status = this.doctor()?.status;
    return status !== 'Approved' && status !== 'Rejected';
  }

  approveDoctor() {
    if (!this.doctor()) return;
    this.updateStatus(DoctorStatus.Approved);
  }

  rejectDoctor() {
    if (!this.doctor()) return;
    this.updateStatus(DoctorStatus.Rejected);
  }

  private updateStatus(status: number) {
    const id = this.doctor()!.id;
    this.doctorsService.updateDoctorStatus(id, status).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Doctor status updated successfully' });
        this.loadDoctorDetails(id); // Reload to reflect changes
      },
      error: (error) => {
        console.error('Error updating status:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update status' });
      }
    });
  }
}
