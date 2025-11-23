import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Cities as CitiesService } from '../../core/services/cities/cities';
import { ICityDto } from '../../core/models/cities/city.model';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.html',
  styleUrl: './cities.scss',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    ConfirmDialogModule,
    ToastModule
  ],
  providers: [ConfirmationService, MessageService]
})
export class Cities implements OnInit {
  private citiesService = inject(CitiesService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  cities = signal<ICityDto[]>([]);
  loading = signal(false);
  
  // New City
  newCityName = signal('');
  isCreating = signal(false);

  // Inline Editing
  editingCityId = signal<string | null>(null);
  editingCityName = signal('');
  isUpdating = signal(false);

  ngOnInit() {
    this.loadCities();
  }

  loadCities() {
    this.loading.set(true);
    this.citiesService.getAllCities().subscribe({
      next: (data) => {
        this.cities.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading cities', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load cities' });
        this.loading.set(false);
      }
    });
  }

  createCity() {
    if (!this.newCityName().trim()) return;

    this.isCreating.set(true);
    this.citiesService.createCity({ name: this.newCityName() }).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'City created successfully' });
        this.newCityName.set('');
        this.loadCities();
        this.isCreating.set(false);
      },
      error: (err) => {
        console.error('Error creating city', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create city' });
        this.isCreating.set(false);
      }
    });
  }

  startEdit(city: ICityDto) {
    this.editingCityId.set(city.id);
    this.editingCityName.set(city.name);
  }

  cancelEdit() {
    this.editingCityId.set(null);
    this.editingCityName.set('');
  }

  saveEdit(city: ICityDto) {
    if (!this.editingCityName().trim()) return;

    this.isUpdating.set(true);
    this.citiesService.updateCity(city.id, { name: this.editingCityName() }).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'City updated successfully' });
        this.editingCityId.set(null);
        this.loadCities();
        this.isUpdating.set(false);
      },
      error: (err) => {
        console.error('Error updating city', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update city' });
        this.isUpdating.set(false);
      }
    });
  }

  deleteCity(event: Event, city: ICityDto) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to delete this city?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",
      accept: () => {
        this.citiesService.deleteCity(city.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: 'City deleted successfully' });
            this.loadCities();
          },
          error: (err) => {
            console.error('Error deleting city', err);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete city' });
          }
        });
      }
    });
  }
}
