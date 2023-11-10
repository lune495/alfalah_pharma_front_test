import React, { useContext } from "react";
import { FormGroup,Table, Input,Col, Row, Form, Label, Button, Alert, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardBody } from "reactstrap";
import { alert, getApiUrl, getData, sendData, toastMsg } from "../../methodes";
import { useState } from "react";
import { format } from "date-fns";
import $ from "jquery";
import "./Vente.css"
import "./modal.css";
import ErrorMsg from "../../shared/ErrorMsg";
import { useEffect } from "react";
import { BusinessContext } from "views/BusinessContext";
import ReactSelect from "react-select";
import ResumeAppro from "./ResumeAppro";

function CreateAppro({toggle,open}) {

  const context = useContext(BusinessContext);
  const [loading,setLoading] = useState(false);
  const [desabled,setDesabled] = useState(true);
  const [loadingS,setLoadingS] = useState(false);
  const [created,setCreated] = useState(false);
  const [produitVente,setProduitVente] = useState([]);
  const [produit,setProduit] = useState(context?.produits);
  const [show,setShow] = useState(false);
  const [user,setUser] = useState(JSON.parse(localStorage.getItem("user_stock_data"))?.user);
  const [panier,setPanier] = useState({type_appro: "BOUTIQUE"});
  const [panierProduit,setPanierProduit] = useState([]);
  const [typeDepot,setTypeDepot] = useState({value:"BOUTIQUE"});
  const [client,setClient] = useState({});
  const [error,setError] = useState(false);
  const [number,setNumber] = useState("");
  const [totaux,setTotaux] = useState({montantencaisse:0,monnaie:0,total:0});
  const [venteId,setVenteId] = useState(0);
  const [idLine,setIdLine] = useState(-1);
  const [posted,setPosted] = useState({});

  const onSubmit = async () => {
      
    console.log("request",panier)
    setLoading(true);
    await sendData(
      "api/approvisionnements",
       panier,
       )
      .then(async ({ data }) => {
         console.log("response",data)
          setVenteId(data?.data?.approvisionnements[0]?.id)
          setPosted(data?.data?.approvisionnements[0])
          setTimeout(()=>document.getElementById("pdf").click(),500
         )
         let update=data?.data?.approvisionnements[0]
         update["user_name"]=user?.name
         context.addState(
          "liste_appro",
           update,
           "add"
         )
         setCreated(true)
         toastMsg("Approvisionnement effectuée avec succès","success")
        
        // alert(
        //     "Approvisionnement effectuée avec succès",
        //     "success"
        // );
      })
      .catch(({ response }) => {
        setLoading(false);
        let violations = null;
        toastMsg(
        "Une erreur est survenue",
        "error")
       
        // alert(
        //   "Une erreur est survenue",
        //   "danger"
        // );
      });

    setLoading(false);
  }

  const handleFiltre= async (designation)=>{
      if(typeDepot?.value=="BOUTIQUE"){
          setError(false)
          handleFiltreBoutique(designation)
      }else if(typeDepot?.value=="DEPOT"){
          setError(false)
          handleFiltreAppro(designation)
      }else{
          setError(true)
      }
  }

  const handleFiltreBoutique= async (designation)=>{
      setLoadingS(true)
      const data=[]
      
      if(designation){
          const { data } = await getData("graphql?query={produits(designation:\"" + designation +"\",visible_appro:0){"+
          "designation pv pa id qte famille{nom}"+
               "}}");
          setProduitVente(data.data?.produits)
          setLoadingS(false)
      }else{
          setLoadingS(true)
          setTimeout(()=>{setProduitVente(data);setLoadingS(false)},2000
          )
      }
      
      

  }

  const handleFiltreAppro= async (designation)=>{
      setLoadingS(true)
      const data=[]
      if(designation){
      const { data } = await getData("graphql?query={depots(search:\""+designation+"\"){"+
         "stock pa produit{designation pv pa id qte famille{nom}}"+
      "}}");
      setLoadingS(false)
      setProduitVente(data.data?.depots)
      }else{
          setLoadingS(true)
          setTimeout(()=>{setProduitVente(data);setLoadingS(false)},2000
          )
      }

  }


  const handleSearch=(e)=>{
          console.log("dtaa ok",e?.target?.value)
          handleFiltre(e?.target?.value)

  }


  const handleChoix=(val)=>{
     $("#recherche").val("")
      let paniers=panierProduit
      const prod=panierProduit.find((rs)=>rs.produit_id==val?.id)
      console.log("prod",parseInt(totaux?.total))
      if(!prod){

          if(typeDepot?.value=="BOUTIQUE"){
              totaux.total=parseInt(totaux.total)+parseInt(val.pa)
              setTotaux(totaux)
              
              paniers.unshift({produit_id:val.id,quantite:0,pa:val?.pa,pu:val.pa,pv:val.pv,total:val.pa,nom:val.designation})
             
          }else{
              totaux.total=parseInt(totaux.total)+parseInt(val.pa)
              setTotaux(totaux)
              
              paniers.unshift({produit_id:val?.produit?.id,quantite:0,pa:val?.pa,pu:val.pa,pv:val.pa,total:val.pa,nom:val?.produit?.designation})
             
          }
         
          setPanierProduit(paniers)
          $("#total").val(totaux.total)
          setProduitVente([])
           //actualise data de body
          // paniers.push({produit_id:val.id,quantite:1,pu:val.pv,pv:val.pv,total:val.pv,nom:val.designation})
           setPanier({...panier,
              details:paniers,
              type_appro: "BOUTIQUE",
             })
           CalculMonnaie()

          
      }else{
        toastMsg(
          "Ce produit existe deja dans le panier",
          "error")
          // alert(
          //     "Ce produit existe deja dans le panier",
          //     "danger"
          //   );
      }
     
  }

  const handleUpdatePanier=async(e,prod,index,n)=>{
        
       if(e?.target?.value){
          const paniers=panierProduit.find((val)=>val.produit_id==prod)
          if(paniers){
              totaux.total=totaux.total-paniers.total
              paniers.total=parseInt($("#qte-"+prod).val() || 0)*parseInt($("#pv-"+prod).val() || 0)
              paniers.pu=parseInt($("#pv-"+prod).val() || 0)
              paniers.quantite=parseInt($("#qte-"+prod).val() || 0)
              panierProduit[index]=paniers
              setPanierProduit(panierProduit)
              $("#"+prod).val(parseInt($("#qte-"+prod).val() || 0)*parseInt($("#pv-"+prod).val() || 0))
              console.log("dddh2",panierProduit)
              console.log("id",prod)
              totaux.total=totaux.total+parseInt($("#qte-"+prod).val() || 0)*parseInt($("#pv-"+prod).val() || 0)
              $("#total").val(totaux.total)
              setTotaux(totaux)
              
              setPanier({...panier,
                  details:panierProduit,
                  type_appro: "BOUTIQUE",

                 })
               //actualise data de body
               CalculMonnaie()
               console.log("pp",panier)
          }

       }else{
        const paniers=panierProduit.find((val)=>val.produit_id==prod)
        if(paniers){
            totaux.total=totaux.total-paniers.total
            paniers.total=0
            if(n==1){
              paniers.pu=""
            }else{
              paniers.quantite=""
            }
           
            panierProduit[index]=paniers
            setPanierProduit(panierProduit)
            $("#"+prod).val(0)
            console.log("id",prod)
            totaux.total=totaux.total+0
            $("#total").val(totaux.total)
            setTotaux(totaux)
            
            setPanier({...panier,
                details:panierProduit,
                type_appro: "BOUTIQUE",

               })
             //actualise data de body
             CalculMonnaie()
             console.log("pp",panier)
        }

       }

  }


  const handleRemovePanier=async(prod)=>{
      if(prod){
         const panier=panierProduit.filter((val)=>val.produit_id!==prod.produit_id)
             setPanierProduit(panier)
             $("#total").val(totaux.total-prod.total)
             totaux.total=totaux.total-prod.total
             
             setTotaux(totaux)

             //actualise data de body
             setPanier({...panier,
              details:panier,
              
             })
             CalculMonnaie()
         

      }

 }
 const handleNouvelVente=()=>{
     setClient({})
     setPanier({})
     setNumber(makeid(20))
     setProduitVente([])
     setPanierProduit([])
     setCreated(false)
     setTotaux({montantencaisse:0,monnaie:0,total:0})
     $("#monnaie").val(0)
     $("#total").val(0)
 }

  function makeid(length) {
      var result           = '';
      var characters       = '0123456789';
      var charactersLength = characters.length;
      for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
  charactersLength));
  }
  return result;
  }

 useEffect(() => {

  setNumber(makeid(20))
  // setProduitVente(context?.boutique?.slice(0,4))
  
}, []);
const CalculMonnaie=()=>{

      if(panierProduit.length){
          setDesabled(false)
      }else{
          setDesabled(true)
      }
     
 }

 const handleCheckDestination=(e)=>{
     let pan={} 
     setNumber(makeid(20))
     setProduitVente([])
     setPanierProduit([])
     
     setTotaux({montantencaisse:0,monnaie:0,total:0})
     $("#monnaie").val(0)
     $("#total").val(0)
    
     setTypeDepot(e);
     setPanier({...pan,
      type_appro:e?.value
     })
 }
  
const toggleHover=(data)=>{
  setIdLine(data?.id)
}
const toggleHoverOut=(data)=>{
  setIdLine(-1)
}

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
      <Modal className="my-modal" size="xl" isOpen={open} toggle={toggle}>
        <a id="pdf" style={{display:"none"}} href={getApiUrl()+"/approvisionnementpdf/"+venteId} target="_blank">pdf link</a>
        <ModalHeader toggle={()=>toggle("")}>Nouveau stock</ModalHeader>
        <ModalBody>
          <ErrorMsg hide={()=>setError(false)} show={error} errorMsg={"Veuillez choisir l'endroit de l'approvisionnement. "} />
          { !created?
            <>
            <Row>
              <Col  md={6}>
                <Card className="card-chart">
                  <CardBody>
                    <div style={{marginBottom:17}}>
                        <strong style={{marginBottom:17}}></strong> {typeDepot?.label?<span style={{fontSize:14,paddingTop:5,paddingBottom:5,paddingRight:20,paddingLeft:20,borderRadius:30,backgroundColor:"#6f99ed"}}>{typeDepot?.label}</span>:null}
                    </div>
                    <Row style={{paddingBottom:5}}>
                      <Col md={7}>
                          <strong >Fournisseur:</strong> <span>{client?.label}</span>
                      </Col>
                      <Col md={5}>
                          <strong >date: </strong><span>{format(new Date(), 'dd/MM/yyyy')}</span>
                      </Col>
                   </Row>
                  <Row style={{paddingBottom:15}}>
                    <Col md={7}>
                        <strong >Vendeur: </strong><span>{user?.name}</span>
                    </Col>
                    <Col md={5}>
                        <strong >N° facture: </strong> <span>{number}</span>
                    </Col>
                  </Row>
                  <Row style={{paddingBottom:15}}>
                    {/* <Col md={6}>
                      <FormGroup>
                        <ReactSelect
                            isSearchable={true}
                            placeholder={"Choisir l'endroit "}
                            onChange={(e)=>handleCheckDestination(e)}
                            options={[
                                {value:"BOUTIQUE",label:"Dans la boutique"},
                                {value:"DEPOT",label:"Dans le dépot"},
                            ]}
                        />
                    </FormGroup>
                </Col> */}
                <Col md={6}>
                    <FormGroup>
                        <ReactSelect
                            isSearchable={true}
                            placeholder={"Choisir le fournisseur "}
                            onChange={(e)=>{setClient(e);setPanier({...panier,
                                fournisseur_id:e?.value,
                               })}}
                            options={context.fournisseurs_select}
                        />
                    </FormGroup>
                </Col>
                </Row>
                <FormGroup>
                    <Input id="recherche" onChange={(e)=>handleSearch(e)}  placeholder="Rechercher produit" type="text" />
                </FormGroup>
                {
                loadingS?
                <div>
                  <div className="spinner-border" role="status">
                      <span className="sr-only">Chargement...</span>
                  </div>
                </div>:
              produitVente.length?
            <div className="n-produit" style={{marginBottom:10}}>
            <Table>
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Famille</th>
                    <th>Quantité</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {
                      produitVente.map((val,id)=>(
                          <tr  onMouseEnter={()=>toggleHover(val)} onMouseLeave={()=>toggleHoverOut(val)} onClick={()=>handleChoix(val)} key={id} style={{cursor:"pointer",marginTop:10,backgroundColor:idLine==val?.id?"#dbd8f0":"white"}}>
                          <td style={{width: "30%"}}>{typeDepot?.value=="BOUTIQUE"?val?.designation:val?.produit?.designation}</td>
                          <td style={{width: "25%"}}>{typeDepot?.value=="BOUTIQUE"?val?.famille?.nom:val?.produit?.famille?.nom}</td>       
                          <td style={{width: "25%"}}>{typeDepot?.value=="BOUTIQUE"?val?.qte:val?.stock}</td>
                           <td style={{width: "20%"}}>
                           <> <span className="fa fa-cart-plus" size="sm" style={{borderRadius:10,cursor:"pointer",color:"#dbb702",fontSize:25}} /></>
                           </td>
                       </tr>
                  ))
                  }
                </tbody>
              </Table>
              </div>:null
            }
          <div> 
          <Row>
              <Col md={12}  style={{marginTop:15}}>
                  <Label>Montant total a payer (FCFA)</Label>
                  <Input size="lg" style={{fontSize:30,backgroundColor:"#ab9b9a"}} id="total" disabled defaultValue={totaux.total} type="text" />
              </Col>
          </Row>
          <Row>
          <Col md={12}  style={{marginTop:15}}>
          <FormGroup style={{ marginTop:10, alignContent:"flex-end",alignItems:"center"}}>
            <Button onClick={()=>handleNouvelVente()} color="secondary" style={{marginRight:40,borderRadius:10}} >
                Annuler
            </Button>
              {
                !loading?
                  <Button id="send" disabled={desabled} onClick={()=>onSubmit()} color="success" style={{borderRadius:10}} >
                      Valider l'appro
                  </Button>:
                  <div className="spinner-border" role="status">
                  <span className="sr-only">Chargement...</span>
                  </div>
                }
            </FormGroup>
            </Col>
           </Row>
           </div>
           </CardBody>
          </Card>
                
            </Col>
            
            <Col  md={6}>
            {
                
              panierProduit?.length?
                <Card className="card-chart">
           
                <CardBody>
            
                <Table>
                    <thead>
                      <tr>
                        <th>Nom</th>
                        <th>Quantité</th>
                        <th>Prix Unitaire (fcfa)</th>
                        <th>Total (fcfa)</th>
                        <th></th>
                      </tr>
                      
                    </thead>
                    <tbody>
      
                      {
                          panierProduit.map((val,id)=>(
                            
                              <tr key={id} style={{marginTop:20}}>
                                <td>{val.nom}</td>
                                <td><Input id={"qte-"+val.produit_id} min={1} onChange={(e)=>handleUpdatePanier(e,val.produit_id,id,0)}  value={panierProduit[id]?.quantite} type="number" /></td>
                                <td><Input value={panierProduit[id]?.pu} id={"pv-"+val.produit_id} min={1} onChange={(e)=>handleUpdatePanier(e,val.produit_id,id,1)}   type="number" /></td>      
                                <td><Input id={""+val.produit_id}  disabled value={panierProduit[id]?.total} type="text" /></td>
                                <td>
                                  <><span onClick={()=>handleRemovePanier(val)} style={{float:"right",color:"red",fontSize:20,cursor:"pointer"}} className="fa fa-trash-alt" ></span></>
                                </td>
                           </tr>
                      ))
      
                        
                      }
                   
                      
                    </tbody>
                  </Table>
                  </CardBody>
             </Card>:
             <Card className="card-chart">
              <CardBody>
                <h4>Votre tableau est vide!!</h4>
              </CardBody>
            </Card>
                    }
            </Col>
        </Row>
       
        
          
            </>:<ResumeAppro
                handleTerminer={()=>toggle(posted)}
                handleNouveau={()=>handleNouvelVente()}
                data={panier}
                total={totaux}
              />
            }
      </ModalBody>
      <ModalFooter>
      
      </ModalFooter>
    </Modal>
  </div>
  )

}

  export default CreateAppro;