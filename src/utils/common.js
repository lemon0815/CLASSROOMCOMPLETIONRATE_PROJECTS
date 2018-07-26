export function handleURL(api,params) {
    let urlParams = ''
    for(let key in params){
        urlParams += '&' + key + '=' + params[key]
      }
      let url = api + '?' + urlParams.slice(1)
      return url
}
