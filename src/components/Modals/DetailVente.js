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

function DetailVente({toggle,detail,prof,show,type="VENTE"}) {

  useEffect(() => {
    console.log("detail",detail)
    },[]);

  return (
    <div>
   
    <Modal className="my-modal" size="xl" isOpen={show} toggle={toggle}>
      <ModalHeader toggle={toggle}>{prof?"Détail du devis":type=="BON"?"Détail du bon de retour":"Détail de la vente"}</ModalHeader>
      <ModalBody>
      <Row>
          <Col md="4">
            <Card className="card-chart">
           
              {type!=="BON"?<CardBody>
                <strong>Date </strong><span style={{float:"right"}}>{detail?.date+" "+detail?.time}</span><br/><hr/>
                <strong>Vendeur </strong><span style={{float:"right"}}>{detail?.user_name}</span><br/><hr/>
                <strong>Nombre de produit </strong><span style={{float:"right"}}>{detail?.qte}</span><br/><hr/>
                <strong>Montant ht </strong><span style={{float:"right"}}>{detail?.montant_ht}</span><br/><hr/>
                <strong>Remise total (%) </strong><span style={{float:"right"}}>{detail?.remise_total}</span><br/><hr/>
                <strong>Montant avec remise </strong><span style={{float:"right"}}>{detail?.montant_avec_remise}</span><br/><hr/>
                <strong>Montant ttc </strong><span style={{float:"right"}}>{detail?.montant_ttc}</span><br/><hr/>
              </CardBody>:
              <CardBody>
                <strong>Date </strong><span style={{float:"right"}}>{detail?.created_at_fr}</span><br/><hr/>
                <strong>Vendeur </strong><span style={{float:"right"}}>{detail?.user?.name}</span><br/><hr/>
              </CardBody>
                }
            </Card>
          </Col>
      
      <Col md="8">
      <Card className="card-chart">
              <CardHeader>
                <CardTitle tag="h5">Listes des produits</CardTitle>
                {/* <p className="card-category">Pape Ousmane</p> */}
              </CardHeader>
              <CardBody>
              {type!=="BON"?<Table responsive>
                  <thead className="text-primary">
                    <tr>
                      <th>Nom</th>
                      <th>Quantité</th>
                      <th>Rémise(%)</th>
                      <th>Montant remise</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!prof?
                    <>
                    {detail?.vente_produits?.map((val,id)=>(
                      <tr>
                        <td>{val?.produit?.designation}</td>
                        <td>{val?.qte}</td>
                        <td>{val?.remise}</td>
                        <td>{val?.montant_remise}</td>
                        <td>{val?.total}</td>
                      </tr>
                    ))
                    
                    }</>:
                    <>
                    {detail?.proforma_produits?.map((val,id)=>(
                      <tr>
                        <td>{val?.produit?.designation}</td>
                        <td>{val?.qte}</td>
                        <td>{val?.remise}</td>
                        <td>{val?.montant_remise}</td>
                        <td>{val?.total}</td>
                      </tr>
                      ))
                    }</>}
                  </tbody>
                </Table>:
                <Table responsive>
                <thead className="text-primary">
                  <tr>
                    <th>Nom</th>
                    <th>Quantité</th>
                    
                  </tr>
                </thead>
                <tbody>
                {detail?.ligne_bon_retours?.map((val,id)=>(
                      <tr key={id}>
                        <td>{val?.produit?.designation}</td>
                        <td>{val?.quantite_retour}</td>
                      </tr>))
                  }
                </tbody>
                </Table>
              }
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

  export default DetailVente;