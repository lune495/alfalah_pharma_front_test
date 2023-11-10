import React, { useContext } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input,Col,Row, Label, Form, FormGroup } from 'reactstrap';
import { useState } from "react";
import { useEffect } from "react";
import { BusinessContext } from "views/BusinessContext";

function CreateFounisseur({toggle,fournisseur,save,show,loading=false}) {

  const [form,setForm] = useState(fournisseur?.id?fournisseur:{});


  useEffect(() => {
    const keyDownHandler = event => {
      console.log('User pressed: ', event.key);

      if (event.key === 'Enter') {
        event.preventDefault();
        document.getElementById("send").click()
        // onSubmit()
      }
    };

    document.addEventListener('keydown', keyDownHandler);

    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, []);

  return (
    <div>
   
    <Modal size="md" isOpen={show} toggle={toggle}>
      <ModalHeader toggle={toggle}>Nouveau fournisseur</ModalHeader>
      <ModalBody>
      <FormGroup>
                <Label for="exampleEmail">Nom & Prenom</Label>
                <Input value={form?.nom_complet} onChange={e=>setForm({...form,nom_complet:e.target.value})}  placeholder="Nom" type="text" />
            
        </FormGroup>
        <FormGroup>
                <Label for="exampleEmail">Téléphone</Label>
                <Input value={form?.telephone} onChange={e=>setForm({...form,telephone:e.target.value})}  placeholder="telephone" type="text" />
            
        </FormGroup>
        <FormGroup>
                <Label for="exampleEmail">Email</Label>
                <Input value={form?.email} onChange={e=>setForm({...form,email:e.target.value})}  placeholder="email" type="text" />
            
        </FormGroup>
        <FormGroup>
                <Label for="exampleEmail">Adresse</Label>
                <Input value={form?.adresse} onChange={e=>setForm({...form,adresse:e.target.value})}  placeholder="adresse" type="text" />
            
        </FormGroup>
           
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>Anuler</Button>{' '}
        {loading?
          <div className="spinner-border" role="status">
               <span className="sr-only">Chargement...</span>
          </div>:
          <Button id="send" color="primary" onClick={()=>save(form)}>Enregistrer</Button>
        }
      </ModalFooter>
    </Modal>
  </div>
  )

}

  export default CreateFounisseur;