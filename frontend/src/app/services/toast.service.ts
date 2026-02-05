import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Toast {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts$ = new Subject<Toast>();

  success(message: string, title: string = 'Successo'): void {
    this.show({ message, type: 'success', title });
  }

  error(message: string, title: string = 'Errore'): void {
    this.show({ message, type: 'error', title });
  }

  info(message: string, title: string = 'Info'): void {
    this.show({ message, type: 'info', title });
  }

  warning(message: string, title: string = 'Attenzione'): void {
    this.show({ message, type: 'warning', title });
  }

  private show(toast: Toast): void {
    this.toasts$.next(toast);
  }
}
