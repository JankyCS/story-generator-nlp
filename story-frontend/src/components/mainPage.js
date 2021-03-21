import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

function MainPage(props) {
    const [storyText, setStoryText] = useState("");
    const [paused, setPause] = useState(true);
    
    useEffect(() => {
        if(!paused){
            const getWords = async () => {
                let body = {
                    inputText:storyText,
                    numWords:1
                }

                let requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                }

                console.log(requestOptions)
                var i = await fetch('http://localhost:5000/predict', requestOptions)
                var r = await i.json()
                setStoryText(old => old+r.addedText)   
            }
            var dt = new Date();
            while ((new Date()) - dt <= 500) {}
            getWords()
        }
    }, [storyText,paused]);

    const spellingGrammar = async () => {
        const body = {
            text:storyText,
            language: "en-US"
        }

        const requestOptions = {
            method: 'POST',
            headers: { "content-type": "application/x-www-form-urlencoded",
	                    "x-rapidapi-key": "",
	                    "x-rapidapi-host": "grammarbot.p.rapidapi.com"
                    },
            body: {
                "text":"she go to the store.",
                "language": "en-US"
            }
            
            
        }

        console.log(requestOptions)

        fetch("https://grammarbot.p.rapidapi.com/check", {
            "method": "POST",
            "headers": {
                "content-type": "application/x-www-form-urlencoded",
                "x-rapidapi-key": "",
                "x-rapidapi-host": "grammarbot.p.rapidapi.com"
            },
            "body": {
                "text": "Susan go to the store everyday",
                "language": "en-US"
            }
        })
        .then(response => {
            console.log(response);
        })
        .catch(err => {
            console.error(err);
        });

        // var i = await fetch('https://grammarbot.p.rapidapi.com/check', requestOptions)
        // var r = await i.json()

        // console.log(r)
        // let matches = r.matches
        // let newText =''
        // let text = storyText
        // let cursor = 0

        // for(let i = 0;i<matches.length;i++){
        //     let m = matches[i]
        //     let offset = m.offset
        //     let length = m.length
        //     if(cursor>offset){
        //         continue
        //     }
        //     newText += text.subString(cursor,offset)
        //     let repls = m.replacements
        //     if(repls && repls.length>0){
        //         newText += repls[0].value
        //     }
        //     cursor = offset + length
        // }

        // if(cursor < text.length){
        //     newText += text.subString(cursor)
        // }

        // setStoryText(newText)
    }

    const toggleGeneration = async () => {
        setPause(!paused)
    }

    return(
        <div className="container-fluid poppin">
        <div className="row align-items-center" style={{textAlign:"center",verticalAlign: "middle"}}>
            <div className="col-lg-12" style={{height:"0vh",verticalAlign: "middle",textAlign:"Center",padding:"0vh 5vw 0px 5vw"}}>
              <h1 style={{fontSize:45,fontWeight:700}}>Story Helper thing.</h1>
              <p>
                <b>STORY HELPER</b> does stuff.
              </p>
                <button type="button" className="btn btn-success" onClick={toggleGeneration}>
                    GENERATE TEXT
                </button>
                <button type="button" className="btn btn-success" onClick={spellingGrammar}>
                    Grammar
                </button>
                <br />
                <br />
                <div className="form-group" style={{height:"40vh", width:"60vw", margin: "auto"}}>
                    <textarea
                        value={storyText}
                        onChange={(e)=>{setStoryText(e.target.value)}}
                        disabled={!paused ? "disabled" : ""}
                        className="form-control"
                        id="exampleFormControlTextarea1"
                        style={{height:"40vh", fontSize: 28}}
                    >
                    </textarea>
                </div>
              <br/>
            </div>
        </div>
      </div>
    )
}

export default MainPage