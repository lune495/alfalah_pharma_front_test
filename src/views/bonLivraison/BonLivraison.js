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
import ModalConfirmation from "components/Modals/ModalConfirmation";
import DetailBon from "components/Modals/DetailBon";
import CreateBl from "components/Modals/CreateBl";

export  const BonLivraison = () => {
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
  
      return (
       <> <span onClick={()=>handleDetail(val)} style={{color:"blue",cursor:"pointer",fontSize:20,marginLeft:30,marginRight:10}} className="fa fa-info-circle" ></span>   </>
      )
    }

    const getVentes = async (count,page) => {
      // const url="graphql?query={ventes{id statut nom_complet paye client{nom_complet} numero montant_ht montant_ttc remise_total montant_avec_remise created_at vente_produits{qte remise montant_remise total produit{designation} }  montant montant_avec_remise qte montant_ht montant_ttc remise_total user { id name}}}"
      const url = "graphql?query={sortiestockspaginated(count:" + count + ",page:" + page +"){metadata{current_page per_page} data{id created_at_fr ref user{id name}  ligne_sortie_stocks{quantite quantite_stock  produit{id designation} }  }}}"
      // const url2 = "graphql?query={ventespaginated(count:" + count + ",page:" + page + ",created_at_start:\"" + date1 + "\",created_at_end:\"" + date2 +"\"){metadata{current_page per_page} data{id statut nom_client client{nom_complet} created_at numero montant_ttc remise_total montant_avec_remise vente_produits{qte remise montant_remise total produit{designation} }  montant remise_total montant_avec_remise qte montant_ht montant_ttc user { id name} }}}"
      // const url3 = "graphql?query={ventespaginated(count:" + count + ",page:" + page + ",reference:\"" + ref +"\"){metadata{current_page per_page} data{id statut nom_client client{nom_complet} created_at numero montant_ttc remise_total montant_avec_remise vente_produits{qte remise montant_remise total produit{designation} }  montant montant_avec_remise remise_total qte montant_ttc montant_ht user { id name} }}}"
      // setLoading(true)
      const { data } = await getData(url);
      console.log("vete",data)
      setVente(data.data.sortiestockspaginated.data)
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
      getVentes(1000,1,data)
    }else{
      setTimeout(()=>getVentes(1000,1),1000)
      
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
      getVentes(1000,1)
    }, []);
//255b70e78fb686670b01
 
  
    return (
      <div className="content n-produit" style={{paddingTop:15}}>
          <a id="pdf" style={{display:"none"}} href={getApiUrl()+"/vente/generate-pdf/"+venteId} target="_blank">pdf link</a>
          <a id="pdf2" style={{display:"none"}} href={getApiUrl()+"/vente/situation"} target="_blank">pdf link</a>
          {openAdd?
          <CreateBl
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
                  title="Confirmation quitter le bon de livraison"
                  bouton="Quitter"
                  annuler="Continuer le bon de livraison"
            />
           <DetailBon
            show={open}
            detail={detailVente}
            toggle={()=>setOpen(!open)}
          />
         <Row>
         <Col md="9">
         </Col>
          <Col md="3">
            <div style={{alignSelf:"flex-end",alignContent:"flex-end"}}> 
              <BouttonGroup
                  title2="Bon Livraison"
                  // icon="cart-plus"
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
                  <th>Caisse</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {!loading?
                <>
                {vente?.map((val,id)=>(
                  <tr>
                    <td>{val?.created_at_fr}</td>
                    <td>{val?.ref}</td>
                    <td>{val.user?.name}</td>
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