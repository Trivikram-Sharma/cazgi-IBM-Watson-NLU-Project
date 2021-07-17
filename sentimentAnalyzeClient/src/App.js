import './bootstrap.min.css';
import './App.css';
import EmotionTable from './EmotionTable.js';
import React from 'react';
import axios from 'axios';

class App extends React.Component {
  state = {innercomp:<textarea rows="4" cols="50" id="textinput"/>,
            mode: "text",
          sentimentOutput:[],
          sentiment:true
        }
  
  renderTextArea = ()=>{
    document.getElementById("textinput").value = "";
    if(this.state.mode === "url") {
      this.setState({innercomp:<textarea rows="4" cols="50" id="textinput"/>,
      mode: "text",
      sentimentOutput:[],
      sentiment:true
    })
    } 
  }

  renderTextBox = ()=>{
    document.getElementById("textinput").value = "";
    if(this.state.mode === "text") {
      this.setState({innercomp:<textarea rows="1" cols="50" id="textinput"/>,
      mode: "url",
      sentimentOutput:[],
      sentiment:true
    })
    }
  }

  sendForSentimentAnalysis = () => {
    this.setState({sentiment:true});
    let ret = "";
    let url = ".";

    if(this.state.mode === "url") {
      url = url+"/url/sentiment?url="+document.getElementById("textinput").value;
    } else {
      url = url+"/text/sentiment?text="+document.getElementById("textinput").value;
    }
    ret = axios.get(url);
    ret.then((response)=>{
      //Include code here to check the sentiment and fomrat the data accordingly
      //let respData = response.data.result;
      //this.setState({sentimentOutput:response.data});
      let output = response.data.result.sentiment.document.label;
      console.log(output);
      if(output === "positive") {
        
        
        output = <table style={{color:"green",fontSize:20,textAlign:"center",border:"10 px"}}>
        <tbody>
          <tr>
            <td style={{color:"green",textAlign:"center"}}>{response.data.result.sentiment.document.score}</td>
            <td style={{color:"green",textAlign:"center"}} >{response.data.result.sentiment.document.label}</td>
          </tr>

        </tbody>

      </table>
        
        /*
        output = 
        <table>
        <tbody>
          {
        Object.entries(response.data.result.sentiment.document).map(function(mapentry){

          return(
            <tr>
              <td style="text-align:center" color="green">{mapentry[0]}</td>
              <td style="text-align:center" color="green">{mapentry[1]}</td>
            </tr>
          )


        }) 
      }
        </tbody></table>


        output = <table><tr style={{color:"green",fontSize:20},{border:"5 px green"},{textAlign:"center"}}><td>{response.data.result.sentiment.document.score}</td><td>
          {response.data.result.sentiment.document.label}</td></tr></table>
      */} else if (output === "negative"){
        //output = <span style={{color:"red",fontSize:20}}>{response.data.result.sentiment.document.label}</span>
       /* output = <table><tr style={{color:"red",fontSize:20},{border:"5 px red"},{textAlign:"center"}}><td>{response.data.result.sentiment.document.score}</td><td>
          {response.data.result.sentiment.document.label}</td></tr></table>
      */
          output = <table style={{color:"red",fontSize:20,textAlign:"center",border:"10 px"}}>
          <tbody>
            <tr>
              <td style={{color:"red",textAlign:"center"}}>{response.data.result.sentiment.document.score}</td>
              <td style={{color:"red",textAlign:"center"}}>{response.data.result.sentiment.document.label}</td>
            </tr>

          </tbody>

        </table>
        
        } else {
        //output = <span style={{color:"yellow",fontSize:20}}>{response.data.result.sentiment.document.label}</span>
        /*output = <table><tr style={{color:"yellow",fontSize:20},{border:"5 px yellow"},{textAlign:"center"}}><td>{response.data.result.sentiment.document.score}</td><td>
          {response.data.result.sentiment.document.label}</td></tr></table>
      */
          output = <table style={{color:"yellow",fontSize:20,textAlign:"center",border:"10 px"}}>
          <tbody>
            <tr>
              <td style={{color:"yellow",textAlign:"center"}}>{response.data.result.sentiment.document.score}</td>
              <td style={{color:"yellow",textAlign:"center"}}>{response.data.result.sentiment.document.label}</td>
            </tr>

          </tbody>

        </table>
          
        }
      this.setState({sentimentOutput:output});
    }).catch(err=>{
      console.log(err);
    });
  }

  sendForEmotionAnalysis = () => {
    this.setState({sentiment:false});
    let ret = "";
    let url = ".";
    if(this.state.mode === "url") {
      url = url+"/url/emotion?url="+document.getElementById("textinput").value;
    } else {
      url = url+"/text/emotion?text="+document.getElementById("textinput").value;
    }
    ret = axios.get(url).then((response)=>{
      console.log(response);
      this.setState({sentimentOutput:<EmotionTable emotions={response.data.result.emotion.document.emotion}/>});
  }).catch(err=>{
    console.log(err);
  });
  }
  

  render() {
    return (  
      <div className="App">
      <button className="btn btn-info" onClick={this.renderTextArea}>Text</button>
        <button className="btn btn-dark"  onClick={this.renderTextBox}>URL</button>
        <br/><br/>
        {this.state.innercomp}
        <br/>
        <button className="btn-primary" onClick={this.sendForSentimentAnalysis}>Analyze Sentiment</button>
        <button className="btn-primary" onClick={this.sendForEmotionAnalysis}>Analyze Emotion</button>
        <br/>
            {this.state.sentimentOutput}
      </div>
    );
    }
}

export default App;
