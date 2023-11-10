import React, { useContext } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input,Col,Row, Label, Form, FormGroup } from 'reactstrap';
import { useState } from "react";
import { useEffect } from "react";
import { BusinessContext } from "views/BusinessContext";
import ReactSelect from "react-select";
import { alert, getApiUrl, getData, sendData, toastMsg } from "../../methodes";
import CreateCategorie from "./CreateCategorie";

function CreateProduit({toggle,produit,save,show,loading=false}) {

  const [form,setForm] = useState(produit?.id?produit:{image_url:"img"});
  const [form2, setForm2] = useState(new FormData());
  const context = useContext(BusinessContext);
  const [openAdd,setOpenAdd] = useState(false);
  const [loadingSave,setLoadingSave] = useState(false);
  const [famille, setFamille] = useState([]);
  const formData = new FormData();


    useEffect(() => {
      setFamille(context?.categories)
      if(form.image){
        setForm({ ...form, previewImage: getApiUrl() +"/images/"+form?.image})
        // form2?.append("image",produit?.image)
      }
      if(produit?.id){
        form2?.append("pa",produit?.pa)
        form2?.append("id",produit?.id)
        form2?.append("code",produit?.code)
        form2?.append("designation",produit?.designation)
        form2?.append("qte",produit?.qte)
        form2?.append("pv",produit?.pv)
        form2?.append("famille_id",produit?.famille_id)
        setForm2(form2)
       
        
      }
      
      }, []);
      
const addImage=() => {
      
}

const onSubmit = async (post) => {
  console.log("data send ",post)
  setLoadingSave(true);
  await sendData(
     "api/familles",
     post,
     )
    .then(async ({ data }) => {
      
       setFamille({label:data?.nom,value:data?.id,id:data?.id},[...famille])     
      context.addState(
        "categories",
         {label:data?.nom,value:data?.id,id:data?.id},
         post?.id?"update":"add"
      )
      setOpenAdd(false)
     
      toastMsg("Catégorie ajoute avec succès","success")

    })
    .catch(({ response }) => {
      
      toastMsg("Une erreur est survenue","error")
    });
    setLoadingSave(false);
}

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
   {openAdd?
        <CreateCategorie
          show={openAdd}
          toggle={()=>setOpenAdd(!openAdd)}
          save={(data)=>onSubmit(data)}
          loading={loadingSave}
          // categorie={}
        />:null
      }
    <Modal size="lg" isOpen={show} toggle={toggle}>
      <ModalHeader toggle={toggle}>Nouveau produit</ModalHeader>
      <ModalBody>
          <Row>
            <Col md="12">
              <FormGroup>
                <Label for="exampleEmail">Nom</Label>
                <Input value={form?.designation} onChange={e =>{form2?.append("designation", e.target.value);setForm2(form2);setForm({ ...form, designation: e.target.value })}} placeholder="Nom" />
              </FormGroup>
            </Col>
          </Row>
            <Row>
              <Col md="12">
                <FormGroup>
                    <Label for="exampleEmail">Prix d'achat </Label>
                    <Input value={form?.pa} onChange={e=>{form2?.append("pa", e.target.value);setForm2(form2);setForm({...form,pa:e.target.value})}}  placeholder="Prix d'achat" type="number" />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="12">
                <FormGroup>
                    <Label for="exampleEmail">Prix de vente </Label>
                    <Input value={form?.pv} onChange={e=>{form2?.append("pv", e.target.value);setForm2(form2);setForm({...form,pv:e.target.value})}}  placeholder="Prix de vente" type="number" />
                
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="10">
                <FormGroup>
                  <Label for="exampleEmail">Famille</Label>
                  <ReactSelect
                    isSearchable={true}
                    placeholder={form?.id ? form?.famille?.nom : "Choisir la famille"}
                    // value={selectedOption}
                    onChange={e => {form2?.append("famille_id", e.value);setForm2(form2); setForm({ ...form, famille_id: e?.value }) }}
                    options={context?.categories}
                  />

                </FormGroup>
              </Col>
              <Col md="2">
                <div style={{marginTop:20}}>
                  <div onClick={()=>setOpenAdd(true)}  className="fa fa-plus-circle" style={{cursor:"pointer",fontSize:28,marginTop:15}}></div>
                </div>
              </Col>
            </Row>
            <FormGroup>
                <Label for="exampleEmail">Quantité</Label>
                <Input value={form?.qte} onChange={e=>{form2?.append("qte", e.target.value);setForm2(form2);setForm({...form,qte:e.target.value})}}  placeholder="Quantité" type="number" />
            </FormGroup>
            <FormGroup>
              <Label for="exampleEmail">Limite</Label>
              <Input value={form?.limite} onChange={e => {form2?.append("limite", e.target.value);setForm2(form2);setForm({ ...form, limite: e.target.value })}} placeholder="Limite" type="number" />

            </FormGroup>
            <Row>
            <Col md="6">
              <FormGroup>
                <Label for="exampleEmail">Image</Label>
                <Input  onChange={e => {form2?.append("image", e.target.files[0]);setForm2(form2);setForm({ ...form, image: e.target.files[0],previewImage: URL.createObjectURL(e.target.files[0]) })}} placeholder="Image" type="file" accept="image/*" />
              </FormGroup>
            </Col>
            <Col md="6">
                {form?.previewImage && (
                  <div style={{width:150,height:150}}>
                    <img className="preview" src={form?.previewImage} alt="" />
                  </div>
               )}
            </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>Annuler</Button>{' '}
        {loading?
          <div className="spinner-border" role="status">
               <span className="sr-only">Chargement...</span>
          </div>:
          <Button id="send" color="primary" onClick={()=>save(form2)}>Enregistrer</Button>
        }
      </ModalFooter>
    </Modal>
  </div>
  )

}

  export default CreateProduit;