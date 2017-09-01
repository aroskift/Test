import {observable, observableArray} from 'knockout';
import Todo from './Todo';

export class TodoList{
  constructor({title = 'New List', todos = []} = {}){
    this.title = observable(title);
    this.todos = observableArray(todos);
    this.newTodo = observable(new Todo());

    this.evts = {
      onNewTodoTextKeyDown: (model, evt) => this.onNewTodoTextKeyDown(model, evt),
      onRemoveClick: (model) => this.removeTodo(model)
    };
  }

  getData(){
    return {
      title: this.title(),
      todos: this.todos().map(todo => todo.getData())
    };
  }

  onNewTodoTextKeyDown(todo, evt){
    if (evt.key === 'Enter' && todo.text() !== ''){
      const parent = evt.target.parentElement;
      this.addTodoFromNewTodo(todo);
      parent.querySelector('input').focus();
    } else if (evt.key === 'Backspace' && todo.text() === ''){
      this.removeLastTodo();
    }
    return true;
  }
  addTodoFromNewTodo(todo){
    this.todos.push(todo);
    this.newTodo(new Todo());
  }
  removeLastTodo(){
    const todos = this.todos();
    if (todos.length === 0) return;
    this.removeTodo(todos[todos.length - 1]);
  }
  removeTodo(todo){
    if (!todo.done()){
      if (!confirm("This todo isn't done yet. Do you still want to remove it?")){
        return;
      }
    }
    this.todos.remove(todo);
  }

  static fromData(rawList){
    const config = Object.assign(
      {}, 
      rawList, 
      {
        todos: rawList.todos.map(todo => new Todo(todo))
      }
    );
    return new TodoList(config);
  }
}
export default TodoList;