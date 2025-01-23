import { Component, signal, WritableSignal } from "@angular/core";
import { LandingHeaderComponent } from "./landing-header/landing-header.component";
import { LandingHeroComponent } from "./landing-hero/landing-hero.component";
import { LandingFeaturesComponent } from "./landing-features/landing-features.component";
import { LandingTestimonialsComponent } from "./landing-testimonials/landing-testimonials.component";
import { LandingCtaComponent } from "./landing-cta/landing-cta.component";
import { LandingFooterComponent } from "./landing-footer/landing-footer.component";

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    LandingHeaderComponent,
    LandingHeroComponent,
    LandingFeaturesComponent,
    LandingTestimonialsComponent,
    LandingCtaComponent,
    LandingFooterComponent
  ],
  templateUrl: './landing.component.html',
})
export class LandingComponent {
  isLoginModalOpen: WritableSignal<boolean> = signal<boolean>(false);
  isSignupModalOpen: WritableSignal<boolean> = signal<boolean>(false);

  showLoginModal(): void {
    this.isLoginModalOpen.set(true);
    this.isSignupModalOpen.set(false);
  }

  showSignupModal(): void {
    this.isLoginModalOpen.set(false);
    this.isSignupModalOpen.set(true);
  }

  closeLoginModal(): void {
    this.isLoginModalOpen.set(false);
  }

  closeSignupModal(): void {
    this.isSignupModalOpen.set(false);
  }

  switchToSignup(): void {
    this.isLoginModalOpen.set(false);
    this.isSignupModalOpen.set(true);
  }

  switchToLogin(): void {
    this.isLoginModalOpen.set(true);
    this.isSignupModalOpen.set(false);
  }
}
