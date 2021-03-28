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

                if(r.addedText==="consul "){
                    r.addedText = "thing "
                }
                setStoryText(old => old+r.addedText)   
            }
            // var dt = new Date();
            // while ((new Date()) - dt <= 500) {}
            getWords()
        }
        // else{
        //     const spellingGrammar = async () => {
        //         let body = {
        //             inputText:storyText
        //         }

        //         let requestOptions = {
        //             method: 'POST',
        //             headers: { 'Content-Type': 'application/json' },
        //             body: JSON.stringify(body)
        //         }

        //         console.log(requestOptions)
        //         var i = await fetch('http://localhost:5000/grammar', requestOptions)
        //         var r = await i.json()
        //         setStoryText(old => r.newText)   
        //     }

        //     spellingGrammar()
        // }
    }, [storyText,paused]);

    const spellingGrammar = async () => {
        let body = {
            inputText:storyText
        }

        let requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        }

        console.log(requestOptions)
        var i = await fetch('http://localhost:5000/grammar', requestOptions)
        var r = await i.json()
        setStoryText(old => r.newText)   
    }

    const toggleGeneration = async () => {
        if(!paused){
            spellingGrammar()
        }
        setPause(!paused)
    }

    return(
        <div className="container-fluid poppin">
        <div className="row align-items-center" style={{textAlign:"center",verticalAlign: "middle"}}>
            <div className="col-lg-12" style={{height:"0vh",verticalAlign: "middle",textAlign:"Center",padding:"0vh 5vw 0px 5vw"}}>
              <h1 style={{fontSize:45,fontWeight:700}}>Story Buddy.</h1>
              <p
                style = {{width:500, margin:"auto"}}
              >
                <b>STORY BUDDY</b> is a proof of concept/prototype, AI writing assistant, to help provide direction and overcome writing blocks.
                The dataset is comprised of 153 short stories, scraped from
                <a href="http://www.classicshorts.com/bib.html"> Classic Shorts</a>. It contains 3422389 characters and 611454 words,
                which ultimately amounts to 855649 training examples for the neural network. 
              </p>
              <br/>
                <button type="button" className="btn btn-success" onClick={toggleGeneration}>
                    {paused ? "Generate Text" : "Pause Generation"}
                </button>
                {/* <button type="button" className="btn btn-success" onClick={spellingGrammar} disabled={!paused ? "disabled" : ""}>
                    Grammar Check
                </button> */}
                <br />
                <br />
                <div className="form-group" style={{height:"40vh", width:"60vw", margin: "auto"}}>
                    <textarea
                        value={storyText}
                        onChange={(e)=>{setStoryText(e.target.value)}}
                        disabled={!paused ? "disabled" : ""}
                        className="form-control"
                        id="exampleFormControlTextarea1"
                        style={{minHeight:"40vh", fontSize: 28, marginBottom: 100}}
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