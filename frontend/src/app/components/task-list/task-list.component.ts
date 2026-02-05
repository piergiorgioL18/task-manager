import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { ToastService } from '../../services/toast.service';
import { Task, CreateTaskDto } from '../../models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  showModal = false;
  editMode = false;
  currentTaskId?: number;

  // Filtri
  searchTerm = '';
  filterStatus = 'ALL';
  filterPriority = 'ALL';

  newTask: CreateTaskDto = {
    title: '',
    description: '',
    status: 'DA_FARE',
    priority: 'MEDIUM',
    dueDate: '',
    tags: []
  };

  tagInput = '';

  constructor(
    private taskService: TaskService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.applyFilters();
      },
      error: (err) => {
        console.error('Errore caricamento task:', err);
        this.toastService.error('Impossibile caricare i task');
      }
    });
  }

  applyFilters(): void {
    this.filteredTasks = this.tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (task.description?.toLowerCase().includes(this.searchTerm.toLowerCase()) ?? false);
      const matchesStatus = this.filterStatus === 'ALL' || task.status === this.filterStatus;
      const matchesPriority = this.filterPriority === 'ALL' || task.priority === this.filterPriority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  openCreateModal(): void {
    this.editMode = false;
    this.resetForm();
    this.showModal = true;
  }

  openEditModal(task: Task): void {
    this.editMode = true;
    this.currentTaskId = task.id;
    this.newTask = {
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      tags: [...task.tags]
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.resetForm();
  }

  saveTask(): void {
    if (!this.newTask.title.trim()) {
      this.toastService.warning('Il titolo è obbligatorio');
      return;
    }

    if (this.editMode && this.currentTaskId) {
      this.taskService.updateTask(this.currentTaskId, this.newTask).subscribe({
        next: () => {
          this.toastService.success('Task aggiornato con successo');
          this.loadTasks();
          this.closeModal();
        },
        error: (err) => {
          console.error('Errore aggiornamento:', err);
          this.toastService.error('Errore durante l\'aggiornamento');
        }
      });
    } else {
      this.taskService.createTask(this.newTask).subscribe({
        next: () => {
          this.toastService.success('Task creato con successo');
          this.loadTasks();
          this.closeModal();
        },
        error: (err) => {
          console.error('Errore creazione:', err);
          this.toastService.error('Errore durante la creazione');
        }
      });
    }
  }

  deleteTask(id: number): void {
    if (confirm('Sei sicuro di voler eliminare questo task?')) {
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          this.toastService.success('Task eliminato');
          this.loadTasks();
        },
        error: (err) => {
          console.error('Errore eliminazione:', err);
          this.toastService.error('Errore durante l\'eliminazione');
        }
      });
    }
  }

  addTag(): void {
    if (this.tagInput.trim() && !this.newTask.tags?.includes(this.tagInput.trim())) {
      this.newTask.tags = [...(this.newTask.tags || []), this.tagInput.trim()];
      this.tagInput = '';
    }
  }

  removeTag(tag: string): void {
    this.newTask.tags = this.newTask.tags?.filter(t => t !== tag) || [];
  }

  resetForm(): void {
    this.newTask = {
      title: '',
      description: '',
      status: 'DA_FARE',
      priority: 'MEDIUM',
      dueDate: '',
      tags: []
    };
    this.tagInput = '';
    this.currentTaskId = undefined;
  }

  getPriorityBadge(priority: string): string {
    const badges: any = {
      'HIGH': 'danger',
      'MEDIUM': 'warning',
      'LOW': 'success'
    };
    return badges[priority] || 'secondary';
  }

  getStatusBadge(status: string): string {
    const badges: any = {
      'DA_FARE': 'secondary',
      'IN_CORSO': 'primary',
      'FATTO': 'success'
    };
    return badges[status] || 'secondary';
  }
}
