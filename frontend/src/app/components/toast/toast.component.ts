import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent implements OnInit {
  toasts: (Toast & { id: number })[] = [];
  private nextId = 0;

  constructor(private toastService: ToastService) { }

  ngOnInit(): void {
    this.toastService.toasts$.subscribe(toast => {
      const toastWithId = { ...toast, id: this.nextId++ };
      this.toasts.push(toastWithId);

      setTimeout(() => {
        this.remove(toastWithId.id);
      }, 3000);
    });
  }

  remove(id: number): void {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  getAlertClass(type: string): string {
    const classes: any = {
      success: 'alert-success',
      error: 'alert-danger',
      info: 'alert-info',
      warning: 'alert-warning'
    };
    return classes[type] || 'alert-info';
  }
}
