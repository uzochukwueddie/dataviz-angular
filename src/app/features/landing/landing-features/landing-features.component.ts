import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing-features',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="features" class="py-12 bg-gray-50">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:text-center">
          <h2 class="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
          <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to visualize your data
          </p>
        </div>

        <div class="mt-10">
          <div class="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            <div class="relative">
              <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div class="ml-16">
                <h3 class="text-lg leading-6 font-medium text-gray-900">AI-Powered Insights</h3>
                <p class="mt-2 text-base text-gray-500">
                  Let AI help you discover patterns and create meaningful visualizations from your data.
                </p>
              </div>
            </div>

            <div class="relative">
              <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              </div>
              <div class="ml-16">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Database Integration</h3>
                <p class="mt-2 text-base text-gray-500">
                  Connect to your PostgreSQL database and start visualizing your data in minutes.
                </p>
              </div>
            </div>

            <div class="relative">
              <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div class="ml-16">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Beautiful Charts</h3>
                <p class="mt-2 text-base text-gray-500">
                  Create stunning visualizations with our library of chart types and customization options.
                </p>
              </div>
            </div>

            <div class="relative">
              <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <div class="ml-16">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Interactive Dashboards</h3>
                <p class="mt-2 text-base text-gray-500">
                  Build interactive dashboards to share insights with your team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class LandingFeaturesComponent {}
