import {observable, computed} from 'knockout';
import {hash} from '../../shared/utils';

export class LoginBox{
  constructor(){
    this.username = observable();
    this.password = observable();

    this.hasTyped = computed(() => {
      return this.username() && this.password();
    });
    this.hashCombo = computed(() => {
      return hash(this.username() + this.password());
    });
  }
}
export default LoginBox;