import { RouterOutlet } from '@angular/router';
import { SpellcheckService } from './spellcheck.service';
import { Component, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'spell-check-frontend';
  outputWord: string = 'Enter a text to get a spell check';
  uploadResult: string = 'File Not Uploaded';
  private inputSubject = new Subject<string>();

  constructor(private spellcheckService: SpellcheckService) { }

  ngOnInit(): void {
    this.inputSubject.pipe(
      debounceTime(300), // Debounce for 300ms
      distinctUntilChanged(), // Only emit if the value has changed
      switchMap((text: string) => {
        return this.spellcheckService.spellCheck2(text).pipe(
        );
      })
    ).subscribe({
      next: (v) => this.outputWord = v.corrected_text,
      error: (error) => {
        console.error('Error:', error);
        // Handle error here if needed
      }
    });
  }

  onInput(event: Event): void {
    const text = (event.target as HTMLInputElement).value;
    this.inputSubject.next(text);
  }

  fileChangeEvent(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (file) {
      this.spellcheckService.uploadFile(file).then(data => this.uploadResult = data);
    }
  }
}

