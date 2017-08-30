import {observable, observableArray, applyBindings} from 'knockout';
import TodoList from './components/TodoList';

import './App.scss';

class App{
  constructor(){
    this.lists = observableArray();
    this.openList = observable();

    this.evts = {
      onNewListClick: (model, evt) => this.newList(),
      onListClick: (model, evt) => this.selectOpenList(model, evt)
    };
  }

  newList(model, evt){
    const newList = new TodoList();
    this.lists.push(newList);
    this.openList(newList);
  }
  selectOpenList(todoList, evt){
    if (evt.ctrlKey){
      this.removeTodoList(todoList, !evt.shiftKey);
      return;
    }
    this.openList(todoList);
  }

  removeTodoList(todoList, confirmDelete = true){
    if (confirmDelete){
      if (!confirm('Are you sure you want to delete this list?')){
        return;
      }
    }
    let listIndex = this.lists.indexOf(todoList);
    if (this.openList() === todoList){
      this.openList(this.lists()[listIndex+1]);
    }
    this.lists.remove(todoList);
  }

  start(){
    applyBindings(this);
    return this;
  }
}
window._app = new App().start();