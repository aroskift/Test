import Todo from './components/Todo';

import './App.scss';

class App{
  constructor(){
  }

  start(){
    this.todo = new Todo();
    console.log('app starting');
  }
}
const app = window._app = new App();
app.start();
