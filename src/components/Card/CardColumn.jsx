import React from "react";

import "./Card.css";

export default function CardColumn({price,title }) {
    return (
        <div style={{alignItems:"center",textAlign:"center"}}>
        <div className="card-cl">
           <div><span>{title}</span></div> 
           <div><strong className="font-weight-bold" style={{fontSize:20,color:"black"}}>{price}</strong></div> 
        </div>
        </div>
    )
}
