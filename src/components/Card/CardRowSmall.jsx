import React from "react";
import { Col, Row } from "reactstrap";

import "./Card.css";

export default function CardRowSmall({price,title }) {
    return (
        // <div className="card-sm">
            <Row className="card-sm">
                <Col md="6">
                <span style={{fontSize:17,alignSelf:"flex-end"}}>{title}</span>
                </Col>
                {/* <Col md="2">

                </Col> */}
                <Col md="6">
                <strong   style={{fontSize:14,paddingRight:20,paddingLeft:20,borderRadius:30,backgroundColor:"#6f99ed"}}>{price}</strong>
                </Col>
            </Row>
            
            
            

        // </div>
    )
}
