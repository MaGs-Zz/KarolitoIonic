import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiPokeService {

  private apiUrl = 'https://pokeapi.co/api/v2/';

  constructor(private https: HttpClient) {}

  getPokemon(): Observable<any>{

    return this.https.get(this.apiUrl + 'pokemon');

    };

  }
  
