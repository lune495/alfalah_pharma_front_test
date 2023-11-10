import {useContext, useEffect, useState} from "react"
import "./NewProduit.css"
import Select from 'react-select';
import { BusinessContext } from "../BusinessContext";
import { alert,getApiUrl, getData,sendData, removeData, toastMsg } from "../../methodes";
import { Col,FormGroup, Input,Table, Label, Row } from "reactstrap";
import BouttonGroup from "shared/Bouttons/BouttonGroup";
import CreateProduit from "components/Modals/CreateProduit";
import ModalConfirmation from "components/Modals/ModalConfirmation";
import logo from "../../assets/product.png"
import ImageView from "components/Modals/ImageView";
import { ToastContainer } from "react-toastify";
import ToastComponent from "shared/ToastComponent";

export const Boutique = () => {
    const context = useContext(BusinessContext);
    const [redirectProd,setRedirectProd] = useState(false);
    const [produits,setProduits] = useState([]);
    const [imageData,setImageData] = useState({});
    const [loading,setLoading] = useState(true);
    const [loadingCapital,setLoadingCapital] = useState(false);
    const [form, setForm] = useState({});
    const [openAdd,setOpenAdd] = useState(false);
    const [hide,setHide] = useState(true);
    const [loadingSave,setLoadingSave] = useState(false);
    const [number,setNumber] = useState(10);
    const [page,setPage] = useState(10);
    const [capital,setCapital] = useState(0);
    const [next,setNext] = useState(1);
    const [isOpen,setIsOpen] = useState(false);
    const [openImage,setOpenImage] = useState(false);
    const [produitId,setProduitId] = useState(0);
    const [nbrProduit,setNbrProduit] = useState(0);
    const [isNext,setIsNext] = useState(true);


    const action=(produit)=>{
      return (
       <> <span onClick={()=>updateProduct(produit)} style={{color:"blue",cursor:"pointer",fontSize:20,marginLeft:30,marginRight:10}} className="fa fa-pencil-square" ></span> <span onClick={()=>handleOpenModal(produit)} style={{color:"red",cursor:"pointer",fontSize:20}} className="fa fa-trash-alt" ></span> </>
      )
    }
    const onSubmit = async (post) => {
      console.log("request produit",post)
      setLoadingSave(true);
      await sendData(
            "api/produits",
            post,
         )
        .then(async ({ data }) => {

          console.log("response produit",data)
          if(!data?.data?.produits[0]?.designation){
            // alert(
            //   ""+data,
            //   "error"
            // );
            
            toastMsg(data,"error")
          }else{
           
             addNewProduct(data?.data?.produits[0],post)
            // alert(
            //   post?.id?"Produit modifié avec succès":"Produit ajouté avec succès",
            //   "success"
            // );
            setLoadingSave(false);
            toastMsg(post?.id?"Produit modifié avec succès":"Produit ajouté avec succès","success")
            setOpenAdd(false)
          }
        
        })
        .catch(({ response }) => {
          console.log("error produit",response)
          setLoadingSave(false);
          // alert(
          //   response?.data?.message?response?.data?.message:"une erreur est survenue",
          //   "danger"
          // );
          toastMsg(response?.data?.message?response?.data?.message:"une erreur est survenue","error")
        });
  
      setLoadingSave(false);
    }

    const getProduits = async (count,page,search) => {
      let datas=[]
      const init = "graphql?query={produitspaginated(count:" + count + ",page:" + page + "){metadata{current_page per_page} data{id image code nbr_produit capital designation limite pa qte pv depots{stock} famille{ id nom} }}}"
      const url = "graphql?query={produitspaginated(count:" + count + ",page:" + page + ",search:\"" + search +"\"){metadata{current_page per_page} data{id image code capital nbr_produit designation limite pa qte pv depots{stock} famille{ id nom} }}}"
      setLoading(true)
      setLoadingCapital(true)
      const { data } = await getData(search?url:init);
      console.log("produit prod", data.data?.produitspaginated?.data)
      setNumber(
        data.data?.produitspaginated?.data.length!==0?data.data?.produitspaginated?.data?.length:0
        )
        if(data.data.produitspaginated.data.length){
          setIsNext(true)
        }else{
          setProduits([])
          setIsNext(false)
        }
     
      setProduits(data?.data?.produitspaginated.data)
      setCapital(data?.data?.produitspaginated.data?.length?data?.data?.produitspaginated.data[0].capital:0)
      setNbrProduit(data?.data?.produitspaginated.data?.length?data?.data?.produitspaginated?.data[0]?.nbr_produit:0)
      setLoading(false)
      setLoadingCapital(false)

    };
    const getCapital = async (count,page) => {
      const init = "graphql?query={produitspaginated(count:" + count + ",page:" + page + "){metadata{current_page per_page} data{id image code capital designation limite pa qte pv depots{stock} famille{ id nom} }}}"
      setLoadingCapital(true)
      const { data } = await getData(init);
      setCapital(data?.data?.produitspaginated.data?.length?data?.data?.produitspaginated.data[0].capital:0)
      setLoadingCapital(false)

    };

    const addNewProduct=(val,post)=>{
      getCapital(10,1)
      const index = produits.findIndex((v) =>v.id == val.id);
      if(index!==-1){
        produits[index]=val
        context.addState(
          "boutique",
           val,
           "update"
         )
      }else{
        produits.unshift(val)
        context.addState(
          "boutique",
           val,
           "add"
         )
      }
      setProduits(produits)

    }

  const handleSearch = (data) => {
    if (data) {
      getProduits(10, 1, data)
    } else {
      setTimeout(() => getProduits(10, 1), 1000)

    }

  }

    const handleRemove = async () => {
      setLoadingSave(true);
      await removeData("api/produits/"+produitId?.id)
        .then(({ data }) => {
          setIsOpen(false)
          if(data.data){
            setProduits(produits?.filter((val)=>val.id!==produitId?.id))
          }
          toastMsg("Suppression effectuée avec succès","success")

          // alert(`Suppression effectuée avec succès`, "success");
        })
        .catch((err) => {
          setLoadingSave(false);
          toastMsg("Vous n'avez pas le droit de supprimer ce produit","warning")
          
          // alert(`Vous n'avez pas le droit de supprimer ce produit`, "success");
        });
        setLoadingSave(false);
    };
    
    const handleOpenImage=(val)=>{
      if(val?.image){
        setImageData({ ...imageData, url: "" + getApiUrl() +"/images/"+val?.image,name:val?.designation})
      }else{
        setImageData({...imageData,url:logo,name:val?.designation})
      }
      
      setOpenImage(true)
    }
    const handleOpenModal=(prod)=>{
      setProduitId(prod)
      setIsOpen(true)
    }
    const updateProduct=(data)=>{
      setForm({...data,famille_id:data?.famille?.id})
      setOpenAdd(true)
    }

    const handleNext=()=>{
      if(isNext){
        setNext(next+1)
        getProduits(page,next+1)
      }
     
    }
    const handlePage=(e)=>{
      setPage(e.value)
      getProduits(e.value,next)
    }

    const handlePreview=()=>{
      if(next-1>0){
        setNext(next-1)
        getProduits(page,next-1)
      }
      
    }

    useEffect(() => {
      getProduits(10,1)
      
    }, []);
    
  
   
    return (
      <div className="content n-produits" style={{paddingTop:15}}>
        <div style={{alignSelf:"flex-end",alignContent:"flex-end"}}>
        {/* <ToastComponent/> */}
        <a id="export" style={{display:"none"}} href={getApiUrl()+"/export-produits"} >pdf link</a>
          <Row>
          <Col md="4" style={{marginTop:10}}>
            <FormGroup>
              <Input  placeholder="Ref,Désignation" onChange={e => handleSearch(e.target.value)} />
            </FormGroup>
          </Col>
            <Col md={5} style={{marginTop:10}}>
              <BouttonGroup
                title1="Exporter"
                title2="Nouveau produit"
                handle1={()=>document.getElementById("export").click()}
                handle2={()=>{setForm({});setOpenAdd(true)}}
              />
                <ImageView
                  url={imageData}
                  show={openImage}
                  toggle={()=>setOpenImage(!openImage)}
                />
                <ModalConfirmation
                  show={isOpen}
                  toggle={()=>setIsOpen(!isOpen)}
                  save={()=>handleRemove()}
                  loading={loadingSave}
                />
                {openAdd?
                  <CreateProduit
                    show={openAdd}
                    toggle={()=>setOpenAdd(!openAdd)}
                    save={(data)=>onSubmit(data)}
                    loading={loadingSave}
                    produit={form}
                  />:null
               }
            </Col>
            {!loadingCapital?
              <Col md={3}  style={{marginBottom:20,marginTop:-40}}>
                  <Label><span style={{ color: "black", fontWeight: "bold" }}>Stock en valeur (FCFA)</ span><i style={{fontSize:20,marginLeft:15,marginTop:30,cursor:"pointer"}} onClick={()=>setHide(!hide)} className={hide?"fa fa-eye-slash":"fa fa-eye"}/></Label>
                  <Input size="lg" style={{ fontSize: 23, marginBottom: 10, background: "content-box"}}  disabled defaultValue={capital} type={hide?"password":"text"} />
              </Col>:null
            }
          </Row>
        </div>
       <div>
        
        </div>
        <div className="n-produits">
          {!loadingCapital?<div style={{display:"flex",marginBottom:6,justifyContent:"flex-end"}}>
            <span>Total:</span><span style={{fontWeight:"bold"}}>{nbrProduit}</span>
          </div>:null}
            <Table striped hover responsive >
              <thead>
              <tr style={{ textAlign: 'center' }}>
                  <th >Image</th>
                  <th >Ref</th>
                  <th>Nom</th>
                  <th>Famille</th>
                  <th>Prix</th>
                  <th>Quantité</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {!loading?
                <>
                {produits.map((val,id)=>(
                  <tr style={{ textAlign:'center'}}>
                    <td style={{width: "10%"}}>
                    {/* <div style={{width:"14%",height:"14%"}}> */}
                      <img onClick={() => { handleOpenImage(val) }} style={{ borderImageWidth: 20, cursor: "pointer", width: "70%", height: 50 }} className="preview" src={val?.image ? "" + getApiUrl() + "/images/" + val?.image : getApiUrl() + "/images/default-image.png"} alt="" />
                    {/* </div> */}
                    </td>
                    <td style={{ width: "10%" }}><span>{val?.code ? val?.code : "No ref"}</span></td>
                    <td style={{ width: "20%" }}><span>{val?.designation}</span></td>
                    <td >{val.famille.nom}</td>
                    <td >{val.pa}</td>
                    <td ><span>{val.qte}</span></td>
                    <td ><span>{action(val)}</span></td>
                    
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
              <span style={{color:"black",marginRight:7}}>{produits?.length?1:0} à {number}- {next}</span>
              <span onClick={()=>handlePreview()} style={{fontSize:20,marginRight:5,color:"grey",cursor:"pointer"}} className="fa fa-chevron-left"></span>
              <span onClick={()=>handleNext()} style={{fontSize:20,color:"grey",cursor:"pointer"}} className="fa fa-chevron-right"></span>
            </Col>
          </Row>
        </div>
       
      </div>
    );
  };