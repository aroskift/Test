import './App.scss';

class App{
  constructor(){
  }

  start(){
    console.log('app starting');
  }
}
const app = window._app = new App();
app.start();