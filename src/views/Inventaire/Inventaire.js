import {useContext, useEffect, useState} from "react"
import "./Vente.css"

import {sendData, getData,getApiUrl } from "../../methodes";
import { format } from "date-fns";
import Select from 'react-select';
import { Col,FormGroup, Input,Table, Label, Row, DropdownItem } from "reactstrap";
import Redirection from "shared/Redirect";
import BouttonGroup from "shared/Bouttons/BouttonGroup";
import { BusinessContext } from "views/BusinessContext";
import CreateVente from "components/Modals/CreateVente";
import DetailVente from "components/Modals/DetailVente";
import ModalConfirmation from "components/Modals/ModalConfirmation";
import DropDownPartage from "shared/DropDownPartage";
import CreateProformat from "components/Modals/CreateProformat";
import CreateInventaire from "components/Modals/CreateInventaire";
import DetailInventaire from "components/Modals/DetailInventaire";

export  const Inventaire = () => {
    const [redirectProd,setRedirectProd] = useState(false);
    const [loading,setLoading] = useState(false);
    const [loadingAnnuler,setLoadingAnnuler] = useState(false);
    const [openAdd,setOpenAdd] = useState(false);
    const [loadingSave,setLoadingSave] = useState(false);
    const context = useContext(BusinessContext);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user_stock_data"))?.user);
    const [venteId,setVenteId] = useState(0);
    const [idInit,setId] = useState(-1);
    const [vente,setVente] = useState([]);
    const [form,setForm] = useState({});
    const [detailVente,setDetailVente] = useState({});
    const [open,setOpen] = useState(false);
    const [isOpen,setIsOpen] = useState(false);
    const [isOpenD,setIsOpenD] = useState(false);
    const [date1,setDate1] = useState("");
    const [vteId,setVteId] = useState("");
    const [date2,setDate2] = useState("");
    const [number,setNumber] = useState(10);
    const [page,setPage] = useState(10);
    const [next,setNext] = useState(1);
    const [isNext,setIsNext] = useState(true);
  
    

    const action=(val)=>{
      val["date"]=val?.created_at?format(new Date(val?.created_at), 'dd/MM/yyyy'):"30/08/2022"
      val["time"]=val?.created_at?format(new Date(val?.created_at), 'HH:mm:ss'):"12:00"
      return (
        // <>  <span onClick={()=>handleDetail(val)} style={{color:"grey",cursor:"pointer",fontSize:20,marginRight:10}} className="fa fa-info-circle" ></span>  <i onClick={()=>{setVenteId(val?.id);handleDownload(val)}} style={{color:"red",cursor:"pointer",fontSize:20}} className="fa fa-file-pdf" aria-hidden="true"></i> </>
        <>  <span onClick={()=>handleDetail(val)} style={{color:"grey",cursor:"pointer",fontSize:20,marginRight:10}} className="fa fa-info-circle" ></span>  </>
      )
    }

    const getVentes = async (count,page,ref) => {
      const user_id = user?.id ? user?.id : 0;  
      const url1 = "graphql?query={inventaires{id ref created_at ligne_inventaires{quantite_reel produit{designation} quantite_theorique diff_inventaire}  user { id name} }}"
      // const url2 = "graphql?query={inventairespaginated(count:" + count + ",page:" + page + ",created_at_start:\"" + date1 + "\",created_at_end:\"" + date2 +"\"){metadata{current_page per_page} data{id client{nom_complet id} created_at numero montant_ttc remise_total montant_avec_remise proforma_produits{qte prix_vente remise montant_remise total produit{designation pv id} }  montant remise_total montant_avec_remise qte montant_ht montant_ttc user { id name} }}}"
      // const url3 = "graphql?query={inventairespaginated(count:" + count + ",page:" + page + ",reference:\"" + ref +"\"){metadata{current_page per_page} data{id  client{nom_complet,id} created_at numero montant_ttc remise_total montant_avec_remise proforma_produits{qte prix_vente remise montant_remise total produit{designation pv id} }  montant montant_avec_remise remise_total qte montant_ttc montant_ht user { id name} }}}"
      setLoading(true)
      const { data } = await getData(url1);
     
        console.log("prop",data)
      setVente(data?.data?.inventaires)
      setLoading(false)
      
    };

    


  const handleDetail=(val)=>{
    setDetailVente(val)
    setOpen(true)
  }
  const handleOpenModal=(prod)=>{
    if(!prod?.statut){
      setVteId(prod)
      setIsOpenD(true)
    }
  }

  const handleDownload=(data)=>{
      setVenteId(data?.id)
        setTimeout(()=>document.getElementById("pdf").click(),500
     )
  }

  const handleNext=()=>{
    if(isNext){
    setNext(next+1)
    getVentes(page,next+1)
    }
  }
  const handlePage=(e)=>{
    setPage(e.value)
    getVentes(e.value,next)
  }

  const handlePreview=()=>{
    if(next-1>0){
      setNext(next-1)
      getVentes(page,next-1)
    }
    
  }

  const handleSearch=(data)=>{
    if(data){
      getVentes(10,1,data)
    }else{
      setTimeout(()=>getVentes(10,1),1000)
      
    }
   
  }

  const handleRefresh=(data)=>{
    let vte=vente
    if(data?.id){
      vte.unshift(data)
      setVente(vte)
      setOpenAdd(!openAdd)
    }else{
      setIsOpen(true)
    }
    
  }
 const handleClose=()=>{
    setIsOpen(false)
    setOpenAdd(!openAdd)
  }
  const handleRefreshSelling=(data)=>{
    setId(-1)
    const index=vente.findIndex((el)=>el.id==data?.id)
    vente[index].statut=true
    setVente(vente)
  }
  const handleUpdate = async (datas) => {
    setId(datas?.id)
    setLoadingAnnuler(true)
		await sendData("api/venteannulee/"+datas?.id, {})
			.then(({data}) => {
        setIsOpenD(false)
        handleRefreshSelling(datas)
        setLoadingAnnuler(false)
			})
			.catch((error) => {
        console.log("error annule",error)
			 }
			);
	};

  const updateProduct=(data)=>{
    setForm(data)
    setOpenAdd(true)
  }

    useEffect(() => {
      getVentes(10,1)
    }, []);
  
    return (
      <div className="content n-produit" style={{paddingTop:15}}>
          {/* <a id="pdf" style={{display:"none"}} href={getApiUrl()+"/proforma/generate-pdf/"+venteId} target="_blank">pdf link</a> */}
          {openAdd?
          <CreateInventaire
            open={openAdd}
            forma={form}
            toggle={(data)=>handleRefresh(data)}
          />:null
          }
          <ModalConfirmation
            show={isOpenD}
            toggle={()=>setIsOpenD(!isOpenD)}
            save={()=>handleUpdate(vteId)}
            loading={loadingAnnuler}
            text="Voulez-vous annuler cet inventaire?"
            title="Confirmation annuler inventaire"
            bouton="OUI"
            annuler="NON"
          />
           <ModalConfirmation
                  show={isOpen}
                  toggle={()=>setIsOpen(!isOpen)}
                  save={()=>handleClose()}
                  loading={loadingSave}
                  text="Voulez-vous quitter le modale toutes les données saisie seront perdu"
                  title="Confirmation quitter l'inventaire"
                  bouton="Quitter"
                  annuler="Continuer l'inventaire"
            />
           <DetailInventaire
            show={open}
            detail={detailVente}
            toggle={()=>setOpen(!open)}
          />
         <Row>
         <Col md="3">
            <FormGroup>
                <Input style={{marginRight:10}} placeholder="Ref" onChange={e=>handleSearch(e.target.value)}  />
            </FormGroup>
         </Col>
         <Col md="1"></Col>
         
         <Col md="2">
						<FormGroup>
							<Input type="date" placeholder="date 1" onChange={e=>setDate1(e.target.value?format(new Date(e.target.value),'dd/MM/yyyy'):null)}  />
						</FormGroup>
					</Col>
					<Col md="2">
						<FormGroup>
							{/* <Label for="exampleEmail" >{form?.text}</Label> */}
							<Input type="date" placeholder="date 2" onChange={e=>setDate2(e.target.value?format(new Date(e.target.value),'dd/MM/yyyy'):null)}  />
						</FormGroup>
					</Col>
					<Col md="1">
						<span onClick={()=>getVentes(10,1)} style={{fontSize:25,cursor:"pointer",marginTop:10}} className="fa fa-search" ></span>
					</Col>
          
          <Col md="3">
            <div style={{alignSelf:"flex-end",right:0,alignContent:"flex-end"}}>
              <BouttonGroup
                  title2="Nouvel inventaire"
                  icon="plus"
                  handle2={()=>setOpenAdd(true)}
              />
            </div>
          </Col>
        </Row>
        
        <div className="n-produit">
        <Table striped hover responsive>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Ref</th>
                  <th>Heure</th>
                  <th>Crée  par</th>
                  {/* <th>Qté théorique</th>
                  <th>Qté réèlle</th> */}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {!loading?
                <>
                {vente.map((val,id)=>(
                  <tr style={val?.statut?{backgroundColor:"#f7d0c8"}:null}>
                    <td>{val?.created_at ? format(new Date(val?.created_at), 'dd/MM/yyyy') : "30/08/2022"}</td>
                    <td>{val?.ref}</td>
                    <td>{val?.created_at?format(new Date(val?.created_at), 'HH:mm:ss'):"12:00"}</td>
                    <td>{val?.user?.name}</td>
                    {/* <td>{val?.quantite_theorique}</td>
                    <td>{val?.quantite_reel}</td> */}
                    {/* <td>{val.user ? val.user.name : "Admin"}</td> */}
                    {/* <td>
                    {idInit==val?.id?
                      <div className="spinner-border" role="status">
                         <span className="sr-only">Chargement...</span>
                      </div>:
                      <DropDownPartage color={val?.statut?"danger":"success"} title={val?.statut?"ANNULÉE":"VENDU"}>
                        
                        {!val?.statut?<DropdownItem onClick={()=>handleUpdate(val)}>
                            Annuler
                        </DropdownItem>:null}
                     */}
                      {/* </DropDownPartage>
                     }
                      </td>
                       */}
                    <td>{action(val)}</td>
                    
                  </tr>
                ))}
                </>:
                <div className="spinner-border" role="status">
                  <span className="sr-only">Chargement...</span>
                </div>
                }
             
            </tbody>
          </Table>
          {/* <Row>
            
            <Col md={7}></Col>
            <Col md={3}>
            <FormGroup row>
            <Label md={3}>Page: </Label> 
            <Col md={9}>
            <Select
                    isSearchable={true}
                    placeholder={10}
                    // value={selectedOption}
                    onChange={e=>{handlePage(e)}}
                    options={context.countData}
   
                /> 
                </Col>
            </FormGroup>
            </Col>
            <Col style={{marginTop:5}} md={2}>
              <span style={{color:"black",marginRight:7}}>{vente?.length?1:0} à {number} - {next}</span>
              <span onClick={()=>handlePreview()} style={{fontSize:20,marginRight:5,color:"grey",cursor:"pointer"}} className="fa fa-chevron-left"></span>
              <span onClick={()=>handleNext()} style={{fontSize:20,color:"grey",cursor:"pointer"}} className="fa fa-chevron-right"></span>
            </Col>
          </Row> */}

          </div>
       
      </div>
    );
  };