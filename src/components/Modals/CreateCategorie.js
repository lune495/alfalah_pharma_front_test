import React, { useContext } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input,Col,Row, Label, Form, FormGroup } from 'reactstrap';
import { useState } from "react";
import { useEffect } from "react";
import { BusinessContext } from "views/BusinessContext";

function CreateCategorie({toggle,categorie,save,show,loading=false}) {

  const [form,setForm] = useState(categorie?.id?categorie:{});
  const [bailleur, setBailleur] = useState([]);
  const context = useContext(BusinessContext);


  useEffect(() => {
    const keyDownHandler = event => {
    
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
      <ModalHeader toggle={toggle}>Nouvelle famille</ModalHeader>
      <ModalBody>
           <Row>
            <Col md="12">
              <FormGroup>
                <Label for="exampleEmail">Nom</Label>
                <Input value={form?.nom} onChange={e=>setForm({...form,nom:e.target.value})}  placeholder="Nom" type="text" />
            
              </FormGroup>
            </Col>
            </Row>
           
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

  export default CreateCategorie;