import React, { useContext } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input,Col,Row, Label, Form, FormGroup } from 'reactstrap';
// used for making the prop types of this component
import { useState } from "react";
import { useEffect } from "react";
import { getData } from "../../methodes";
import { BusinessContext } from "views/BusinessContext";
import ReactSelect from "react-select";

function CreateUser({toggle,user,save,show,loading=false}) {

  const [form,setForm] = useState(user?.id?user:{});
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
      <ModalHeader toggle={toggle}>Nouvel utilisateur</ModalHeader>
      <ModalBody>
      <Row>
        <Col md="12">
            <FormGroup>
            <Label >Nom et Prenom</Label>
            <Input value={form?.name} onChange={e=>setForm({...form,name:e.target.value})}  placeholder="Nom et Prenom" />
            </FormGroup>
        </Col>
    
        </Row>
        <Row>
        <Col md="12">
           <FormGroup>
                <Label >Mot de passe</Label>
                <Input value={form?.password}  onChange={e=>setForm({...form,password:e.target.value,password_confirmation:e.target.value})}  placeholder="Mot de passe" type="text" />
            
            </FormGroup>
        </Col>
        </Row>
        <Row>
        <Col md="12">
            <FormGroup>
                <Label>Role</Label>
                <ReactSelect
                    isSearchable={true}
                    placeholder={form?.id?form?.role?.nom:"Choisir le role"}
                    onChange={e=>{setForm({...form,role_id:e?.value})}}
                    options={context?.roles}
                />
            
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

  export default CreateUser;