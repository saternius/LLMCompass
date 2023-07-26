import React from 'react';
import AppModel from '../models/AppModel';

class InferencePage extends React.Component {
      constructor(props){
        super(props);
        this.state = {
          valFunc: 'mean'
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

      }

      renderMatrix(){
        if(!AppModel.matrix) return null
        var m = []
        var k = 0
        var z = 0

        var max = 0
        AppModel.matrix.forEach(row=>{
          row.forEach(cell=>{
              console.log(cell)
              var val = this.getValue(cell.likeness);
              max = Math.max(val, max)
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
                  var green = 255*(val/max)
                  var blue = 255*(val/max)
                  var red = 255*(val/max)
                  var color = `rgb(${red}, ${green}, ${blue})`
                  return (
                        <div style={{background:color}} key={'matrix-'+z} className='matrix-cell'>
                          <div>{c.economic}</div>
                          <div>{c.social}</div>
                          <div>{Math.floor(green)}</div>

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
      render() {
        return (
          <div className='monitor'>
              <div className="title-desc">Write a statement and hit Enter to see how probable it is (LLAMA2-13B)</div>
              <input id='takeInput' className="take-input" placeholder={AppModel.placeholder} type="text"/>
              {this.renderMatrix()}
          </div>
        );
      }
 }

export default InferencePage