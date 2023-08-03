import {query} from './SearchQuery'


console.log("QUERY:", query)
var host = "http://34.64.54.237:9103"
if(query['host'] !== undefined){
  host = "http://"+query['host']+":9103"
}
var debug = false;

var Endpoints = new (function(){
  var makeEndpoint = (desc)=>{
    var params = desc.params;
    function printParameters(){
      var ret = "\n"
      for(var key in desc){
        ret+=("\t"+key+":"+JSON.stringify(desc[key]))
      }
      return ret;
    }

    if(params === undefined){
      params = {}
    }

    var required = Object.keys(params).filter((k)=>{
      return params[k].required;
    })

    var endpoint = (data, success, def_error)=>{
      var reqs = required.slice();
      var url = desc.url +"?k=0"
      if(def_error === undefined){
        def_error = (e)=>{
          console.log(e)
        }
      }


      var error = (err)=>{
        if(debug) console.log("ERROR FETCHING: "+url)
        console.log(err)
        def_error(err);
      }


      if(desc.type === "GET"){
        for(var key in data){
          if(params[key] === undefined){
            def_error()
            throw new Error(key+' is not a valid parameter: '+printParameters());
          }
          if(reqs.includes(key)){
            reqs.splice(reqs.indexOf(key),1)
          }
          var value = data[key];
          var expectedType = params[key].type;
          var valType = (typeof value);
          if(valType !== expectedType){
            def_error()
            throw new Error(key+' is invalid type. Expected: '+expectedType+", Got: "+valType);
          }
          url+="&"+key+"="+encodeURIComponent(value)
        }

        if(reqs.length>0){
          def_error()
          throw new Error('parameter requirements are unmet: '+reqs)
        }
        //console.log(url)
        fetch(url, {
               headers: { "Content-Type" : "text/html"},
               method: 'GET',
               cache: 'default',
               credentials: "omit"
             }).then((response)=>{
               response.text().then((r)=>{
                  //console.log("Response: ",r)
                  try{
                    var asJSON = JSON.parse(r)
                    success(asJSON)
                  }catch(e){
                    console.log(e)
                    error({status:505})
                  }
                  
               })
             }).catch((err)=>{
               console.log(err)
               console.log("HERE2")
               error("error fetching ["+desc.url+"]: +\n"+err.toString()+"\n+fullURL:"+url)
            })


      }else{
        //console.log(url.substr(0,27))
        //console.log(data)
        fetch(url, {
          method: 'POST',
          mode: 'cors',
          cache: 'default',
          credentials: "omit", // include, same-origin, *omit
          headers:{
            "Content-Type": "application/json; charset=utf-8",
            "Accept": "application/json",
            //"userIDToken": Cookies.get('userIDToken')
          },
          body:JSON.stringify(data)
        })
        .then((response)=>{
          response.json().then(success).catch((err)=>{
            error("error json post ["+desc.url+"]: +\n"+err.toString()+"\n+fullURL:"+url)
          });
        }).catch((err)=>{
          error("error fetching ["+desc.url+"]: +\n"+err.toString()+"\n+fullURL:"+url)
        })
      }
    }

    if(Object.keys(params).length > 0 || desc.type === "POST"){
      return endpoint
    }
    return endpoint.bind(this, {});
  }

  this.getCachedResults = makeEndpoint({
      url: host+"/getCachedResults",
      type: "GET",
      params: {
        'idx': {type: 'number', required: true}
      }
  })

  this.calcBeliefMatrix = makeEndpoint({
    url: host+"/calcBeliefMatrix",
    type: "GET",
    params: {
      'statement': {type: 'string', required: true}
    }
})

  this.makeEndpoint = makeEndpoint
})();

export default Endpoints