import {useContext, useEffect, useState} from "react"
import "./Setting.css"
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Card,
  Button,
  CardTitle,
  CardText,
  Row,
  Col
} from "reactstrap";
import { Categorie } from "./Categorie";
import { Client } from "./Client";
import { BusinessContext } from "../BusinessContext";
import { Fournisseur } from "./Fournisseur";


export  const Setting = () => {
    const [activeTab, setActiveTab] = useState("1");
    const context = useContext(BusinessContext);

    const toggle = tab => {
      if (activeTab !== tab) setActiveTab(tab);
    };
  
   
  
    return (
      // <div className="n-produit">
      <>
      <div className="n-produit" style={{marginBottom:10,marginTop:80}}>
           <Nav tabs>
              <NavItem>
                <NavLink
                  className={activeTab === "1" ? "active" : ""}
                  onClick={() => {
                    toggle("1");
                  }}
                  style={{fontWeight:"bold"}}
                >
                  Catégories
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={activeTab === "2" ? "active" : ""}
                  onClick={() => {
                    toggle("2");
                  }}
                  style={{fontWeight:"bold"}}
                >
                  Clients
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={activeTab === "3" ? "active" : ""}
                  onClick={() => {
                    toggle("3");
                  }}
                  style={{fontWeight:"bold"}}
                >
                  Fournisseurs
                </NavLink>
              </NavItem>
            </Nav>
            </div>
            <TabContent activeTab={activeTab}>
              <TabPane tabId="1">
                <Row>
                  <Col sm="12">
                    <Categorie/>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId="2">
                <Row>
                  <Col sm="12">
                   <Client clients={context.clients}/>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId="3">
                <Row>
                  <Col sm="12">
                   <Fournisseur clients={context.fournisseurs}/>
                  </Col>
                </Row>
              </TabPane>
            </TabContent>
      
      </>
    );
  };