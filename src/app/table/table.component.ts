import {Component, OnInit, ViewChild} from '@angular/core';
import {ToDoListService} from '../services/to-do-list.service';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild('form1', { static: false }) form1: any;
  editingTask = false;
  currentItem: Task = new Task();
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = [];
  tableRows = [
    'label',
    'description',
    'category',
    'done',
    'actions'
  ];
  labelFilter = new FormControl('');
  descriptionFilter = new FormControl('');
  filterValues = {label: '', description: ''};

  constructor(private _ToDoListService: ToDoListService) {
    this.displayedColumns = this.tableRows;
    this.dataSource.filterPredicate = this.tableFilter();
  }

  ngOnInit() {
    this.getToDoListItems();

    // Listen for changes on filter inputs
    this.labelFilter.valueChanges
      .subscribe(
        value => {
          this.filterValues.label = value;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
    this.descriptionFilter.valueChanges
      .subscribe(
        value => {
          this.filterValues.description = value;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
  }

  getToDoListItems() {
    this._ToDoListService.getAllTasks()
      .subscribe((data: any) => {
          this.dataSource.data = data;
        }, error => {}
      );
  }

  deleteTask(task) {
    this._ToDoListService.deleteTaskFromId(task.id)
      .subscribe((data: any) => {
        this.getToDoListItems();
        }, error => {
        window.alert('Error!');
        }
      );
  }

  saveTask() {
    // Proceed only if all required fields are filled
    if (this.currentItem.label && this.currentItem.category && this.currentItem.description) {
      if (this.currentItem.done === true) {
        // If 'Done' is checked with no date, save the current date
        const date = new Date();
        this.currentItem.done = date.toLocaleDateString();
      }
      this._ToDoListService.saveTask(
        this.currentItem.id,
        this.currentItem.label,
        this.currentItem.description,
        this.currentItem.category,
        this.currentItem.done)
      .subscribe(() => {
          this.currentItem = new Task();
          this.editingTask = false;
          this.getToDoListItems();
        },
        error => {
          window.alert('An error occurred');
        }); }
  }

  editTask(task) {
    this.currentItem = new Task(task.id, task.label, task.description, task.category, task.done);

    this.editingTask = true;
  }

  tableFilter(): (data: any, filter: string) => boolean {
    const filterFunction: (data, filter) => boolean = (data, filter) => {
      const searchTerms = JSON.parse(filter);
      return data.label.toLowerCase().indexOf(searchTerms.label.toLowerCase()) !== -1
        && data.description.toLowerCase().indexOf(searchTerms.description.toLowerCase()) !== -1;
    };
    return filterFunction;
  }
}

class Task {
  id: number;
  label: string;
  description: string;
  category: string;
  done: boolean | string;
  constructor(id?, label?, description?, category?, done?) {
    this.id = id || null;
    this.label = label || '';
    this.description = description || '';
    this.category = category || '';
    this.done = done || false;
  }
}
