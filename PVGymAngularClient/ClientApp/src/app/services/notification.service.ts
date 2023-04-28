/*
* Author: Bernardo Botelho
* Description: The NotificationService is responsible for retrieving Notification objects from the API.
* The service provides methods for retrieving all Notifications, Notifications belonging to a specific user,
* new Notifications belonging to a specific user, retrieving a single Notification, creating a new Notification,
* updating an existing Notification, and deleting a Notification.
*/

import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Notification } from "../notification/notification.component"

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  /*
   * Autor: Bernardo Botelho
   */

  constructor(private http: HttpClient, @Inject("BASE_URL") private baseUrl: string) { }

  /**
   * Returns an Observable of an array of Notification objects from the API.
   * Endpoint: GET '/api/Notification'
   * Returns: Observable of Notification[]
   */
  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.baseUrl + "api/Notification");
  }

  /**
   * Returns an Observable of an array of Notification objects belonging to a user with the given ID.
   * Endpoint: GET '/api/Notification/UserId/:id'
   * Params: id - number representing the ID of the user
   * Returns: Observable of Notification[]
   */
  getNotificationsOfUser(id: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.baseUrl + "api/Notification/UserId/" + id);
  }

  /**
   * Returns an Observable of an array of unread Notification objects belonging to a user with the given ID.
   * Endpoint: GET '/api/Notification/Unread/UserId/:id'
   * Params: id - number representing the ID of the user
   * Returns: Observable of Notification[]
   */
  getNewNotificationsOfUser(id: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.baseUrl + "api/Notification/Unread/UserId/" + id);
  }

  /**
   * Returns an Observable of a single Notification object from the API.
   * Endpoint: GET '/api/Notification/:id'
   * Params: id - number representing the ID of the desired Notification object
   * Returns: Observable of Notification
   */
  getNotification(id: number): Observable<Notification> {
    return this.http.get<Notification>(this.baseUrl + "api/Notification/" + id);
  }

  /**
   * Creates a new Notification object on the server.
   * Endpoint: POST '/api/Notification'
   * Params: notification - Notification object to be created
   * Returns: Observable of Notification
   */
  createNotification(notification: Notification): Observable<Notification> {
    return this.http.post<Notification>(this.baseUrl + "api/Notification", notification);
  }

  /**
   * Updates an existing Notification object on the server.
   * Endpoint: PUT '/api/Notification/:id'
   * Params: id - number representing the ID of the Notification object to be updated
   *         notification - Notification object with updated information
   * Returns: Observable of Notification
   */
  updateNotification(id: number, notification: Notification): Observable<Notification> {
    return this.http.put<Notification>(this.baseUrl + "api/Notification/" + id, notification);
  }

  /**
   * Deletes an existing Notification object from the server.
   * Endpoint: DELETE '/api/Notification/:id'
   * Params: id - number representing the ID of the Notification object to be deleted
   * Returns: Observable of Notification
   */
  deleteNotification(id: number): Observable<Notification> {
    return this.http.delete<Notification>(this.baseUrl + "api/Notification/" + id);
  }
}
