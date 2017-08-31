import {observable, observableArray, unwrap} from 'knockout';
import Todo from './Todo';

export class TodoList{
  constructor({title = 'New List', todos = []} = {}){
    this.title = observable(title);
    this.todos = observableArray(todos);
    this.newTodo = observable(new Todo());

    this.evts = {
      onNewTodoTextKeyDown: (model, evt) => this.onNewTodoTextKeyDown(model, evt),
      onRemoveTodoClick: (model) => this.removeTodo(model)
    };
  }
  
  get todoCount(){
    return unwrap(this.todos).length;
  }
  get data(){
    return {
      title: this.title(),
      todos: this.todos().map(todo => todo.data)
    };
  }

  onNewTodoTextKeyDown(todo, evt){
    if (evt.key === 'Enter'){ // Ref: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
      const parent = evt.target.parentElement;
      this.addTodoFromNewTodo(todo);
      parent.querySelector('input[type=text]').focus();
    } else if (evt.key === 'Backspace'){
      this.removeLastTodo();
    }
    return true;
  }

  addTodoFromNewTodo(todo){
    this.addTodo(todo);
    this.newTodo(new Todo());
  }
  addTodo(todo){
    this.todos.push(todo);
  }

  removeLastTodo(){
    const todos = this.todos();
    if (todos.length === 0) return;
    this.removeTodo(todos[todos.length-1]);
  }
  removeTodo(todo){
    if (!todo.done()){
      if (!confirm("This todo isn't done yet. Do you still want to remove it?")){
        return;
      }
    }
    this.todos.remove(todo);
  }

  static fromData(data){
    const config = Object.assign({}, data, {
      todos: data.todos.map(todo => new Todo(todo))
    });
    return new TodoList(config);
  }
}
export default TodoList;