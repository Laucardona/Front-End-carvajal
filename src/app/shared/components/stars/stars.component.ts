import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stars',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="estrellas" [attr.title]="rating + ' de 5'">
      <svg
        *ngFor="let n of [1, 2, 3, 4, 5]"
        class="estrella"
        [class.estrella--llena]="n <= llenas"
        viewBox="0 0 20 20"
      >
        <path
          d="M10 1l2.6 5.8 6.2.6-4.7 4.2 1.4 6.2L10 14.9 4.5 17.8l1.4-6.2L1.2 7.4l6.2-.6z"
        />
      </svg>
    </span>
  `,
})
export class StarsComponent {
  @Input() rating = 0;

  get llenas(): number {
    return Math.round(this.rating);
  }
}
