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

function DetailAppro({toggle,total,detail,show}) {

  useEffect(() => {
    console.log("detail",detail)
    },[]);

  return (
    <div>
   
    <Modal className="my-modal" size="xl" isOpen={show} toggle={toggle}>
      <ModalHeader toggle={toggle}>Détail approvisionnement</ModalHeader>
      <ModalBody>
      <Row>
          <Col md="4">
            <Card className="card-chart">
            <CardHeader>
                <CardTitle tag="h5" style={{ fontSize: 14, paddingTop: 5, paddingBottom: 5, paddingRight: 20, paddingLeft: 20, borderRadius: 30, fontWeight: 900, backgroundColor: detail?.type_appro == "DEPOT" ? "#6f99ed" :"rgb(242 123 114)"}}>{detail?.type_appro}</CardTitle>
                {/* <p className="card-category">Pape Ousmane</p> */}
              </CardHeader>
            
              <CardBody>
                <strong>Date </strong><span style={{float:"right"}}>{detail?.date+" "+detail?.time}</span><br/><hr/>
                <strong>Fournisseur </strong><span style={{float:"right"}}>{detail?.fournisseur?.nom_complet}</span><br/><hr/>
                <strong>Vendeur </strong><span style={{float:"right"}}>{detail?.user_name}</span><br/><br/><hr/>
                <strong>Nombre de produit </strong><span style={{float:"right"}}>{detail?.qte_total_appro}</span><br/><hr/>
                <strong>Montant total </strong><span style={{float:"right"}}>{detail?.montant}</span><br/><hr/>
              </CardBody>
             
            </Card>
          </Col>
      
      <Col md="8">
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
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detail?.ligne_approvisionnements?.map((val,id)=>(
                      <tr>
                        <td>{val?.produit?.designation}</td>
                        <td>{val?.quantity_received}</td>
                        <td>{val?.quantity_received*val?.produit?.pa}</td>
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

  export default DetailAppro;