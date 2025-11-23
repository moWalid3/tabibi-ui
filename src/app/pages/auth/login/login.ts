import { Component, inject, signal } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../../core/services/auth';
import { Router } from '@angular/router';
import { IUserLoginDto } from '../../../core/models/auth.model';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, InputTextModule, ButtonModule, MessageModule, IconFieldModule, InputIconModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private authService = inject(Auth);
  private router = inject(Router);

  user: IUserLoginDto = {
    email: 'admin@gmail.com',
    password: 'Admin@123',
  };

  loading = signal(false);
  errors = signal<string[]>([]);

  onSubmit(): void {
    this.errors.set([]);
    
    if (this.user.email && this.user.password) {
      this.loading.set(true);
      this.authService.login(this.user).subscribe({
        next: (res) => {
          this.loading.set(false);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.loading.set(false);
          if (err.error && err.error.errors) {
            const errorMessages: string[] = [];
            Object.values(err.error.errors).forEach((error: any) => {
              errorMessages.push(...error);
            });
            this.errors.set(errorMessages);
          } else {
            this.errors.set(['Login failed. Please check your credentials.']);
          }
        },
      });
    } else {
      this.errors.set(['Please fill in all required fields.']);
    }
  }
}
