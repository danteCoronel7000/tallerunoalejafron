import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterPageComponent } from './core/components/footer/footer.component';
import { MenuComponent } from './core/components/menu/menu.component';
import { Notificacion } from "./core/components/notificacion/notificacion";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuComponent, FooterPageComponent, Notificacion],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'colegio-jma';
}
