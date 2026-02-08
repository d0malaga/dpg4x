import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileBrowserComponent } from './file-browser';
import { SettingsComponent } from './settings';
import { ProgressComponent } from './progress';
import { ApiService } from '../services/api';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FileBrowserComponent, SettingsComponent, ProgressComponent],
  template: `
    <div class="dashboard">
    <div class="dashboard">
      <div class="top-bar">
        <h1>DPG4X Web</h1>
        <button class="icon-btn settings-trigger" (click)="showSettings = true" title="Settings">⚙️</button>
      </div>

      <div class="main-content">
        <div class="file-panel">
          <h3>Select File</h3>
          <app-file-browser (fileSelected)="onFileSelected($event)"></app-file-browser>
          <div class="selected-file" *ngIf="selectedFile">
            <strong>Selected:</strong> {{ selectedFile }}
          </div>
        </div>
      </div>

      <div class="action-bar">
        <button class="convert-btn" [disabled]="!selectedFile" (click)="startConversion()">
          Convert to DPG
        </button>
      </div>

      <app-progress></app-progress>

      <!-- Settings Modal -->
      <div class="modal-overlay" *ngIf="showSettings" (click)="showSettings = false">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <app-settings (close)="showSettings = false"></app-settings>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard { max-width: 1000px; margin: 0 auto; padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; position: relative; }
    
    .top-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid #eee; padding-bottom: 15px; }
    h1 { margin: 0; color: #333; font-size: 1.5em; }
    
    .icon-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; padding: 5px; border-radius: 4px; transition: background 0.2s; }
    .icon-btn:hover { background: #eee; }

    .main-content { display: block; }
    .file-panel { background: white; border-radius: 8px; }
    
    .selected-file { margin-top: 10px; padding: 10px; background: #e3f2fd; border-radius: 4px; word-break: break-all; font-size: 0.9em; }
    
    .action-bar { margin-top: 20px; text-align: center; }
    .convert-btn { font-size: 1.1em; padding: 10px 25px; background: #4caf50; color: white; border: none; border-radius: 5px; cursor: pointer; transition: background 0.2s; }
    .convert-btn:disabled { background: #ccc; cursor: not-allowed; }
    .convert-btn:hover:not(:disabled) { background: #388e3c; }

    /* Modal Styles */
    .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; }
    .modal-content { background: white; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); width: 90%; max-width: 500px; animation: modalIn 0.3s ease-out; }
    
    @keyframes modalIn { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class DashboardComponent {
  selectedFile: string | null = null;
  showSettings: boolean = false;

  constructor(private api: ApiService) { }

  onFileSelected(path: string) {
    this.selectedFile = path;
  }

  startConversion() {
    if (this.selectedFile) {
      this.api.convert(this.selectedFile).subscribe({
        next: () => console.log('Conversion started'),
        error: (err) => alert('Failed to start conversion: ' + err.error.error)
      });
    }
  }
}
