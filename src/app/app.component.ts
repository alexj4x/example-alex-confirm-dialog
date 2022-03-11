import { Component } from '@angular/core';
import {Observable, of, Subject} from "rxjs";
import {ConfirmResolver} from "./confirm-resolver";

@Component({
  selector: 'app-root',
  template: `
    <button (click)="add()">Add field</button>
    <button (click)="remove()">Remove field</button>
    <app-child [add$]="add$.asObservable()"
               [remove$]="remove$.asObservable()"
               [confirmResolver]="confirmResolver"></app-child>
  `
})
export class AppComponent {

  readonly add$: Subject<void> = new Subject<void>();

  readonly remove$: Subject<void> = new Subject<void>();
  confirmResolver: ConfirmResolver = {
    confirm$(): Observable<boolean> {
      return of(confirm('Are u sure?'));
    }
  };

  add(): void {
    this.add$.next();
  }

  remove(): void {
    this.remove$.next();
  }

}
