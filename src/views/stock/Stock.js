import {useContext, useEffect, useState} from "react"
import "./NewStock.css"
import { getData,sendData,alert, removeData, toastMsg } from "../../methodes";
import { BusinessContext } from "../BusinessContext";
import { Col,FormGroup, Input,Table, Label, Row } from "reactstrap";
import Select from 'react-select';
import BouttonGroup from "shared/Bouttons/BouttonGroup";
import CreateStock from "components/Modals/CreateStock";
import ModalConfirmation from "components/Modals/ModalConfirmation";



export const Stock = () => {
    const [redirectProd,setRedirectProd] = useState(false);
    const [redirectAp,setRedirectAp] = useState(false);
    const [produits,setProduits] = useState([]);
    const [loading,setLoading] = useState(true);
    const [form, setForm] = useState({});
    const [openAdd,setOpenAdd] = useState(false);
    const [loadingSave,setLoadingSave] = useState(false);
    const [produitId,setProduitId] = useState(null);
    const [isOpen,setIsOpen] = useState(false);
    const context = useContext(BusinessContext);
    const [number,setNumber] = useState(10);
    const [page,setPage] = useState(10);
    const [next,setNext] = useState(1);
    const [isNext,setIsNext] = useState(true);

    const action=(val)=>{
      val["produit_id"]=val?.produit?.id
      return (
       <> <span onClick={()=>updateProduct(val)} style={{color:"blue",cursor:"pointer",fontSize:20,marginLeft:30,marginRight:10}} className="fa fa-pencil-square" ></span> <span onClick={()=>handleOpenModal(val)} style={{color:"red",cursor:"pointer",fontSize:20}} className="fa fa-trash-alt" ></span> </>
      )
    }

    const onSubmit = async (post) => {
      setLoadingSave(true);
      await sendData(
        "api/depots",
          post,
         )
        .then(async ({ data }) => {
          console.log("response",data)
          context.addState(
            "stocks",
             data,
             post?.id?"update":"add"
           )
          addNewStock(data,post)
          toastMsg(post?.id?"Stock modifié avec succès":"Stock ajouté avec succès","success")
           
          //  alert(
          //   post?.id?"Stock modifié avec succès":"Stock ajouté avec succès",
          //   "success"
          // );
           setOpenAdd(false)
  
        })
        .catch(({ response }) => {
          setLoadingSave(false);
          console.log("error",response)
          toastMsg("Une erreur est survenue","error")

          // alert(
          //   "Une erreur est survenue",
          //   "danger"
          // );
        });
  
        
    }

    const addNewStock=(val,post)=>{
      if(post.id){
        const index = produits.findIndex((v) =>v.id == val.id);
        produits[index]=val
      }else{
        produits.unshift(val)
      }
      setProduits(produits)

    }
    
    const getProduits = async (count,page) => {
      let datas=[]
      setLoading(true)
      const { data } = await getData("graphql?query={depotspaginated(count:"+count+",page:"+page+"){ metadata{current_page per_page} data{id limite  stock pa produit{designation id} }}}");
      setNumber(
        data.data.depotspaginated.data.length!==0?data.data.depotspaginated.data.length:0
        )
        if(data.data.depotspaginated.data.length){
          setIsNext(true)
        }else{
          setProduits([])
          setIsNext(false)
        }
   
      setProduits(data.data.depotspaginated.data)

      setLoading(false)
    };

    const handleRemove = async () => {
      setLoadingSave(true);
      await removeData("api/depots/"+produitId?.id)
        .then(({ data }) => {
          if(data.data){
            setProduits(produits?.filter((val)=>val.id!==produitId?.id))
          }
          toastMsg("Suppression effectuée avec succès","success")

          // alert(`Suppression effectuée avec succès`, "success");
          setIsOpen(false)
        })
        .catch((err) => {
          setLoadingSave(false);
          toastMsg("Impossible de supprimer","error")
          // alert(`Impossible de supprimer`, "danger");
        });
      
    };

    const handleOpenModal=(prod)=>{
      setProduitId(prod)
      setIsOpen(true)
    }

    const updateProduct=(data)=>{
      setForm(data)
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
      <div className="content n-produit" style={{paddingTop:15}}>
         
        <div style={{alignSelf:"flex-end",alignContent:"flex-end"}}>
           <BouttonGroup
          //  title1="Approvisionner"
           title2="Ajouter stock"
          //  handle1={()=>setRedirectAp(true)}
           handle2={()=>{setForm({});setOpenAdd(true)}}
           />
           <ModalConfirmation
              show={isOpen}
              toggle={()=>setIsOpen(!isOpen)}
              save={()=>handleRemove()}
              loading={loadingSave}
            />
           {openAdd?
              <CreateStock
                show={openAdd}
                toggle={()=>setOpenAdd(!openAdd)}
                save={(data)=>onSubmit(data)}
                loading={loadingSave}
                stock={form}
            />:null
            }
        </div>
        <div className="n-produit">
          <Table striped hover responsive>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Prix</th>
                  <th>Quantité</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {!loading?
                <>
                {produits.map((val,id)=>(
                  <tr>
                    <td>{val?.produit?.designation}</td>
                    <td>{val.pa}</td>
                    <td>{val.stock}</td>
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
              <span style={{color:"black",marginRight:7}}>{produits?.length?1:0} à {number} - {next}</span>
              <span onClick={()=>handlePreview()} style={{fontSize:20,marginRight:5,color:"grey",cursor:"pointer"}} className="fa fa-chevron-left"></span>
              <span onClick={()=>handleNext()} style={{fontSize:20,color:"grey",cursor:"pointer"}} className="fa fa-chevron-right"></span>
            </Col>
          </Row>
          </div>
      </div>
    );
  };