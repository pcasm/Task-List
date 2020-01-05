import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTexts'
})
export class FormatTextsPipe implements PipeTransform {

  transform(value: any) {
    if (value === false) {
      return 'Pending';
    } else { return value; }
  }

}
