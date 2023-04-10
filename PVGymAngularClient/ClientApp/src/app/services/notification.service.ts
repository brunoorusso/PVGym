import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Notification } from "../notification/notification.component"

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient, @Inject("BASE_URL") private baseUrl: string) { }

  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.baseUrl + "api/Notification");
  }

  getNotification(id: number): Observable<Notification> {
    return this.http.get<Notification>(this.baseUrl + "api/Notification/" + id);
  }

  createNotification(notification: Notification): Observable<Notification> {
    return this.http.post<Notification>(this.baseUrl + "api/Notification", notification);
  }
}
