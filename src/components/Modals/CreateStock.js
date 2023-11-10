import React, { useContext } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input,Col,Row, Label, Form, FormGroup } from 'reactstrap';
import { useState } from "react";
import { useEffect } from "react";
import { BusinessContext } from "views/BusinessContext";
import ReactSelect from "react-select";

function CreateStock({toggle,stock,save,show,loading=false}) {

  const [form,setForm] = useState(stock?.id?stock:{});
  const [bailleur, setBailleur] = useState([]);
  const context = useContext(BusinessContext);



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
   
    <Modal size="lg" isOpen={show} toggle={toggle}>
      <ModalHeader toggle={toggle}>Nouveau stock</ModalHeader>
      <ModalBody>
      <FormGroup>
          <Label for="exampleEmail">Produit</Label>
            <ReactSelect
              isSearchable={true}
              placeholder={form?.id?form?.produit?.designation:"Choisir le produit"}
              onChange={e=>{setForm({...form,produit_id:e?.value})}}
              options={context?.produits}
          />
      
      </FormGroup>
      
      <FormGroup>
          <Label for="exampleEmail">Prix d'achat </Label>
          <Input  value={form?.pa}  onChange={e=>setForm({...form,pa:e.target.value})}  placeholder="Prix d'achat" type="number" />
      
      </FormGroup>
      <FormGroup>
          <Label for="exampleEmail">Limite</Label>
          <Input value={form?.limite}  onChange={e=>setForm({...form,limite:e.target.value})}  placeholder="Limite" type="number" />
      </FormGroup>
      <FormGroup>
          <Label for="exampleEmail">Quantité</Label>
          <Input value={form?.stock}  onChange={e=>setForm({...form,stock:e.target.value})}  placeholder="Quantité" type="number" />
      
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

  export default CreateStock;