import {observable, observableArray, unwrap} from 'knockout';

export class TodoList{
  constructor(){
    this.title = observable('New List');
    this.items = observableArray();
  }
  get itemCount(){
    return unwrap(this.items).length;
  }
}
export default TodoList;