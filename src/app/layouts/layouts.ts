import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar';
import { Footer } from './footer/footer';
import { Sidebar } from './sidebar/sidebar';

@Component({
  selector: 'app-layouts',
  imports: [Navbar, RouterOutlet, Footer, Sidebar],
  templateUrl: './layouts.html',
  styleUrl: './layouts.scss',
})
export class Layouts {}
