import React, { useContext } from "react";
import { FormGroup,Table, Input,Col, Row, Form, Label, Button, Alert, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardBody, CustomInput } from "reactstrap";
import { Link } from "react-router-dom";
import { alert, getApiUrl, getData, sendData, toastMsg } from "../../methodes";
import { useState } from "react";
import { format } from "date-fns";
import $ from "jquery";
import ErrorMsg from "../../shared/ErrorMsg";
import "./Vente.css"
import "./modal.css";
import { useEffect } from "react";
import { BusinessContext } from "views/BusinessContext";
import ReactSelect from "react-select";
import ResumeVente from "./ResumeVente";
import CreateClient from "./CreateClient";

function CreateInventaire({toggle,forma,open}) {

    const context = useContext(BusinessContext);
    const [loading,setLoading] = useState(false);
    const [desabled,setDesabled] = useState(true);
    const [loadingS,setLoadingS] = useState(false);
    const [created,setCreated] = useState(false);
    const [produitVente,setProduitVente] = useState([]);
    const [form,setForm] = useState({});
    const [clients,setClients] = useState([]);
    const [init,setInit] = useState({quantite:1,remise:0});
    const [ttc,setTtc] = useState(0);
    const [user,setUser] = useState(JSON.parse(localStorage.getItem("user_stock_data"))?.user);
    const [panier,setPanier] = useState({});
    const [panierProduit,setPanierProduit] = useState([]);
    const [error,setError] = useState(false);
    const [client,setClient] = useState({label:"Cient passager"});
    const [number,setNumber] = useState("");
    const [tva,setTva] = useState(false);
    const [remise,setRemise] = useState(false);
    const [cl,setCl] = useState(true);
    const [idLine,setIdLine] = useState(-1);
    const [totaux,setTotaux] = useState({montantencaisse:0,monnaie:0,total:0});
    const [venteId,setVenteId] = useState(0);
    const [openAddCl,setOpenAddCl] = useState(false);
    const [loadingClSave,setLoadingClSave] = useState(false);
    
    const onSubmit = async () => {
      
      console.log("request",panier)
      setLoading(true);
      await sendData(
        "api/inventaire",
         panier,
         )
        .then(async ({ data }) => {
           console.log("response inven",data)
            setVenteId(data?.data?.inventaires[0]?.id)
          //   setTimeout(()=>{document.getElementById("pdf2").click();toggle("refresh")},50
          //  )
            toggle(data?.data?.inventaires[0])
            toastMsg("Inventaire crée avec succès","success")
         
        })
        
        .catch(({ response }) => {
          setLoading(false);
          console.log("error",response)
          
          toastMsg(response?.data?.message?response?.data?.message:"une erreur est survenue","error")

        });
  
      setLoading(false);
    }

    const onSubmitCl = async (post) => {

      setLoadingClSave(true);
      await sendData(
         "api/clients",
         post,
         )
        .then(async ({ data }) => {
          console.log("client",data)

          setClients([...clients,{label:data?.nom_complet,value:parseInt(data?.id),id:data?.id}])
         
          setOpenAddCl(false)
          toastMsg("Client effectuée avec succès","success")
         
          // alert(
          //  "Client ajouté avec succès",
          //   "success"
          // );
        })
        .catch(({ response }) => {
          setLoadingClSave(false);
          // alert(
          //  "Une erreur est survenue",
          //   "danger"
          // );
          toastMsg("une erreur est survenue","error")
         
        });
  
        setLoadingClSave(false);
    }

    const handleFiltre= async (designation)=>{
        setLoadingS(true)
        const { data } = await getData("graphql?query={produits(search:\""+designation+"\"){"+
           "designation pv id qte famille{nom}"+
        "}}");
        // let data=produit.filter((val) => JSON.stringify(val).toLowerCase().indexOf(designation.toLowerCase()) ! == -1)
        // setProduitVente(data)
        setProduitVente(data.data?.produits)
        setLoadingS(false)

    }

    const handleSearch=(e)=>{
        if(e?.target?.value){
            handleFiltre(e?.target?.value)
        }else{
            setTimeout(()=>setProduitVente([]),2000
            )
        }

    }
    const CalculMonnaieUpdate=(details)=>{
      setPanier({...panier,
          details:details,
         
      })
    
 }


  

    const handleChoix=(val)=>{
        $("#recherche").val("")
        const prod=panierProduit.find((rs)=>rs.produit_id==val?.id)
        if(!prod){
          
            setPanierProduit([{produit_id:val.id,quantite_reel:0,qte:val?.qte,nom:val?.designation},...panierProduit])
            setProduitVente([])
            setDesabled(false)
            
        }else{
            alert(
                "Ce produit existe deja dans le panier",
                "danger"
              );
        }
       
    }

    const handleUpdatePanier=async(e,prod,index)=>{
      const paniers=panierProduit.find((val)=>val.produit_id==prod)
         if(e?.target?.value){
            if(paniers){
                paniers.quantite_reel=parseInt(e?.target?.value)
                panierProduit[index]=paniers
                CalculMonnaieUpdate(panierProduit)
                setPanierProduit(panierProduit)
          
            }
        }else{
            paniers.quantite_reel=""
            panierProduit[index]=paniers
            CalculMonnaieUpdate(panierProduit)
            setPanierProduit(panierProduit)
       }

 }

  
    const handleRemovePanier=async(prod)=>{
        if(prod){
           const panier=panierProduit.filter((val)=>val.produit_id!==prod.produit_id)
               setPanierProduit(panier)
              //  totaux.total=totaux.total-prod.total
               if(panier.length){
                setDesabled(false)
              }else{
                setDesabled(true)
               }
             
        }

   }
   const handleNouvelVente=()=>{
       setClient({label:"Cient passager"})
       setPanier({})
       setDesabled(true)
       setTva(false)
       setRemise(false)
       setCl(true)
       setNumber(makeid(18))
       setPanierProduit([])
       setCreated(false)
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
    setProduitVente(context?.boutique?.slice(0,4))
    setNumber(makeid(18))
  }, []);

  useEffect(() => {
    const data=[]
    let tot=0
    if(forma?.id){
      setDesabled(false)
      setClient({...client,label:forma?.client?.nom_complet})
    }
    
  
  }, []);

  const handleClientP=(e)=>{
    setCl(!cl)
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

  const handleTva=(e)=>{
    setTva(!tva)
   if(tva==false){
    setPanier({...panier,tva:0})
   }else{
    delete panier.tva
   }
   console.log("data send",panier)
  }
  const toggleHover=(data)=>{
    setIdLine(data?.id)
  }
  const toggleHoverOut=(data)=>{
    setIdLine(-1)
  }

  return (
    <div>
   
    <Modal style={{ width: '100%'}} className="my-modal" size="xl" isOpen={open} toggle={toggle}>
      <a id="pdf2" style={{display:"none"}} href={getApiUrl()+"/proforma/generate-pdf/"+venteId} target="_blank">pdf link</a>
        <ModalHeader toggle={() => toggle("")}>Nouvel inventaire</ModalHeader>
      <ModalBody>
        <ErrorMsg hide={()=>setError(false)} show={error} errorMsg={"Veuillez choisir l'endroit de l'approvisionnement. "} />
       
      
      { !created?
        <>
        <Row>
          <Col  lg={5}  md={12}>
            <Card className="card-chart">
              <CardBody>
                <Row style={{paddingBottom:5}}>
                    <Col md={7}>
                        <strong >Crée par: </strong> <span>{user?.name}</span>
                    </Col>
                    <Col md={5}>
                        <strong >Date: </strong><span>{format(new Date(), 'dd/MM/yyyy')}</span>
                    </Col>
                </Row>
               <hr/>
                <Row>
                  <Col md="9">
                    <FormGroup>
                      <Input id="recherche" onChange={(e)=>handleSearch(e)}  placeholder="Rechercher produit" type="text" />
                    </FormGroup>
                  </Col>
                  <Col md="2">
                     <span style={{marginLeft:-60,color:"grey",marginTop:10,fontSize:25}} className="fa fa-search" />
                  </Col>
                </Row>
              {
              loadingS?
              <div>
                <div className="spinner-border" role="status">
                    <span className="sr-only">Chargement...</span>
                </div>
            </div>:
            produitVente?.length?
            <div className="n-vente" style={{marginBottom:10}}>
            <Table>
                <thead>
                    <tr style={{ textAlign: 'center' }}>
                    <th>Nom</th>
                    <th>Famille</th>
                    <th>Quantité</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {
                      produitVente?.map((val,id)=>(
                        <tr onMouseEnter={() => toggleHover(val)} onMouseLeave={() => toggleHoverOut(val)} onClick={() => handleChoix(val)} key={id} style={{textAlign:'center',cursor:"pointer",marginTop:10,backgroundColor:idLine==val?.id?"#dbd8f0":"white"}}>
                          <td>{val.designation}</td>
                          <td>{val.famille?.nom}</td>       
                          <td>{val.qte}</td>
                           <td>
                           <> <span  className="fa fa-cart-plus" size="sm" style={{borderRadius:10,cursor:"pointer",color:"#dbb702",fontSize:25}} /></>
                           </td>
                       </tr>
                  ))
                  }
                </tbody>
              </Table>
              </div>:null
             }
            <div>
               <Row style={{marginTop:15}}>
                  <Col md={12} >
                    <FormGroup style={{ float:"right",marginTop:10, alignContent:"flex-end",alignItems:"center"}}>
                        <Button onClick={()=>handleNouvelVente()} color="secondary" style={{marginRight:40,borderRadius:10}} >
                          Annuler
                        </Button>
                         {
                          !loading?
                            <Button id="send" disabled={desabled}  onClick={()=>onSubmit()} color="success" style={{borderRadius:10}} >
                              Valider
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
            <Col lg={7}  md={12}>
            {
              panierProduit?.length?
              <Card className="card-chart">
              <CardBody>
                <Table>
                    <thead>
                      <tr>
                        <th>Nom</th>
                        <th>Qté Téorique</th>
                        <th>Qté réèlle</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                          panierProduit.map((val,id)=>(
                            
                              <tr key={id} style={{marginTop:20}}>
                                <td style={{width: "30%"}}>{val.nom}</td>
                                <td style={{width: "30%"}}><Input style={{backgroundColor:"#dbd8f0"}} id={"qte-"+val.produit_id}  desabled  value={panierProduit[id]?.qte} type="text" /></td>
                                <td style={{width: "30%"}}><Input id={"qter-"+val.produit_id}  onChange={(e)=>handleUpdatePanier(e,val.produit_id,id)}  value={panierProduit[id]?.quantite_reel} type="number" /></td>
                                <td style={{width: "10%"}}>
                                <><span onClick={()=>handleRemovePanier(val)} style={{float:"right",color:"red",fontSize:20,cursor:"pointer"}} className="fa fa-trash-alt" ></span></>
                                </td>
                           </tr>
                        ))
                      }
                    </tbody>
                  </Table>
                </CardBody>
             </Card>
                :<Card className="card-chart">
                <CardBody>
                  <h4>Votre tableau est vide !!!</h4>
                </CardBody>
             </Card>
             }
          </Col>
        </Row>
            </>
            :<ResumeVente
                handleTerminer={()=>toggle("refresh")}
                handleNouveau={()=>handleNouvelVente()}
                data={panier}
                total={totaux}
              />
            }
      </ModalBody>
    </Modal>
  </div>
  )
}
  export default CreateInventaire;