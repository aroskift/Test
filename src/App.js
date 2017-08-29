import Todo from './components/Todo';

class App{
  start(){
    console.log('app starting');
  }
}
const app = window._app = new App();
app.start();
