import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {filter, Observable, Subject, switchMap, takeUntil} from "rxjs";
import {ConfirmResolver} from "../confirm-resolver";

@Component({
  selector: 'app-child',
  template: `
    <p>
      child works!
    </p>
    <div *ngFor="let id of fields">input, id: {{ id }}</div>
  `
})
export class ChildComponent implements OnInit, OnDestroy {

  @Input()
  add$!: Observable<number>

  @Input()
  remove$!: Observable<void>

  @Input()
  confirmResolver!: ConfirmResolver;

  fields: Array<number> = [];

  private readonly onDestroy$: Subject<void> = new Subject<void>();

  constructor() { }

  ngOnInit(): void {
    this.add$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((id) => {
        this.fields.push(id);
      });

    this.remove$
      .pipe(
        switchMap(() => this.confirmResolver.confirm$(this.fields[this.fields.length - 1])),
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
