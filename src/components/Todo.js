import {observable} from 'knockout';

export class Todo{
  constructor({text = '', done = false} = {}){
    this.text = observable(text);
    this.done = observable(done);
  }
  
  get data(){
    return {
      text: this.text(),
      done: this.done()
    };
  }

  toggleDone(){
    this.done(!this.done());
  }
}
export default Todo;