import {Observable} from "rxjs";

export interface ConfirmResolver {
  confirm$(id: number): Observable<boolean>;
}
