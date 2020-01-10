import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-yes-or-no-dialog',
  templateUrl: './yes-or-no-dialog.component.html',
  styleUrls: ['./yes-or-no-dialog.component.scss']
})
export class YesOrNoDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<YesOrNoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
