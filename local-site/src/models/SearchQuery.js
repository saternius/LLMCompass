
var query = {}
var search = window.location.search
if(search.length > 0){
    search.slice(1).split("&").forEach(arg=>{
        var items = arg.split("=")
        if(items.length === 1){
            query[items[0]] = true
        }else{
            query[items[0]] = items[1]
        }
    })
}
exports.query = query