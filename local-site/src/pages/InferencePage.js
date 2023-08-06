import React from 'react';
import AppModel from '../models/AppModel';
import loading from '../images/loading.gif'
import { Tooltip } from 'react-tooltip'

let fNum = (num, max)=>{
  if(!max) return (num*100).toString().slice(0,7)


  var maxStr = max.toString()
  let p = "1"
  if(maxStr.includes("e")){
    var e = maxStr.split("e-")[1]
    for(let j=0; j<e; j++){
      p += "0"
    }
  }else{
    Math.floor(1/max).toString().split("").forEach(x=>{
      p += "0"
    })
  }

  p = parseInt(p)
  num *= p

  return (num*100).toString().slice(0,7)
}

function interpolateColor(color1, color2, factor) {
  if (arguments.length < 3) { 
      factor = 0.5; 
  }
  var result = color1.slice();
  for (var i = 0; i < 3; i++) {
      result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
  }
  return result;
};

function interpolateColors(color1, color2, factor) {
    var color1 = color1.match(/\d+/g).map(Number); // convert color1 to array [r, g, b]
    var color2 = color2.match(/\d+/g).map(Number); // convert color2 to array [r, g, b]
    var result = interpolateColor(color1, color2, factor);
    return 'rgb(' + result.join(',') + ')'; // convert array to string
}


class InferencePage extends React.Component {
      constructor(props){
        super(props);
        this.state = {
          valFunc: 'multiply',
          focus: null,
          loading:false,
          includeStops:true
        }

        AppModel.setUpdater(()=>{
          this.setState({})
        })
      }

      getValue(arr){
        if(this.state.valFunc === "mean"){
          let sum = 0
          arr.forEach(x=>{sum += x[1]})
          return sum/arr.length
        }

        if(this.state.valFunc === "min"){
          let min = 10000
          arr.forEach(x=>{min = Math.min(min, x[1])})
          return min
        }

        if(this.state.valFunc === "median"){
          var vals = arr.map(x=>x[1])
          vals = vals.sort()
          return vals[Math.floor(vals.length/2)]
        }

        if(this.state.valFunc === "sum"){
          let sum = 0
          arr.forEach(x=>{sum += x[1]})
          return sum
        }

        if(this.state.valFunc === "multiply"){
          var sum = 0
          arr.forEach(x=>{
            sum += Math.log(x[1]);
          })          
          return Math.exp(sum)*100000 //Math.log(sum)

          // var m = 1
          // arr.forEach(x=>{
          //   m *= x[1]
          // })
          // return m
        }

        if(this.state.valFunc === "multiply-bias-end"){
          var sum = 0
          var pos = 2.719
          arr.forEach(x=>{
            let w = 1 - (1/Math.log(pos))
            sum += Math.log(x[1])*w;
            pos += 1
          })          
          return Math.exp(sum)*100000 //Math.log(sum)

          // var m = 1
          // arr.forEach(x=>{
          //   m *= x[1]
          // })
          // return m
        }

        if(this.state.valFunc === "multiply-stop"){
          var val = 1
          
          for(var i=0; i<arr.length; i++){
            var tok = AppModel.tokens[i]
            if(tok.isStop){
              val *= .5+arr[i][1]
            }else{
              val *= arr[i][1]
            }
          }
          return val
        }


        if(this.state.valFunc === "3-min"){
          var vals = arr.map(x=>x[1])
          vals = vals.sort()
          var tot = 0
          for(var i=0; i<Math.min(vals.length, 3); i++){
            tot += vals[i]
          }
          return tot
        }

        if(this.state.valFunc === "normed-sum"){
          var tot = 0
          for(var i=0; i<arr.length; i++){
            tot += arr[i][1]/AppModel.tokens[i].maxValue
            //console.log(arr[i][1],AppModel.tokens[i].maxValue)
          }
          return tot
        }

        if(this.state.valFunc === "norm-stop"){
          var tot = 0
          for(var i=0; i<arr.length; i++){
            var tok = AppModel.tokens[i]
            var val = arr[i][1]/tok.maxValue
            if(tok.isStop){
              val *= .2
            }
            tot += val
          }
          return tot
        }

        if(this.state.valFunc === "norm-stop-rare"){
          var tot = 0
          for(var i=0; i<arr.length; i++){
            var tok = AppModel.tokens[i]
            var val = arr[i][1]/tok.maxValue
            if(tok.isStop){
              val *= .2
            }
            tot += val*(1/tok.maxValue)
          }
          return tot
        }


      }

      renderLoadingGIF(){
        return(
          <div className='loading-gif'>
            <img src={loading} className='loading-gif'/>
          </div>
        )
      }

      renderMatrix(matrix, labels){
        if(!matrix) return null
        if(this.state.loading) return this.renderLoadingGIF()
        var k = -1
        
        var max = 0
        var min = 1000
        matrix.forEach(row=>{
          row.forEach(val=>{
              max = Math.max(val, max)
              min = Math.min(val, min)
          })
        })

        //console.log(labels)

        var rows = matrix.map(row=>{
          k += 1
          var z = -1
          return (
            <div key={'matrix-'+k} className='matrix-row'>
              {
                row.map(val=>{
                  z += 1
                  var c2 = "rgb(255,255,255)"
                  var c1 = "rgb(0,55,114)"
                  var color = interpolateColors(c2, c1, (val-min)/(max-min))
                  var labEls = null
                  var extraClass = "small-cell"

                  if(labels){
                    labEls =(
                      <div className='label-container'>
                          <div>{labels[k][z][0]}</div>
                          <div>{labels[k][z][1]}</div>
                          <div>{fNum(val, max)}</div>
                      </div>
                    )
                    extraClass = ""
                  }


                  let x = k
                  let y = z
                  return (
                        <div style={{background:color}} key={'matrix-'+z} className={'matrix-cell '+extraClass} onClick={()=>{
                          this.setState({focus:[x,y]})
                        }}>
                            {labEls}
                        </div>
                    )
                })
              }
            </div>
          )
        })

        let MinMaxLabel = ()=>{
          let ratio = max/min
          if(ratio < 8) return "Insignifigant"
          if(ratio < 16) return "Not Nothing"
          if(ratio < 32) return "Weak"
          if(ratio < 64) return "Moderate"
          if(ratio < 128) return "Something"
          return "High"
        }
        
        let confidence = null
        if(this.state.valFunc === "multiply"){
          confidence = (<div className='min-max-ratio'>
                MinMax Ratio: {fNum(max/(min*100))} ({MinMaxLabel()})
          </div>)
        }
        return (
          <div className="matrix-container">
            <div className='matrix'>
              {rows}
              {confidence}
            </div>
            <div className='matrix-scale'>
              <div className='matrix-scale-score'>{fNum(max, max)}</div>
              <div className='matrix-bar'></div>
              <div className='matrix-scale-score'>{fNum(min, max)}</div>
            </div>
          </div>
          )
      }


      renderScaleFns(){
        //var btns = ["min", "mean", "median", "sum", 'multiply', 'multiply-stop', '3-min', 'normed-sum', 'norm-stop', 'norm-stop-rare']
        var btns = ['multiply', 'normed-sum', 'multiply-bias-end']
        return (
          <div className='scale-btns'>
            {btns.map(b=>{
              var style = {}
              if(b === this.state.valFunc){
                style = {background:'black', color:'white'}
              }
              return (<div style={style} className='scale-btn' key={'btn-'+b} onClick={()=>{
                this.setState({valFunc:b})
              }}>{b}</div>)
            })}
          </div>
        )
      }


      renderFocus(){
        if(!this.state.focus) return null
        let i = 0
        let content = AppModel.matrix[this.state.focus[0]][this.state.focus[1]]

        return (
          <div className='focus-container'>
            <div>{content.text}</div>
            {content.likeness.map(x=>{
              i += 1
              //console.log(x)
              return (
                <div className='f-span' key={'f-word-'+i}>
                  <div className='f-token'>
                    {x[0]}
                  </div>
                  <div className='f-val'>
                    {x[1]}
                  </div>
                </div>
              )
            })}
          </div>
        )
      }

      renderRarity(){
        if(!AppModel.tokens) return null
        let maxRarity = 0
        let minRarity = 10
        let CLAMP_VAL = .5
        AppModel.tokens.forEach(tok=>{
          if(tok.maxValue < CLAMP_VAL){
            maxRarity = Math.max(maxRarity, tok.maxValue)
            minRarity = Math.min(minRarity, tok.maxValue)
          }
        })

        let tokens = AppModel.tokens.map(tok=>{
          var color = "rgb(100,100,100)"
          if(tok.maxValue < CLAMP_VAL){
            var extra_blue = 155 - 155*((tok.maxValue-minRarity)/(maxRarity-minRarity))
            color = "rgb(100, 100, "+(100+extra_blue)+")"
          }
          let id = 'rarity-tok-'+tok.index
          return (<span key={id} data-tooltip-id={id} data-tooltip-content={fNum(tok.maxValue)} className='rarity-token' style={{color:color}}>{tok.text}<Tooltip id={id}/></span>)
        })

        return (
          <div className='rarity'>
            <div className='subtitle'>Rarity: </div>
            <div className='tokens'>
                {tokens}
            </div>
          </div>
        )
      }

      renderStandardDeviation(){
        if(!AppModel.tokens) return null
        let maxSD = -100000
        let minSD = 100000
        //let CLAMP_VAL = .5
        AppModel.tokens.forEach(tok=>{
          //if(tok.maxValue < CLAMP_VAL){
            maxSD = Math.max(maxSD, tok.sd)
            minSD = Math.min(minSD, tok.sd)
         // }
        })

        let tokens = AppModel.tokens.map(tok=>{
          var color = "rgb(100,100,100)"
          //if(tok.maxValue < CLAMP_VAL){
          var extra_blue = Math.min(8*Math.log(tok.minMaxRatio*tok.minMaxRatio), 155)
          //console.log( Math.min(Math.log(tok.minMaxRatio*100), 155))
          color = "rgb(100, 100, "+(100+extra_blue)+")"
          //}
          let id = 'sd-tok-'+tok.index
          //console.log(tok.matrix)
          return (<span 
              key={id} 
              data-tooltip-id={id} 
              // data-tooltip-content={tok.sd} 
              data-tooltip-place="bottom" 
              className='rarity-token' 
              style={{color:color}}>{tok.text} 
              <Tooltip id={id}>
                <div>
                  {tok.sd}
                  {this.renderMatrix(tok.matrix)} 
                </div>
              </Tooltip>
              </span>)
        })

        return (
          <div className='rarity'>
            <div className='subtitle'>Min/Max: </div>
            <div className='tokens'>
                {tokens}
            </div>
            
          </div>
        )
      }


      render() {
        let matrix = null
        let labels = null
        if(AppModel.matrix){
          matrix = AppModel.matrix.map(r=>r.map(c=>this.getValue(c.likeness)))
          labels = AppModel.matrix.map(r=>r.map(c=>[c.social, c.economic]))
        }

        return (
          <div className='monitor'>
              <div className="title-desc">Write a statement and hit Enter to see how probable it is (LLAMA2-70B)</div>
              <input onKeyPress={(k)=>{
                  if(k.code === "Enter" && !this.state.loading){
                    this.setState({loading:true})
                    AppModel.run(k.target.value, ()=>{
                      this.setState({loading:false})
                    })
                  }
              }} id='takeInput' className="take-input" placeholder={AppModel.placeholder} type="text"/>
              
              <div className='calculations'>
                <div className='left-row'>
                  {this.renderScaleFns()}
                  {this.renderMatrix(matrix, labels)}
                  {this.renderFocus()}
                </div>
                <div className='right-row'>
                  {this.renderRarity()}
                  {this.renderStandardDeviation()}
                </div>
              </div>
              
              
          </div>
        );
      }
 }

export default InferencePage