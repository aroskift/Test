import ko from 'knockout';

export class Todo{
  constructor(){
    this.text = ko.observable();
  }
}
export default Todo;