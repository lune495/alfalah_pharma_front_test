import React from "react";
import { Button, Modal,
   ModalHeader, ModalBody,
    ModalFooter, Table,Col,
    Row, 
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    CardTitle,
   } from 'reactstrap';
// used for making the prop types of this component
import "./modal.css";
import { useState } from "react";
import { useEffect } from "react";

function DetailInventaire({toggle,detail,show}) {

  useEffect(() => {
    console.log("detail",detail)
    },[]);

  return (
    <div>
   
    <Modal className="my-modal" size="xl" isOpen={show} toggle={toggle}>
      <ModalHeader toggle={toggle}>Détail de l'inventaire</ModalHeader>
      <ModalBody>
      <Row>
       
      <Col md="12" lg="12">
      <Card className="card-chart">
              <CardHeader>
                <CardTitle tag="h5">Listes des produits de l'inventaire</CardTitle>
                {/* <p className="card-category">Pape Ousmane</p> */}
              </CardHeader>
              <CardBody>
              <Table responsive>
                  <thead className="text-primary">
                    <tr>
                      <th>Nom</th>
                      <th>Quantité réèlle</th>
                      <th>Quantité théorique</th>
                    </tr>
                  </thead>
                  <tbody>
                   
                    {detail?.ligne_inventaires?.map((val,id)=>(
                      <tr>
                        <td>{val?.produit?.designation}</td>
                        <td>{val?.quantite_reel}</td>
                        <td>{val?.quantite_theorique}</td>
                      </tr>
                    ))
                    
                    }
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
      </Row>
     
          
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>Fermer</Button>{' '}
    
      </ModalFooter>
    </Modal>
  </div>
  )

}

  export default DetailInventaire;