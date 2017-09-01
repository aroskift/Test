const fetchJson = async (url, body) => {
  const request = {
    method: 'GET'
  };

  if (body){
    request.method = 'POST';
    request.headers = {
      'Content-Type': 'application/json'
    };
    request.body = JSON.stringify(body);
  }

  const response = await fetch(url, request);
  const jsonResponse = await response.json();
  return jsonResponse;

  //return fetch(url, request).then(res => res.json(), () => {}).catch();
};

export class StorageService{
  constructor({endpoint = 'http://localhost:4321'} = {}){
    this.endpoint = endpoint;
  }

  getEndpoint(op){
    return this.endpoint+'/'+op;
  }
  async get(identifier){
    const op = this.getEndpoint('lists/'+identifier);
    return await fetchJson(op);
  }
  async store(identifier, rawList){
    return await fetchJson(this.getEndpoint('lists/'+identifier), rawList);
  }
}
export default StorageService;