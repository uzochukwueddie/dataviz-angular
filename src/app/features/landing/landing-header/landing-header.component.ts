import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing-header.component.html'
})
export class LandingHeaderComponent {
  // signal output instead of the output directive
  loginClick = output<void>();
  signupClick = output<void>();

  isMobileMenuOpen = false;

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}
