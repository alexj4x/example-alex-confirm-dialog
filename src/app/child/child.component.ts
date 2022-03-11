import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {filter, Observable, Subject, switchMap, takeUntil} from "rxjs";
import {ConfirmResolver} from "../confirm-resolver";

@Component({
  selector: 'app-child',
  template: `
    <p>
      child works!
    </p>
    <div *ngFor="let i of fields">input</div>
  `,
  styles: [
  ]
})
export class ChildComponent implements OnInit, OnDestroy {

  @Input()
  add$!: Observable<void>

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
      .subscribe(() => {
        this.fields.push(this.fields.length);
      });

    this.remove$
      .pipe(
        switchMap(() => this.confirmResolver.confirm$()),
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
