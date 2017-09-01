export class StorageService{
  constructor({endpoint = 'http://localhost:4321'} = {}){
    this.endpoint = endpoint;
  }

  getEndpoint(op){
    return this.endpoint+'/'+op;
  }
  async store(identifier, rawLists){
    return await this.fetchJson(this.getEndpoint('lists/'+identifier), rawLists);
  }
  async get(identifier){
    return await this.fetchJson(this.getEndpoint('lists/'+identifier));
  }
  async list(){
    try {
      return await this.fetchJson(this.getEndpoint('lists'));
    } catch (err){
      if (err.status === 404) return [];
    }
  }

  async fetchJson(url, body){
    let request = {
      method: 'GET'
    };

    if (body){
      Object.assign(request, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
    }

    const res = await fetch(url, request);
    if (!res.ok){
      throw res;
    }
    
    return await res.json();
  }
}
export default StorageService;