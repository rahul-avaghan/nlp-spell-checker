import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SpellcheckService {
  private spellCheckUrl = 'http://localhost:8000/spellcheck';
  private uploadUrl = 'http://127.0.0.1:8000/upload';

  constructor(private http: HttpClient) { }

  spellCheck2(text: string): Observable<any> {
    const headers = {
      'Content-Type': 'application/json'
    };

    const body = JSON.stringify({ text });

    return new Observable(observer => {
      fetch(this.spellCheckUrl, {
        method: 'POST',
        headers,
        body
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        observer.next(data);
        observer.complete();
      })
      .catch(error => {
        console.error('Error checking spelling:', error);
        observer.error(error);
      });
    }).pipe(
      catchError(error => {
        return throwError(error);
      })
    );
  }

  async uploadFile(file: any){
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await fetch(this.uploadUrl, {
        method: 'POST',
        body: formData
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text(); 
      }
  
      console.log('Upload successful:', data);
      return data;
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }
  
  
}
function throwError(error: any): any {
  throw new Error('Function not implemented.');
}

