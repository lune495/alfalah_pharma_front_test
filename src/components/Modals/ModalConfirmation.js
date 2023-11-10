import React, { useContext } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input,Col,Row, Label, Form, FormGroup } from 'reactstrap';
import { useState } from "react";
import { useEffect } from "react";
import { BusinessContext } from "views/BusinessContext";

function ModalConfirmation({toggle,annuler="Annuler",bouton="Supprimer",title="Confirmation suppression",text="Voulez-vous vraiment supprimer l'élément?",save,show,loading=false}) {




    useEffect(() => {
      
      }, []);

  return (
    <div>
   
    <Modal size="md" isOpen={show} toggle={toggle}>
      <ModalHeader toggle={toggle}>{title}</ModalHeader>
      <ModalBody>
          <span>{text}</span>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>{annuler}</Button>{' '}
        {loading?
          <div className="spinner-border" role="status">
               <span className="sr-only">Chargement...</span>
          </div>:
          <Button color="danger" onClick={()=>save()}>{bouton}</Button>
        }
      </ModalFooter>
    </Modal>
  </div>
  )

}

  export default ModalConfirmation;