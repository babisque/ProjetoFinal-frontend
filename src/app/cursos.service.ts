import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Curso } from './Curso';

const httpOpts = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class CursosService {
  url = 'https://localhost:7008/api/cursos'

  constructor(private http: HttpClient) { }

  PegarTodos(): Observable<HttpResponse<Curso[]>> {
    return this.http.get<Curso[]>(this.url, { observe: 'response' });
  }

  PegarPorId(cursoId: number): Observable<Curso> {
    const apiUrl = `${this.url}/${cursoId}`;
    return this.http.get<Curso>(apiUrl);
  }

  SalvarCurso(curso: Curso): Observable<any> {
    return this.http.post<Curso>(this.url, curso, httpOpts);
  }

  AtualizarCurso(curso: Curso, cursoId: number): Observable<any> {
    const apiUrl = `${this.url}/${cursoId}`
    return this.http.put<Curso>(apiUrl, curso, httpOpts);
  }

  ExcluirCurso(cursoId: number): Observable<any> {
    const apiUrl = `${this.url}/${cursoId}`;
    return this.http.delete<number>(apiUrl, httpOpts);
  }
}
