import {Component, OnInit, ViewChild} from '@angular/core';
import {ToDoListService} from '../services/to-do-list.service';
import {MAT_CHECKBOX_CLICK_ACTION, MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {FormControl} from '@angular/forms';
import {YesOrNoDialogComponent} from '../shared/dialogs/yes-or-no-dialog/yes-or-no-dialog.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  providers: [{provide: MAT_CHECKBOX_CLICK_ACTION, useValue: 'noop'}]
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

  constructor(private _ToDoListService: ToDoListService, public dialog: MatDialog) {
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

  newTask() {
    this.currentItem = new Task();
    this.editingTask = true;
  }

  doneCheckboxClick() {
    const currentDate = new Date().toLocaleDateString();
    // If the user is trying to mark the task as done, save the current date and check the checkbox
    if (!this.currentItem.done) {
      this.currentItem.done = currentDate;
      // If the user is trying to set the task as undone, and the current done date is different than the saved one,
      // warn the user that the date will be updated
    } else {
      if (this.currentItem.done !== currentDate) {
        const dialogRef = this.dialog.open(YesOrNoDialogComponent, {
          width: '380px',
          data: {
            title: `This task was marked as done on the ${this.currentItem.done}`,
            text: 'If you uncheck the Done button, and then check it again, ' +
              'the completed task date will be set as today, after saving changes.',
            question: 'Would you like to continue?',
            yesText: 'Yes, please',
            noText: 'No'
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          // Set the task as undone if the user agrees that the former completed task date will be lost
          if (result) {
            this.currentItem.done = false;
          }
        });
      } else {
        this.currentItem.done = false;
      }
    }
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
  done: string | boolean;
  constructor(id?, label?, description?, category?, done?) {
    this.id = id || null;
    this.label = label || '';
    this.description = description || '';
    this.category = category || '';
    this.done = done || false;
  }
}
