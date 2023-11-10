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

function CreateProformat({toggle,forma,open}) {

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
    const [posted,setPosted] = useState({});
    const [loadingClSave,setLoadingClSave] = useState(false);
    
    const onSubmit = async () => {
      
      console.log("request",panier)
      setLoading(true);
      await sendData(
        "api/proformas",
         panier,
         )
        .then(async ({ data }) => {
           console.log("response",data)
            setVenteId(data?.data?.proformas[0]?.id)
            setPosted(data?.data?.proformas[0])
            setTimeout(()=>{document.getElementById("pdf2").click();toggle("refresh")},50
           )
           toastMsg("Proforma effectuée avec succès","success")
          // alert(
          //     "Vente effectuée avec succès",
          //     "success"
          // );
        })
        
        .catch(({ response }) => {
          setLoading(false);
          console.log("error",response)
          // alert(
          //   response?.data?.message?response?.data?.message:"une erreur est survenue",
          //   "danger"
          // );
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
          montantencaisse:5000,
          monnaie:0,
          client_id:forma?.client?.id,
          id:forma?.id,
          user_id:user?.id,
      })
    
 }
   const CalculMonnaie=(details)=>{
        setPanier({...panier,
            details:details,
            montantencaisse:5000,
            monnaie:0,
            user_id:user?.id,
        })
      
   }

   const CalculTaxe=(montant)=>{
   const mttc=montant+(montant*0.18)
   setTtc(mttc)
  }

    const handleChoix=(val)=>{
        $("#recherche").val("")
        const prod=panierProduit.find((rs)=>rs.produit_id==val?.id)
        if(!prod){
          
            totaux.total=parseInt(totaux.total)+parseInt(val.pv)
            setTotaux(totaux)
            setPanierProduit([{produit_id:val.id,remise:0,rm:0,qte:1,quantite:1,prix_vente:val.pv,pv:val.pv,total:val.pv,nom:val.designation},...panierProduit])
            setProduitVente([])
            setDesabled(false)
            setTimeout(()=>{CalculMonnaie([{produit_id:val.id,remise:0,rm:0,qte:1,quantite:1,prix_vente:val.pv,pv:val.pv,total:val.pv,nom:val.designation},...panierProduit])},50
            )
            
            $("#total").val(totaux.total)
            CalculTaxe(totaux.total)
        }else{
            alert(
                "Ce produit existe deja dans le panier",
                "danger"
              );
        }
       
    }

    const handleUpdatePanier=async(e,prod,index,nombre)=>{
       
         if(e?.target?.value){
            const paniers=panierProduit.find((val)=>val.produit_id==prod)
            if(paniers){
                totaux.total=totaux.total-paniers.total
                const mont=parseInt($("#qte-"+prod).val())*parseInt($("#pv-"+prod).val())
                const mt=mont-(mont*paniers?.remise/100)
                paniers.total=mt
                paniers.prix_vente=parseInt($("#pv-"+prod).val())
                paniers.quantite=parseInt($("#qte-"+prod).val())
                paniers.qte=parseInt($("#qte-"+prod).val())
                panierProduit[index]=paniers
                $("#"+prod).val(parseInt($("#qte-"+prod).val())*parseInt($("#pv-"+prod).val()))
                totaux.total=totaux.total+mt
                $("#total").val(totaux.total)
                CalculTaxe(totaux.total)
                setTotaux(totaux)
                setPanierProduit(panierProduit)
          
                setTimeout(()=>{CalculMonnaie(panierProduit)},50
               )
            }
        }else{
          if(nombre==1){
            const paniers=panierProduit.find((val)=>val.produit_id==prod)
            if(paniers){
                totaux.total=totaux.total-paniers.total
                const mont=parseInt($("#pv-"+prod).val())
                const mt=mont-(mont*paniers?.remise/100)
                paniers.total=mt
                paniers.prix_vente=parseInt($("#pv-"+prod).val())
                paniers.quantite=1
                paniers.qte=""
                panierProduit[index]=paniers
                $("#"+prod).val(1*parseInt($("#pv-"+prod).val()))
                console.log("dddh2",panierProduit)
                console.log("id",prod)
                totaux.total=totaux.total+mt
                $("#total").val(totaux.total)
                CalculTaxe(totaux.total)
                setTotaux(totaux)
                setPanierProduit(panierProduit)
                setTimeout(()=>{CalculMonnaie(panierProduit)},50
               )
            }
          }
       }
    }

    const handleUpdateRemisePanier=async(e,prod,index)=>{
      const paniers=panierProduit.find((val)=>val.produit_id==prod)
      if(e?.target?.value){
         if(paniers){
             paniers.remise=parseInt(e?.target?.value)
             paniers.rm=parseInt(e?.target?.value)
             const mont=parseInt(paniers?.quantite)*parseInt(paniers?.prix_vente)
             const mt=mont-(mont*paniers?.remise/100)
             totaux.total=totaux.total+mt-paniers.total
             CalculTaxe(totaux.total)
             setTotaux(totaux)
             $("#total").val(totaux.total)
             paniers.total=mt
             panierProduit[index]=paniers
             setPanierProduit(panierProduit)
       
             setTimeout(()=>{CalculMonnaie(panierProduit)},50
            )
         }

      }else{
        if(paniers){
          paniers.remise=parseInt(0)
          paniers.rm=""
          const mont=parseInt(paniers?.quantite)*parseInt(paniers?.prix_vente)
          const mt=mont-(mont*paniers?.remise/100)
          totaux.total=totaux.total+mt-paniers.total
          CalculTaxe(totaux.total)
          setTotaux(totaux)
          $("#total").val(totaux.total)
          paniers.total=mt
          panierProduit[index]=paniers
          setPanierProduit(panierProduit)
    
          setTimeout(()=>{CalculMonnaie(panierProduit)},50
         )
      }
      }

 }
  
    const handleRemovePanier=async(prod)=>{
        if(prod){
           const panier=panierProduit.filter((val)=>val.produit_id!==prod.produit_id)
               setPanierProduit(panier)
               CalculTaxe(totaux.total-prod.total)
               $("#total").val(totaux.total-prod.total)
               totaux.total=totaux.total-prod.total
               if(panier.length){
                setDesabled(false)
              }else{
                setDesabled(true)
               }
               setTotaux(totaux)
               setTimeout(()=>{CalculMonnaie(panier)},500
                )
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
       setTotaux({montantencaisse:0,monnaie:0,total:0})
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

	const getClients = async () => {
		let datas=[]
		const { data } = await getData("graphql?query={clients{id email adresse telephone nom_complet}}");
		data?.data?.clients.map((val,id)=>{
            datas.push({label:val.nom_complet,value:parseInt(val.id),id:val?.id})    
			setClients(datas);
		 })
		
	};

   useEffect(() => {
    setProduitVente(context?.boutique?.slice(0,4))
    setNumber(makeid(18))
    getClients()
    
  }, []);

  useEffect(() => {
    const data=[]
    let tot=0
    if(forma?.id){
      setDesabled(false)
      setClient({...client,label:forma?.client?.nom_complet})
    }
    
    forma?.proforma_produits?.map((val,id)=>{
      tot=val?.total+tot
      data?.unshift({produit_id:val?.produit?.id,remise:val?.remise,rm:val?.remise,qte:val?.qte,quantite:val?.qte,prix_vente:val?.prix_vente,pv:val?.prix_vente,total:val?.total,nom:val?.produit?.designation})
      CalculMonnaieUpdate(data)
      setPanierProduit(data)
      // ("#total").val(tot)
      setTotaux({...totaux,total:tot})
    })
    
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
  const handleRemise=(e)=>{
    setRemise(!remise)
   if(remise==false){
    setPanier({...panier,remise:0})
   }else{
    delete panier.remise
   }
  }
  return (
    <div>
   
    <Modal style={{ width: '100%'}} className="my-modal" size="xl" isOpen={open} toggle={toggle}>
      <a id="pdf2" style={{display:"none"}} href={getApiUrl()+"/proforma/generate-pdf/"+venteId} target="_blank">pdf link</a>
        <ModalHeader toggle={() => toggle("")}>Nouveau proforma</ModalHeader>
      <ModalBody>
        <ErrorMsg hide={()=>setError(false)} show={error} errorMsg={"Veuillez choisir l'endroit de l'approvisionnement. "} />
        {openAddCl?
        <CreateClient
          show={openAddCl}
          toggle={()=>setOpenAddCl(!openAddCl)}
          save={(data)=>onSubmitCl(data)}
          loading={loadingClSave}
          client={form}
        />:null
      }
      
      { !created?
        <>
        <Row>
          <Col  lg={5}  md={12}>
            <Card className="card-chart">
              <CardBody>
                <Row style={{paddingBottom:5}}>
                    <Col md={7}>
                        <strong >Nom du  client:</strong> <span>{client?.label}</span>
                    </Col>
                    <Col md={5}>
                        <strong >date: </strong><span>{format(new Date(), 'dd/MM/yyyy')}</span>
                    </Col>
                </Row>
                <Row style={{paddingBottom:15}}>
                    <Col md={7}>
                        <strong >Nom du vendeur: </strong><span>{user?.name}</span>
                    </Col>
                    <Col md={5}>
                       <strong >N° facture: </strong> <span>{number}</span>
                    </Col>
                </Row>
                <Row style={{paddingBottom:5}}>
                    {/* <Col md={4}>
                    <FormGroup>
                     <CustomInput
                       type="checkbox" 
                       id="exampleCustomInline2"
                       label="Client passager" inline
                       value={cl}
                       checked={cl}
                       onChange={(e)=>handleClientP(e.target.value)}
                     />
                     </FormGroup>
                    </Col> */}
                    <Col md={3}>
                    <FormGroup>
                      <CustomInput
                        type="checkbox" 
                        id="exampleCustomInline22"
                        label="TVA" inline
                        value={tva}
                        onChange={(e)=>handleTva(e.target.value)}
                    />
                   </FormGroup>
                 </Col>
                </Row>
                {cl?
                <Row style={{paddingBottom:5}}>
                  <Col md="9">
                   <FormGroup>
                    <ReactSelect
                        isSearchable={true}
                        placeholder={forma?.id?forma?.client?.nom_complet:"Choisir le client "}
                        onChange={(e)=>{
                          setClient(e);
                          setPanier({...panier,
                            client_id:e?.value,
                        })
                        }}
                        options={clients}
                    />
                  </FormGroup>
                 </Col>
                 <Col md={3}>
                  <span onClick={()=>setOpenAddCl(true)} style={{padding:5,marginTop:7,cursor:"pointer",color:"white",backgroundColor:"#6107f0",borderRadius:"100%"}} className="fa fa-plus"/>
                 </Col>
                </Row>:null}
                <Row>
                  <Col md="9">
                    <FormGroup>
                      <Input id="recherche" onChange={(e)=>handleSearch(e)}  placeholder="Rechercher produit" type="text" />
                    </FormGroup>
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
                    <th>Catégorie</th>
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
              {tva?<>
                  <Row>
                     <Col md={12}  style={{float:"right",marginTop:25}}>
                       <Label>Montant total HTT (FCFA)</Label>
                       <Input size="lg" style={{fontSize:30,backgroundColor:"#ab9b9a"}} id="total" disabled defaultValue={totaux.total} type="text" />
                     </Col>
                   </Row>
                   <Row>
                     <Col md={12}  style={{float:"right",marginTop:25}}>
                       <Label>Montant total TTC (FCFA)</Label>
                       <Input size="lg" style={{fontSize:30,backgroundColor:"#ab9b9a"}} disabled value={ttc} type="text" />
                     </Col>
                   </Row>
                   </>:
                    <Row>
                      <Col md={12}  style={{float:"right",marginTop:25}}>
                        <Label>Montant total HTC (FCFA)</Label>
                        <Input size="lg" style={{fontSize:30,backgroundColor:"#ab9b9a"}} id="total" disabled value={totaux.total} type="text" />
                      </Col>
                    </Row>
                }
                    {/* <Row style={{marginTop:15}}>
                      <Col md={12}>
                        <Label>Montant reçu (FCFA)</Label>
                        <Input id="remise" onChange={(e)=>CalculMonnaie(e)}  type="number" />
                      </Col>
               
                    </Row> */}
                    {/* <Row style={{marginTop:15}}>
                      <Col md={12} >
                        <Label>Monnaie à rendre (FCFA)</Label>
                        <Input id="monnaie" disabled defaultValue={0} type="text" />
                      </Col>
                    </Row> */}
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
                        <th>Désignation</th>
                        <th>Qté</th>
                        <th>Prix Unitaire (fcfa)</th>
                        <th>Rémise(%)</th>
                        <th>Total (fcfa)</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                          panierProduit.map((val,id)=>(
                            
                              <tr key={id} style={{marginTop:20}}>
                                <td style={{width: "16%"}}>{val.nom}</td>
                                <td style={{width: "16%"}}><Input id={"qte-"+val.produit_id} min={0} onChange={(e)=>handleUpdatePanier(e,val.produit_id,id,1)}  value={panierProduit[id]?.qte} type="number" /></td>
                                <td style={{width: "18%"}}><Input value={panierProduit[id]?.prix_vente} id={"pv-"+val.produit_id} min={1} onChange={(e)=>handleUpdatePanier(e,val.produit_id,id,0)}   type="number" /></td>      
                                <td style={{width: "14%"}}><Input value={panierProduit[id]?.rm} id={"rm-"+val.produit_id} min={0} onChange={(e)=>handleUpdateRemisePanier(e,val.produit_id,id)}   type="number" /></td>      
                                <td style={{width: "18%"}}><Input id={""+val.produit_id}  disabled value={val.total} type="text" /></td>
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
            </>:<ResumeVente
                handleTerminer={()=>toggle(posted)}
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
  export default CreateProformat;