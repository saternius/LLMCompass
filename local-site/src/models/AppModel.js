import Endpoints from "./Endpoints"
var AppModel = new(function(){
    this.update = ()=>{}
    this.setUpdater = (update)=>{
        this.update = update
    }

    this.placeholder = "I have a mental disorder"
    this.matrix = null
    let getCachedResults = (idx)=>{
        Endpoints.getCachedResults({idx}, (res)=>{
            console.log(res)
            this.matrix = res.matrix
            this.update()
        })
    }


    getCachedResults(1)

})()

window.AppModel = AppModel
export default AppModel