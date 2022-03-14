import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {filter, Observable, of, Subject, switchMap, takeUntil} from "rxjs";

@Component({
  selector: 'app-child',
  template: `
    <p>
      child works!
    </p>
    <div *ngFor="let field of fields">{{ field.id }} modified: <input type="checkbox" #checkbox (change)="field.modified = checkbox.checked"/></div>
  `
})
export class ChildComponent implements OnInit, OnDestroy {

  @Input()
  add$!: Observable<number>

  @Input()
  remove$!: Observable<void>

  @Input()
  verifyRemoval$!: (id: number, modified: boolean) => Observable<boolean>;

  fields: Array<Field> = [];

  private readonly onDestroy$: Subject<void> = new Subject<void>();

  constructor() { }

  ngOnInit(): void {
    this.add$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((id) => {
        this.fields.push({id, modified: false});
      });

    this.remove$
      .pipe(
        switchMap(() => {
          const lastField = this.fields[this.fields.length - 1];
          if (lastField) {
          return this.verifyRemoval$(lastField.id, lastField.modified)
          } else {
            return of(false);
          }
        }),
        filter(Boolean),
        takeUntil(this.onDestroy$)
      )
      .subscribe(() => {
        this.fields.pop();
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

}

interface Field {id: number, modified: boolean};