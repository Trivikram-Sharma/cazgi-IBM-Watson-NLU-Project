const express = require('express');
const app = new express();
const dotenv = require('dotenv');
dotenv.config();

function getNLUInstance(){
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;
    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const {IamAuthenticator} = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1(
        {
            version : '2020-08-01',
            authenticator:new IamAuthenticator({
                apikey: api_key,
            }),
            serviceUrl: api_url,
        });
        return naturalLanguageUnderstanding;
}







app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {
    let analyzeParams = {
        'url' : req.url,
        'features':{
            'emotion':{
                'document':'false'
            },
        }

    }
        let NLUInstance = getNLUInstance();
        NLUInstance.analyze(analyzeParams).then(
            analysisResults =>{
               return res.send(analysisResults['emotion']['document']['emotion']);
            }

        ).catch(
            err=>{
                return res.send(err);
            }
        );
   // return res.send({"happy":"90","sad":"10"});
});

app.get("/url/sentiment", (req,res) => {
    let analyzeParams = {
        'url': req.url,
        'features':{
            'sentiment':{

            }
        }
    }
    let NLUInstance = getNLUInstance();
    NLUInstance.analyze(analyzeParams).then(
        analysisResults=>{
            return res.send(analysisResults['sentiment']['document']);
        }
    ).catch(
        err=>{
            return res.send(err);
        }
    );
    //return res.send("url sentiment for "+req.query.url);
});

app.get("/text/emotion", (req,res) => {
    let analyzeParams = {
        'text': req.params.text,
        'features':{
            'emotion':{
                'document':'false'
            }
        }
    }
    let NLUInstance = getNLUInstance();
    NLUInstance.analyze(analyzeParams).then(
        analysisResults=>{
            return res.send(analysisResults['emotion']['document']['emotion']);
        }
    ).catch(
        err=>{
            return res.send(err);
        }
    );
    //return res.send({"happy":"10","sad":"90"});
});

app.get("/text/sentiment", (req,res) => {
   let analyzeParams = {
       'text' : req.params.text,
       'features':{
           'sentiment':{}
       }
   }
   let NLUInstance = getNLUInstance();
   NLUInstance.analyze(analyzeParams).then(
       analysisResults=>{
           return res.send(analysisResults['sentiment']['document']);
       }
   ).catch(
       err=>{
           return res.send(err);
       }
   ); 
   
   
   
    // return res.send("text sentiment for "+req.query.text);
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

