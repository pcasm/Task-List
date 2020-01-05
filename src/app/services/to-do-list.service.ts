import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ToDoListService {
  constructor(private http: HttpClient) { }
  url = 'http://localhost:3000/tasks';

  getAllTasks() {
    return this.http.get(this.url);
  }

  deleteTaskFromId(id) {
    return this.http.delete(`${this.url}/${id}`);
  }

  saveTask(_id, _label, _description, _category, _done) {
      const task = {
        label: _label,
        description:  _description,
        category: _category,
        done: _done
      };
      // If there is no Task ID then create a new task
      if (!_id) {
      return this.http.post(this.url, task);
      // Otherwise modify the existing task
    } else {
      return this.http.patch(`${this.url}/${_id}`, task);
    }
  }
}
