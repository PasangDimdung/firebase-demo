import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  coursesList$:AngularFireList<any>;
  coursesObject:AngularFireObject<any>;
  courses$: Observable<any[]>;

  constructor(private db: AngularFireDatabase){
    this.coursesList$ = db.list('/courses');
    this.courses$ = this.coursesList$.snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, name: c.payload.val() })
        )
      )
    );
  }

  onAdd(course: HTMLInputElement){
    this.coursesList$.push(course.value);
    course.value = '';
  }

  update(course){
    this.db.object('/courses/'+course.key)
    .set(course.name + ' updated');
  }

  delete(course){
    this.db.object('/courses/'+course.key)
    .remove()
  }
}
