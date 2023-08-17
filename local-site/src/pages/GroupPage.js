import React from 'react';
// import AppModel from '../models/AppModel';
import loading from '../images/loading.gif'
import { Tooltip } from 'react-tooltip'
import '../styles/Groups.css';

// Labels
const disorders = ['acute stress disorder', 'ADHD', 'adjustment disorders',  'agoraphobia',  'alcoholism',  'anorexia',  'antisocial',  'autism',  'avoidant personality',  'binge eating',  'bipolar',  'body dysmorphic',  'body integrity identity disorder',  'borderline',  'brief psychotic disorder',  'bulimia nervosa',  'catatonia',  'conduct disorder',  'conversion disorder',  'cyclothymia',  'delusional disorder',  'dementia',  'dependent personality disorder',  'depersonalization',  'depression',  'disinhibited social engagement disorder',  'disruptive mood dysregulation',  'dissociative amnesia',  'dissociative identity disorder',  'drug addiction',  'dysphoria',  'dysthymia',  'erectile dysfunction',  'factitious disorder',  'feeding disorder',  'gambling addiction',  'gender dysphoria',  'generalized anxiety disorder',  'histrionic',  'hoarding disorder',  'hypochondriasis',  'illness anxiety disorder',  'insomnia',  'intermittent explosive disorder',  'internet addiction',  'kleptomania',  'major depressive disorder',  'mental retardation',  'Munchausen syndrome', 'narcissism',  'narcolepsy',  'night terrors',  'OCD', 'oppositional defiant disorder',  'panic disorder',  'paranoia',  'paraphilia',  'pica',  'postpartum depression',  'premenstrual dysphoric disorder',  'psychopathy',  'ptsd', 'pyromania',  'reactive attachment disorder',  'restless leg syndrome',  'rumination', 'schizoaffective disorder',  'schizoid',  'schizophrenia',  'schizophreniform disorder',  'schizotypal',  'seasonal affective disorder',  'selective mutism',  'self-harm',  'separation anxiety disorder',  'sleep apnea',  'sleep paralysis',  'social anxiety disorder',  'sociopathy',  'somatic symptom disorder',  'somnambulism',  'specific phobias',  'stereotypic movement disorder',  'tic disorders',  "Tourette's syndrome",  'trichotillomania']
const sexuality = ["submissive", "dominant", "sadist", "masochist", "heterosexual", "homosexual"]
const personalities = ['conscientiousness','agreeableness','neuroticism', 'openness', 'extroversion', 'introversion', 'thinking', 'feeling', 'sensing', 'intuition', 'judging', 'perceiving']
const love_language = ["words of affirmation", "quality time", "physical touch", "acts of service", "recieving gifts"]
const politics = ['left wing', 'right wing', 'conserve society', 'reform society', 'persist culture', 'compromise culture', 'civil law', 'common law', 'hierarchical', 'equality', 'radical', 'moderate', 'political', 'apolitical', 'direct', 'transitional', 'libertarian', 'authoritarian', 'primitivism', 'transhumanism', 'particular', 'universal', 'globalism', 'nationalism', 'capitalism', 'socialism', 'decelerationism', 'accelerationism', 'free economy', 'planned economy', 'multicultural', 'monocultural', 'punative law', 'rehabilatative law']
const morality = ['individualism', 'collectivism', 'revolutionary', 'peaceful', 'idealism', 'realism', 'consequentialist', 'deontologist']


// Quizzes 
// 10 groups, OCEANS, MyersBriggs, vividmind

class GroupPage extends React.Component {
      constructor(props){
        super(props);
        let page = "autism"

        if(window.location.hash.length > 0){
            var subject = window.location.hash.slice(1).replace("%20", " ")
            console.log("subject:", subject)
            if(disorders.indexOf(subject) > 0){
                page = subject
            }
        }

        this.state = {
            page: page,
            next: 'adjustment disorders',
            prev: 'acute stress disorder',
            toggled:{
                'Psychiatry': true
            }
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

      renderCategory(name, labels){
        var style = this.state.toggled[name]?{height:21*labels.length}:{height:'0vh'}
        var unicode = this.state.toggled[name]?"▼":"▶"
        var unicodeStyle = this.state.toggled[name]?{fontSize:16, marginRight:0}:{}
        return (
            <div>
                <div className='label-title' onClick={()=>{
                    this.state.toggled[name] = !this.state.toggled[name]
                    this.setState({})
                }}> <span style={unicodeStyle} className='unicode-toggle'>{unicode}</span> {name} </div>
                <div className='label-items' style={style}> 
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
            
        )

      }

      render() {
        return (
          <div className='labels-content'>
              <div className='disorders-list'>
                {this.renderCategory("Psychiatry", disorders)}
              </div>
              <div className='results'>
                <iframe className='dr-frame' src={"group10/disorders/"+this.state.page+".html"}/>
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
                    {/* <div>
                        <span data-tooltip-id='UNIQUE' data-tooltip-content="CONTENT HERE">TEST</span>
                    </div> */}
                    The 
                    <span className='link' onClick={()=>{window.open('https://10groups.github.io/')}}> 10groups</span> question set was ran through 
                    <span className='link' onClick={()=>{window.open('https://ai.meta.com/llama/')}}> Llama-2-70b-hf</span> model to get a prediction on how likely the statement would correlate with the mental disorder on the top left. 
                    From this we were able to get a fixation score.
                    Visit our <span className='link' onClick={()=>{window.open('https://github.com/saternius/LLMCompass/tree/master/llama2')}}>git repo</span> for details on the code and prompt that was used to generate this.
                    {/* <br/><br/>I'm trying to find people who are interested in research like this. If you are, <span className='link' onClick={()=>{window.open('https://discord.gg/4JKeuSjR')}}>join this discord</span> */}
                </div>
              </div>
              <Tooltip id="LABEL-economy"/>
          </div>
        );
      }
 }


//  'government': '',
//  'diplomacy': '',
//  'society': '',
//  'technology': '',
//  'law': '',
//  'culture': '',
//  'procedure': '',
//  'politics': '',
//  'morality': ''

export default GroupPage