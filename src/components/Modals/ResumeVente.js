import { FormGroup, Input,Col, Row, Form, Label, Button } from "reactstrap";
import React, { useEffect } from 'react';

export default function ResumeVente ({data,total,handleNouveau,handleTerminer}) {
    
    return (
       
            <div className="n-produit" style={{marginTop:20}}>
                <h3 style={{textAlign:"center"}}>Résumé de la vente</h3>
               {data.details?.map((val,id)=>(
                <div>
                    <strong>Nom: </strong> <span>{val?.nom}</span> <br/>
                    <strong>Nombre: </strong> <span>{val?.quantite}</span><br/>
                    <strong>Prix unitaire: </strong> <span>{val?.prix_vente}</span><br/>
                    <hr/>
                </div>
               ))
              
                }   
               <div>
                    <strong>Montant total: </strong> <span>{total?.total}</span>
               </div>
               <FormGroup style={{ float:"right",marginTop:20,marginBottom:10, alignContent:"flex-end",alignItems:"center"}}>
                    <Button onClick={handleTerminer}  color="secondary" style={{marginRight:40,borderRadius:10}} >
                        Terminer
                    </Button>
                
                    <Button onClick={handleNouveau} color="primary" style={{borderRadius:10}} >
                      Autre vente
                    </Button>
                    
              </FormGroup>

            </div>
     )
}
