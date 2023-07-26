import React from 'react';
import AppModel from '../models/AppModel';

class InferencePage extends React.Component {
      constructor(props){
        super(props);
        this.state = {
          valFunc: 'mean',
          focus: null
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

        if(this.state.valFunc === "max"){
          let max = 10000
          arr.forEach(x=>{max = Math.max(max, x[1])})
          return max
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

      }

      renderMatrix(){
        if(!AppModel.matrix) return null
        var m = []
        var k = 0
        var z = 0


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

        var max = 0
        var min = 1000
        AppModel.matrix.forEach(row=>{
          row.forEach(cell=>{
             // console.log(cell)
              var val = this.getValue(cell.likeness);
              max = Math.max(val, max)
              min = Math.min(val, min)
          })
        })

        var rows = AppModel.matrix.map(row=>{
          k += 1
          return (
            <div key={'matrix-'+k} className='matrix-row'>
              {
                row.map(c=>{
                  z += 1
                  var val = this.getValue(c.likeness);
                  var c1 = "rgb(215,22,0)"
                  var c2 = "rgb(220,223,100)"
                  var color = interpolateColors(c2, c1, (val-min)/(max-min))
                  return (
                        <div style={{background:color}} key={'matrix-'+z} className='matrix-cell' onClick={()=>{
                          this.setState({focus:c.likeness})
                        }}>
                          <div>{c.economic}</div>
                          <div>{c.social}</div>
                          <div>{val.toString().slice(0, 8)}</div>

                        </div>
                    )
                })
              }
            </div>
          )
        })

        return (
          <div className='matrix-grid'>
            {rows}
          </div>
          )
      }


      renderScaleFns(){
        var btns = ["max", "min", "mean", "median", "sum"]
        return (
          <div className='scale-btns'>
            {btns.map(b=>{
              return (<div className='scale-btn' key={'btn-'+b} onClick={()=>{
                this.setState({valFunc:b})
              }}>{b}</div>)
            })}
          </div>
        )
      }


      renderFocus(){
        if(!this.state.focus) return null
        let i = 0
        console.log(this.state.focus)
        return (
          <div className='focus-container'>
            {this.state.focus.map(x=>{
              i += 1
              console.log(x)
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


      render() {
        return (
          <div className='monitor'>
              <div className="title-desc">Write a statement and hit Enter to see how probable it is (LLAMA2-13B)</div>
              <input id='takeInput' className="take-input" placeholder={AppModel.placeholder} type="text"/>
              {this.renderScaleFns()}
              {this.renderMatrix()}
              {this.renderFocus()}
          </div>
        );
      }
 }

export default InferencePage