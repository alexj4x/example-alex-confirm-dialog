import {Observable} from "rxjs";

export interface ConfirmResolver {
  confirm$(): Observable<boolean>;
}
