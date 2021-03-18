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
                        // mode: 'no-cors',
                        body: JSON.stringify(body)
                    }

                    // body.inputText = storyText
                    // requestOptions.body = JSON.stringify(body)
                    

                    console.log(requestOptions)
                    var i = await fetch('http://localhost:5000/predict', requestOptions)
                    var r = await i.json()
                    setStoryText(old => old+r.addedText)   
            }
            getWords()
        }
    }, [storyText,paused]);

    const getWords = async () => {
        let body = {
            inputText:storyText,
            numWords:1
        }

        let requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // mode: 'no-cors',
                body: JSON.stringify(body)
            }

            // body.inputText = storyText
            // requestOptions.body = JSON.stringify(body)
            

            console.log(requestOptions)
            var i = await fetch('http://localhost:5000/predict', requestOptions)
            var r = await i.json()
            setStoryText(old => old+r.addedText)
                
    }

    const toggleGeneration = async () => {
        setPause(!paused)

        if(!paused){
            console.log(storyText)
            getWords()
        }
        
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
                <br />
                <br />
                <div className="form-group" style={{height:"40vh", width:"60vw", margin: "auto"}}>
                    {/* <label for="exampleFormControlTextarea1">Example textarea</label> */}
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