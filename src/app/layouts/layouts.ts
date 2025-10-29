import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar';
import { Footer } from './footer/footer';

@Component({
  selector: 'app-layouts',
  imports: [Navbar, RouterOutlet, Footer],
  templateUrl: './layouts.html',
  styleUrl: './layouts.scss',
})
export class Layouts {}
