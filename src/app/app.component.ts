import { Component } from '@angular/core';
import { Observable, of, ReplaySubject, Subject } from "rxjs";

@Component({
  selector: 'app-root',
  template: `
    <button (click)="add()">Add field</button>
    <button (click)="remove()">Remove field</button>
    <div *ngIf="confirmRemovalMode">
      <p>Do ya really wanna remove da field? At least one of the fields wantas you to confirm before it dies!</p>
      <button (click)="resolveConfirmation(true)">Confirm</button>
      <button (click)="resolveConfirmation(false)">Let it live!</button>
    </div>

    <h2>Child 1</h2>
    <app-child [add$]="add$.asObservable()"
               [remove$]="remove$.asObservable()"
               [verifyRemoval$]="verifyRemoval$"></app-child>

    <h2>Child 2</h2>
    <app-child [add$]="add$.asObservable()"
               [remove$]="remove$.asObservable()"
               [verifyRemoval$]="verifyRemoval$"></app-child>
  `
})
export class AppComponent {

  readonly add$: Subject<number> = new Subject<number>();
  readonly remove$: Subject<void> = new Subject<void>();
  confirmReplaySubject?: ReplaySubject<boolean>;
  readonly numberOfComponents = 2;

  confirmRemovalMode = false;
  removalVerificationInitialized = false;
  unmodifiedCount = 0;

  verifyRemoval$ = (id: number, modified: boolean): Observable<boolean> => {
    if (!this.removalVerificationInitialized) {
      this.confirmReplaySubject = new ReplaySubject<boolean>(1);
      this.removalVerificationInitialized = true;
      this.unmodifiedCount = 0;
      console.log('confirm stream (replay subject) created');
    }

    if (modified) {
      this.confirmRemovalMode = true;
    } else {
      this.unmodifiedCount++;
      if (this.unmodifiedCount === this.numberOfComponents) {
        console.log("No fields modified, no need to ask for the user for removal confirmation");
        this.confirmReplaySubject!.next(true);
        this.confirmReplaySubject!.complete(); // why this doesn't cause exceptions when trying to subscribe to the stream later?
        this.removalVerificationInitialized = false;
        this.unmodifiedCount = 0;
      }
    }
    return this.confirmReplaySubject!.asObservable();
  }

  add(): void {
    this.add$.next(new Date().getTime());
  }

  remove(): void {
    this.remove$.next();
  }

  resolveConfirmation(response: boolean): void {
    this.confirmReplaySubject!.next(response);
    this.confirmReplaySubject!.complete();
    this.confirmRemovalMode = false;
    this.removalVerificationInitialized = false;
  }
}
