import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { environment } from '../../environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class ChatService {
  constructor(private http: HttpClient) {}

  sendMessage(question: string) {
    return this.http.post<any>(environment.apiUrl + 'chat', {
      question: question
    }).pipe(
      timeout(20000), // 20 second timeout
      catchError(err => {
        if (err.name === 'TimeoutError') {
          return throwError(() => new Error('Request timed out'));
        }
        return throwError(() => new Error('Could not reach the backend'));
      })
    );
  }
}