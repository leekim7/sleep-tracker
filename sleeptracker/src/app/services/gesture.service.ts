import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GestureService {
  private gestureSubject = new Subject<string>();

  constructor() {}

  public sendGesture(gesture: string): void {
    this.gestureSubject.next(gesture);
  }

  public getGestures(): Observable<string> {
    return this.gestureSubject.asObservable();
  }
}
