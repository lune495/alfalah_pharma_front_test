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
import Pusher from 'pusher-js';

export  const Vente = () => {
    const [redirectProd,setRedirectProd] = useState(false);
    const [loading,setLoading] = useState(true);
    const [loadingAnnuler,setLoadingAnnuler] = useState(false);
    const [openAdd,setOpenAdd] = useState(false);
    const [loadingSave,setLoadingSave] = useState(false);
    const context = useContext(BusinessContext);
    const [venteId,setVenteId] = useState(0);
    const [idInit,setId] = useState(-1);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user_stock_data"))?.user);
    const [vente,setVente] = useState([]);
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
      val["user_name"]=val?.user?.name 
      val["date"]=val?.created_at?format(new Date(val?.created_at), 'dd/MM/yyyy'):"30/08/2022"
      val["time"]=val?.created_at?format(new Date(val?.created_at), 'HH:mm:ss'):"12:00"
      return (
       <> <span onClick={()=>handleDetail(val)} style={{color:"blue",cursor:"pointer",fontSize:20,marginLeft:30,marginRight:10}} className="fa fa-info-circle" ></span>  <i onClick={()=>{setVenteId(val?.id);handleDownload(val)}} style={{color:"red",cursor:"pointer",fontSize:20}} className="fa fa-file-pdf" aria-hidden="true"></i><span onClick={()=>handleOpenModal(val)} style={{color:"red",cursor:"pointer",fontSize:20,marginLeft:12}} className="fa fa-xmark" ></span> </>
      )
    }

    const getVentes = async (count,page,ref) => {
      const user_id = user?.id ? user?.id : 0;
      const url="graphql?query={ventes{id statut nom_complet paye client{nom_complet} numero montant_ht montant_ttc remise_total montant_avec_remise created_at vente_produits{qte remise montant_remise total produit{designation} }  montant montant_avec_remise qte montant_ht montant_ttc remise_total user { id name}}}"
      // const url1 = "graphql?query={ventespaginated(count:" + count + ",page:" + page + ",user_id:" + user_id +"){metadata{current_page per_page} data{id statut nom_client client{nom_complet} numero montant_ht montant_ttc remise_total montant_avec_remise created_at vente_produits{qte remise montant_remise total produit{designation} }  montant montant_avec_remise qte montant_ht montant_ttc remise_total user { id name} }}}"
      // const url2 = "graphql?query={ventespaginated(count:" + count + ",page:" + page + ",created_at_start:\"" + date1 + "\",created_at_end:\"" + date2 +"\"){metadata{current_page per_page} data{id statut nom_client client{nom_complet} created_at numero montant_ttc remise_total montant_avec_remise vente_produits{qte remise montant_remise total produit{designation} }  montant remise_total montant_avec_remise qte montant_ht montant_ttc user { id name} }}}"
      // const url3 = "graphql?query={ventespaginated(count:" + count + ",page:" + page + ",reference:\"" + ref +"\"){metadata{current_page per_page} data{id statut nom_client client{nom_complet} created_at numero montant_ttc remise_total montant_avec_remise vente_produits{qte remise montant_remise total produit{designation} }  montant montant_avec_remise remise_total qte montant_ttc montant_ht user { id name} }}}"
      // setLoading(true)
      const { data } = await getData(url);
      let datas=[]
      console.log("vete",data)
      setVente(data?.data?.ventes)
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

  const handleDownloadSituation=()=>{
    
      setTimeout(()=>document.getElementById("pdf2").click()
    )
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
    useEffect(() => {
      getVentes(10,1)
    }, []);
//255b70e78fb686670b01
    useEffect(() => {
      const pusher = new Pusher('d138c832a9b86305ed9d', {
        cluster: 'eu',
      });
  
      const channel = pusher.subscribe('my-channel');
      channel.bind('event-caisse', function(data) {
        getVentes(10,1)
      });
  
      // N'oubliez pas de se désabonner du canal lorsque le composant est démonté
      return () => {
        channel.unbind('event-caisse');
        pusher.unsubscribe('my-channel');
      };
    }, []);

  
    return (
      <div className="content n-produit" style={{paddingTop:15}}>
          <a id="pdf" style={{display:"none"}} href={getApiUrl()+"/vente/generate-pdf/"+venteId} target="_blank">pdf link</a>
          <a id="pdf2" style={{display:"none"}} href={getApiUrl()+"/vente/situation"} target="_blank">pdf link</a>
          {openAdd?
          <CreateVente
            open={openAdd}
            toggle={(data)=>handleRefresh(data)}
          
          />:null
          }
          <ModalConfirmation
            show={isOpenD}
            toggle={()=>setIsOpenD(!isOpenD)}
            save={()=>handleUpdate(vteId)}
            loading={loadingAnnuler}
            text="Voulez-vous annuler cette vente?"
            title="Confirmation annuler vente"
            bouton="OUI"
            annuler="NON"
          />
           <ModalConfirmation
                  show={isOpen}
                  toggle={()=>setIsOpen(!isOpen)}
                  save={()=>handleClose()}
                  loading={loadingSave}
                  text="Voulez-vous quitter le modale toutes les données saisie seront perdu"
                  title="Confirmation quitter la vente"
                  bouton="Quitter"
                  annuler="Continuer vente"
            />
           <DetailVente
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
            <div style={{alignSelf:"flex-end",alignContent:"flex-end"}}> 
              <BouttonGroup
                  title2="Facture vente"
                  icon="cart-plus"
                  handle2={()=>setOpenAdd(true)}
              />
            </div>
          </Col>
        </Row>
        <div className="n-produit">
        {vente.length!=0 && (<div style={{flexDirection:"row",
        marginBottom:10,
        alignSelf:"flex-end",
        alignContent:"flex-end",
        alignItems:"flex-end",}}>
            <button style={{
                borderRadius:10,
                height:45,
                borderColor:"#7d3ce6",
                color:"white",
                backgroundColor:"#6107f0",
                marginRight:10,
                alignContent:"flex-end",
                alignItems:"flex-end",

                }}
                onClick={()=>handleDownloadSituation()}
                >
                <i style={{ marginRight:8}} className={`icon-sidebar fa fa-print`}></i>Situation Journalière
              </button>
          </div>)}
          <Table striped hover responsive>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Ref</th>
                  <th>Heure</th>
                  <th>Client</th>
                  <th>Total</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {!loading?
                <>
                {vente?.map((val,id)=>(
                  <tr style={val?.statut?{backgroundColor:"#f7d0c8"}:null}>
                    <td>{val?.created_at ? format(new Date(val?.created_at), 'dd/MM/yyyy') : "30/08/2022"}</td>
                    <td>{val?.numero}</td>
                    <td>{val?.created_at?format(new Date(val?.created_at), 'HH:mm:ss'):"12:00"}</td>
                    <td>{val.nom_complet ? val?.nom_complet : "Passager"}</td>
                    <td>{val.montant_ttc ? val.montant_ttc : val.montant_avec_remise}</td>
                    <td><span style={{ fontSize: 14, paddingTop: 5, paddingBottom: 5, paddingRight: 20, paddingLeft: 20, borderRadius: 30, fontWeight: 900, backgroundColor: val?.paye === true ? "#83f789" :"rgb(242 123 114)"}}>{val?.paye?"PAYE":"NON PAYE"}</span></td>
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
          </div>
      </div>
    );
  };