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

function DetailBon({toggle,detail,show}) {

  useEffect(() => {
    console.log("detail",detail)
    },[]);

  return (
    <div>
   
    <Modal className="my-modal" size="xl" isOpen={show} toggle={toggle}>
      <ModalHeader toggle={toggle}>Détail bon livraison</ModalHeader>
      <ModalBody>
      <Row>
     
      <Col md="12">
      <Card className="card-chart">
              <CardHeader>
                <CardTitle tag="h5">Listes des produits</CardTitle>
                {/* <p className="card-category">Pape Ousmane</p> */}
              </CardHeader>
              <CardBody>
              <Table responsive>
                  <thead className="text-primary">
                    <tr>
                      <th>Nom</th>
                      <th>Quantité</th>
                      <th>Quantité stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detail?.ligne_sortie_stocks?.map((val,id)=>(
                      <tr>
                        <td>{val?.produit?.designation}</td>
                        <td>{val?.quantite}</td>
                        <td>{val?.quantite_stock}</td>
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

  export default DetailBon;