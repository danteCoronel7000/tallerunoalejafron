import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'core-footer',
  templateUrl: './footer.component.html',
  imports: [RouterLink, DatePipe],
})
export class FooterPageComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);

  public fechaActual: Date = new Date();
  private intervalId: any;

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.fechaActual = new Date();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
