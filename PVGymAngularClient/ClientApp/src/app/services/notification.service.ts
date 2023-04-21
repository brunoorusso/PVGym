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

  getNotificationsOfUser(id: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.baseUrl + "api/Notification/UserId/" + id);
  }

  getNewNotificationsOfUser(id: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.baseUrl + "api/Notification/Unread/UserId/" + id);
  }

  getNotification(id: number): Observable<Notification> {
    return this.http.get<Notification>(this.baseUrl + "api/Notification/" + id);
  }

  createNotification(notification: Notification): Observable<Notification> {
    return this.http.post<Notification>(this.baseUrl + "api/Notification", notification);
  }

  updateNotification(id: number, notification: Notification): Observable<Notification> {
    return this.http.put<Notification>(this.baseUrl + "api/Notification/" + id, notification);
  }

  deleteNotification(id: number): Observable<Notification> {
    return this.http.delete<Notification>(this.baseUrl + "api/Notification/" + id);
  }
}
