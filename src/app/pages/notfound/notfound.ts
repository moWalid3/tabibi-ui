import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-notfound',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './notfound.html',
})
export class Notfound {
  private router = inject(Router);

  goHome() {
    this.router.navigate(['/']);
  }
}
