import Endpoints from "./Endpoints"
import {stops} from './StopWords'



function getStandardDeviation (array) {
    const n = array.length
    const mean = array.reduce((a, b) => a + b) / n
    return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
}

class Token{
    constructor(index, matrix){
        this.index = index;
        this.parentMatrix = matrix;
        this.maxValue = 0;
        this.minValue = 10
        this.matrix = []
        this.text = matrix[0][0].likeness[index][0]
        this.isStop = stops.has(this.text.slice(1).toLowerCase())
        this.isContinuation = this.text[0] !== "_"
        this.flatVals = []


        matrix.forEach(r=>{
            var row = []
            r.forEach(c=>{
                var val = c.likeness[index][1]
                this.minValue = Math.min(this.minValue, val)
                this.maxValue = Math.max(this.maxValue, val)
                row.push(val)
                this.flatVals.push(val)
            })
            this.matrix.push(row)
        })

        this.sd = getStandardDeviation(this.flatVals)
        //this.sd = this.maxValue/this.minValue
    }
}

var AppModel = new(function(){
    this.update = ()=>{}
    this.setUpdater = (update)=>{
        this.update = update
    }

    this.placeholder = "I have a mental disorder"
    this.matrix = null
    this.tokens = null


    this.run = (statement, cb)=>{
        this.placeholder = statement
        Endpoints.calcBeliefMatrix({statement}, (res)=>{
            console.log(res)
            this.matrix = res.matrix
            let tokenLen = this.matrix[0][0].likeness.length
            let tokens = []
            for(var i=0; i<tokenLen; i++){
                tokens.push(new Token(i, this.matrix))
            }
            this.tokens = tokens;
            this.update()
            if(cb){
                cb()
            }
        })
    }


    this.run(this.placeholder)

})()

window.AppModel = AppModel
export default AppModel