import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { formatRating } from '@bg-hoard/store/util-formatters';
import { Game } from '@bg-hoard/util-interface';

@Component({
  selector: 'bg-hoard-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Board Game Hoard';
  games = this.http.get<Game[]>('/api/games');
  constructor(private http: HttpClient) {}

  formatRating = formatRating;
}
