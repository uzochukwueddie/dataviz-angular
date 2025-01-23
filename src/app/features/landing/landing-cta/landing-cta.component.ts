import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing-cta',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="bg-blue-600">
      <div class="container mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <h2 class="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          <span class="block">Ready to dive in?</span>
          <span class="block text-blue-200">Start your free trial today.</span>
        </h2>
        <div class="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <div class="inline-flex rounded-md shadow">
            <button
              (click)="getStartedClick.emit()"
              class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
            >
              Get started
            </button>
          </div>
          <div class="ml-3 inline-flex rounded-md shadow">
            <a
              href="#features"
              class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800"
            >
              Learn more
            </a>
          </div>
        </div>
      </div>
    </section>
  `
})
export class LandingCtaComponent {
  getStartedClick = output<void>();
}
