import {useContext, useEffect, useState} from "react"
import "./Vente.css"
import { sendData,getData,getApiUrl } from "../../methodes";
import { format } from "date-fns";
import Select from 'react-select';
import { BusinessContext } from "../BusinessContext";
import { Col,FormGroup, Input,Table, Label, Row } from "reactstrap";
import BouttonGroup from "shared/Bouttons/BouttonGroup";
import CreateAppro from "components/Modals/CreateAppro";
import DetailAppro from "components/Modals/DetailAppro";
import ModalConfirmation from "components/Modals/ModalConfirmation";


export  const ListAppro = () => {
    const [redirectProd,setRedirectProd] = useState(false);
    const [loading,setLoading] = useState(true);
    const [loadingSave,setLoadingSave] = useState(false);
    const [loadingAnnuler,setLoadingAnnuler] = useState(false);
    const [isOpenD,setIsOpenD] = useState(false);
    const context = useContext(BusinessContext);
    const [venteId,setVenteId] = useState(0);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user_stock_data"))?.user);
    const [vente,setVente] = useState([]);
    const [detailVente,setDetailVente] = useState({});
    const [open,setOpen] = useState(false);
    const [vteId,setVteId] = useState("");
    const [openAdd,setOpenAdd] = useState(false);
    const [number,setNumber] = useState(10);
    const [page,setPage] = useState(10);
    const [next,setNext] = useState(1);
    const [isNext,setIsNext] = useState(true);


    const action=(val)=>{
      val["user_name"]=val?.user?.name 
      val["date"]=val?.created_at?format(new Date(val?.created_at), 'dd/MM/yyyy'):"30/08/2022"
      val["time"]=val?.created_at?format(new Date(val?.created_at), 'HH:mm:ss'):"12:00"
      return (
       <> <span onClick={()=>handleDetail(val)} style={{color:"blue",cursor:"pointer",fontSize:20,marginLeft:30,marginRight:10}} className="fa fa-info-circle" ></span>  <i onClick={()=>{setVenteId(val?.id);handleDownload(val)}} style={{color:"red",cursor:"pointer",fontSize:20}} className="fa fa-file-pdf" aria-hidden="true"></i> <span onClick={()=>handleOpenModal(val)} style={{color:"red",cursor:"pointer",fontSize:20,marginLeft:12}} className="fa fa-xmark" ></span>  </>
      )
    }

    const getVentes = async (count,page) => {
      let datas=[]
      setLoading(true)
      const user_id = user?.id ? user?.id : 0;
      const { data } = await getData("graphql?query={approvisionnementspaginated(count:" + count + ",page:" + page + ",user_id:" + user_id +"){ metadata{current_page per_page} data{id statut numero montant qte_total_appro type_appro fournisseur{nom_complet} created_at ligne_approvisionnements{quantity_received  produit{designation pv pa} }  user { id name} }}}");
      
      setNumber(
        data.data.approvisionnementspaginated.data.length!==0?data.data.approvisionnementspaginated.data.length:0
        )
        if(data.data.approvisionnementspaginated.data.length){
          setIsNext(true)
        }else{
          setVente([])
          setIsNext(false)
        }
      
      setVente(data?.data?.approvisionnementspaginated?.data)

      setLoading(false)
    };

  const handleDetail=(val)=>{
    console.log("detaile",val)
    setDetailVente(val)
    setOpen(true)
  }

  const handleDownload=(data)=>{
     setVenteId(data?.id)
     setTimeout(()=>document.getElementById("pdf-a").click(),500
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
  const handleRefresh=(data)=>{
    let vte=vente
    if(data?.id){
      vte.unshift(data)
      setVente(vte)
      
    }
    setOpenAdd(!openAdd)
  }

  const handleOpenModal=(prod)=>{
    if(!prod?.statut){
      setVteId(prod)
      setIsOpenD(true)
    }
    
  }
  const handleRefreshSelling=(data)=>{
    const index=vente.findIndex((el)=>el.id==data?.id)
    vente[index].statut=true
    setVente(vente)
  }
  const handleUpdate = async (datas) => {
    setLoadingAnnuler(true)
		await sendData("api/approannulee/"+datas?.id, {})
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
  
    return (
      <div className="content n-produit" style={{paddingTop:15}}>
          <a id="pdf-a" style={{display:"none"}} href={getApiUrl()+"/approvisionnementpdf/"+venteId} target="_blank">pdf link</a>
          {openAdd?
          <CreateAppro
            open={openAdd}
            toggle={(data)=>handleRefresh(data)}
          
          />:null
          }
          <ModalConfirmation
                  show={isOpenD}
                  toggle={()=>setIsOpenD(!isOpenD)}
                  save={()=>handleUpdate(vteId)}
                  loading={loadingAnnuler}
                  text="Voulez-vous annuler cet appro?"
                  title="Confirmation annuler appro"
                  bouton="OUI"
                  annuler="NON"
            />
        <DetailAppro
            show={open}
            detail={detailVente}
            toggle={()=>setOpen(!open)}
          />
        <div style={{alignSelf:"flex-end",alignContent:"flex-end"}}>
           <BouttonGroup
              title2="Facture achat"
              icon="cart-plus"
              handle2={()=>setOpenAdd(true)}
           />
        </div>
    
        <div className="n-produit">
         <Table striped hover responsive>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>N0 Facture</th>
                  <th>Heure</th>
                  <th>Quantité</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {!loading?
                <>
                {vente.map((val,id)=>(
                  <tr style={val?.statut?{backgroundColor:"#f7d0c8"}:null}>
                    <td>{val?.created_at?format(new Date(val?.created_at), 'dd/MM/yyyy'):"30/08/2022"}</td>
                    <td>{val.numero}</td>
                    <td>{val?.created_at?format(new Date(val?.created_at), 'HH:mm:ss'):"12:00"}</td>
                    <td>{val.qte_total_appro}</td>
                    <td>{val.montant}</td>
                    {/* <td>{val?.user ? val?.user?.name : "Admin"}</td> */}
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
          
          <Row>
            
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
          </Row>

       </div>
      </div>
    );
  };