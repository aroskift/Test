import {observable, observableArray, applyBindings} from 'knockout';

import TodoList from './components/TodoList';

import './App.scss';

/**
 * @field {observableArray<TodoList[]>} lists
 */
class App{
  constructor(){
    this.lists = observableArray();
    this.openList = observable();

    this.evts = {
      onListClick: (model) => this.setOpenList(model)
    };
  }
  
  setOpenList(todoList){
    this.openList(todoList);
  }
  newList(){
    const newList = new TodoList();
    this.lists.push(newList);
  }

  static start(){
    const app = new App();
    applyBindings(app);
    return app;
  }
}
window._app = App.start();