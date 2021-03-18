import React from "react";
import { Link } from "react-router-dom";

function mainPage(props) {
    return(
        <div className="container-fluid poppin">
        <div className="row align-items-center" style={{textAlign:"center",verticalAlign: "middle"}}>
            <div className="col-lg-12" style={{height:"0vh",verticalAlign: "middle",textAlign:"Center",padding:"0vh 5vw 0px 5vw"}}>
              <h1 style={{fontSize:45,fontWeight:700}}>Story Helper thing.</h1>
              <p>
                <b>STORY HELPER</b> does stuff.
              </p>
                <br/>
             
              <br/>
            </div>
        </div>
      </div>
    )
}

export default mainPage