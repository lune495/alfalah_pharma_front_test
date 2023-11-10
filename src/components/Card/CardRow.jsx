import React from "react";
import { Col, Row } from "reactstrap";

import "./Card.css";

export default function CardRow({price,title }) {
    return (
        <div style={{margin:10,alignItems:"center",textAlign:"center"}}>
        <Row className="card-bd">
            <Col md="7">
             <strong  className="font-weight-bold" style={{float:"left",marginRight:20}}>{price}</strong>
            </Col>
            <Col md="5">
                <span>{title}</span>
            </Col>
        </Row>
        </div>
    )
}
