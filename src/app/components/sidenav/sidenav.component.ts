import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent {
  menuItems = [
    { icon: 'home', label: 'Dashboard', route: '/dashboard' },
    { icon: 'factory', label: 'Plantas', route: '/plants' },
    { icon: 'analytics', label: 'Monitoreo', route: '/monitoring' },
    { icon: 'warning', label: 'Alertas', route: '/alerts' },
    { icon: 'settings', label: 'Configuración', route: '/settings' }
  ];
}