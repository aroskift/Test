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
    if (!this.openList()){
      this.openList(newList);
    }
  }
  selectOpenList(todoList, evt){
    if (evt.ctrlKey){
      if (confirm('Are you sure you want to delete this list?')){
        this.lists.remove(todoList);
        if (this.openList() === todoList){
          this.openList(this.lists()[0]);
        }
      }
      return;
    }
    this.openList(todoList);
  }

  start(){
    applyBindings(this);
    return this;
  }
}
window._app = new App().start();