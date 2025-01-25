import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: `
    <div>Dashboard component</div>
  `
})
export class DashboardComponent {


}
