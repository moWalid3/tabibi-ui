import { Component, inject, signal } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../../core/services/auth';
import { Router } from '@angular/router';
import { IUserLoginDto } from '../../../core/models/auth.model';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';

@Component({
  selector: 'app-login',
  imports: [InputTextModule, ButtonModule, MessageModule, IconField, InputIcon, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private authService = inject(Auth);
  private router = inject(Router);

  user: IUserLoginDto = {
    email: '',
    password: '',
  };

  errors = signal<string[]>([]);

  onSubmit(): void {
    this.errors.set([]);

    if (this.user.email && this.user.password) {
      this.authService.login(this.user).subscribe({
        next: (res) => {
          this.router.navigate(['/doctors']);
        },
        error: (res) => {
          Object.values(res.error.errors).forEach((error:any) => {
            this.errors().push(...error)
          });
        },
      });
    } else {
      this.errors.set(['Please fill in all required fields.']);
    }
  }
}
