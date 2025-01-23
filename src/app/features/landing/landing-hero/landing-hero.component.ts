import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing-hero.component.html'
})
export class LandingHeroComponent {
  getStartedClick = output<void>();
}
