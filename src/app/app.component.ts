import { Component } from '@angular/core';
import {Observable, of, ReplaySubject, Subject} from "rxjs";
import {ConfirmResolver} from "./confirm-resolver";

@Component({
  selector: 'app-root',
  template: `
    <button (click)="add()">Add field</button>
    <button (click)="remove()">Remove field</button>

    <h2>Child 1</h2>
    <app-child [add$]="add$.asObservable()"
               [remove$]="remove$.asObservable()"
               [confirmResolver]="confirmResolver"></app-child>

    <h2>Child 2</h2>
    <app-child [add$]="add$.asObservable()"
               [remove$]="remove$.asObservable()"
               [confirmResolver]="confirmResolver"></app-child>
  `
})
export class AppComponent {

  readonly add$: Subject<number> = new Subject<number>();
  readonly remove$: Subject<void> = new Subject<void>();

  confirmResolver: ConfirmResolver = this.createConfirmResolver();

  add(): void {
    this.add$.next(new Date().getTime());
  }

  remove(): void {
    this.remove$.next();
  }

  private createConfirmResolver(): ConfirmResolver {

    const map: Map<number, Observable<boolean>> = new Map<number, Observable<boolean>>();
    const self = this;

    return {
      confirm$(id: number): Observable<boolean> {
        if (!map.has(id)) {
          map.set(id, self.createConfirmStream())
        } else {

        }

        return map.get(id) as Observable<boolean>;
      }
    }
  }

  private createConfirmStream(): Observable<boolean> {
    const result = new ReplaySubject<boolean>(1);
    result.next(confirm('Are u sure?'));
    return result;
  }

}
