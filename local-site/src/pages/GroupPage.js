import React from 'react';
// import AppModel from '../models/AppModel';
import loading from '../images/loading.gif'
import { Tooltip } from 'react-tooltip'
import '../styles/Groups.css';

const disorders = ['acute stress disorder', 'ADHD', 'adjustment disorders',  'agoraphobia',  'alcoholism',  'anorexia',  'antisocial',  'autism',  'avoidant personality',  'binge eating',  'bipolar',  'body dysmorphic',  'body integrity identity disorder',  'borderline',  'brief psychotic disorder',  'bulimia nervosa',  'catatonia',  'conduct disorder',  'conversion disorder',  'cyclothymia',  'delusional disorder',  'dementia',  'dependent personality disorder',  'depersonalization',  'depression',  'disinhibited social engagement disorder',  'disruptive mood dysregulation',  'dissociative amnesia',  'dissociative identity disorder',  'drug addiction',  'dysphoria',  'dysthymia',  'erectile dysfunction',  'factitious disorder',  'feeding disorder',  'gambling addiction',  'gender dysphoria',  'generalized anxiety disorder',  'histrionic',  'hoarding disorder',  'hypochondriasis',  'illness anxiety disorder',  'insomnia',  'intermittent explosive disorder',  'internet addiction',  'kleptomania',  'major depressive disorder',  'mental retardation',  'Munchausen syndrome', 'narcissism',  'narcolepsy',  'night terrors',  'OCD', 'oppositional defiant disorder',  'panic disorder',  'paranoia',  'paraphilia',  'pica',  'postpartum depression',  'premenstrual dysphoric disorder',  'psychopathy',  'ptsd', 'pyromania',  'reactive attachment disorder',  'restless leg syndrome',  'rumination', 'schizoaffective disorder',  'schizoid',  'schizophrenia',  'schizophreniform disorder',  'schizotypal',  'seasonal affective disorder',  'selective mutism',  'self-harm',  'separation anxiety disorder',  'sleep apnea',  'sleep paralysis',  'social anxiety disorder',  'sociopathy',  'somatic symptom disorder',  'somnambulism',  'specific phobias',  'stereotypic movement disorder',  'tic disorders',  "Tourette's syndrome",  'trichotillomania']
class GroupPage extends React.Component {
      constructor(props){
        super(props);
        this.state = {
            page: 'ADHD',
            next: 'adjustment disorders',
            prev: 'acute stress disorder'
        }
        // AppModel.setUpdater(()=>{
        //   this.setState({})
        // })

        this.goto = (d)=>{
            var idx = disorders.indexOf(d)
            if(idx === -1) return
            let p = (idx>0)? idx - 1: disorders.length-1
            this.setState({page:d, next: disorders[(idx+1)%disorders.length], prev:disorders[p]})
            window.location.hash = '#'+d
        }
      }

      render() {
        return (
          <div className='disorder-content'>
              <div className='disorders-list'>
                <div className='disorder-title'>Conditions </div>
                <div className='disorder-items'> 
                    {disorders.map(d=>{
                        var style = {}
                        if(this.state.page === d){
                            style = {color: '#bf3838'}
                        }
                        return (<div 
                                    style={style} 
                                    className='dlink link' 
                                    onClick={this.goto.bind(this,d)}
                                    key={'disorder-link-'+d}>
                                        {d}
                                        </div>)
                    })}
                    <br/><br/><br/>
                </div>
              </div>
              <div className='results'>
                <iframe className='dr-frame' src={"dsm5/"+this.state.page+".html"}/>
                <div className='bottom-navigate'>
                    <div className='prev-btn link' onClick={this.goto.bind(this,this.state.prev)}>
                        ◄ {this.state.prev}
                    </div>
                    <div className='prev-btn link' onClick={this.goto.bind(this,this.state.next)}>
                        {this.state.next} ►
                    </div>
                </div>
              </div>
              <div className='explaination'>
                <div className='method-title'>Methodology</div>
                <div>
                    The 
                    <span className='link' onClick={()=>{window.open('https://10groups.github.io/')}}>10groups</span> question set was ran through 
                    <span className='link' onClick={()=>{window.open('https://ai.meta.com/llama/')}}>Llama-2-70b-hf</span> model to get a prediction on how likely the statement would correlate with the mental disorder on the top left. 
                    From this we were able to get a fixation score.
                    For more details visit: <span className='link'>mental.meaning.io</span>
                </div>
              </div>
          </div>
        );
      }
 }

export default GroupPage