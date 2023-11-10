import {useContext, useEffect, useState} from "react"
import "./Setting.css"
import { BusinessContext } from "../BusinessContext";
import { alert, getData, removeData, sendData, toastMsg } from "../../methodes";
import { Col,FormGroup, Input,Table, Label, Row } from "reactstrap";
import Select from 'react-select';
import BouttonGroup from "shared/Bouttons/BouttonGroup";
import CreateCategorie from "components/Modals/CreateCategorie";
import ModalConfirmation from "components/Modals/ModalConfirmation";

export  const Categorie = () => {
    const [redirectProd,setRedirectProd] = useState(false);
    const [open,setOpen] = useState(false);
    const [openAdd,setOpenAdd] = useState(false);
    const [loading,setLoading] = useState(false);
    const [loadingSave,setLoadingSave] = useState(false);
    const [errors,setErrors] = useState({});
    const [famille,setFamille] = useState([]);
    const [form,setForm] = useState({});
    const context = useContext(BusinessContext);
    const [isOpen,setIsOpen] = useState(false);
    const [number,setNumber] = useState(0);
    const [page,setPage] = useState(10);
    const [next,setNext] = useState(1);
    const [isNext,setIsNext] = useState(true);

    const onSubmit = async (post) => {
      console.log("data send ",post)
      setLoadingSave(true);
      setErrors({});
      await sendData(
         "api/familles",
         post,
         )
        .then(async ({ data }) => {
          
          getCategoriesPaginated(10,1)
          context.addState(
              "familles",
               data,
               form?.id?"update":"add"
          )
          context.addState(
            "categories",
             {label:data?.nom,value:data?.id,id:data?.id},
             post?.id?"update":"add"
          )
          setOpenAdd(false)
         
          // alert(
          //   post?.id?"Catégorie modifié avec succès":"Catégorie ajoute avec succès",
          //   "success"
          // );
          toastMsg(post?.id?"Catégorie modifié avec succès":"Catégorie ajoute avec succès","success")

        })
        .catch(({ response }) => {
          setLoading(false);
          // alert(
          //  "Une erreur est survenue",
          //   "danger"
          // );
          toastMsg("Une erreur est survenue","error")
        });
        setLoadingSave(false);
    }
    const handleRemove = async () => {
      setLoadingSave(true)
      await removeData("api/familles/"+form?.id)
        .then(({ data }) => {
          setOpen(false)
          refresh(form?.id,"remove")
          context.addState(
            "familles",
             form?.id,
             "remove"
        )
        context.addState(
          "categories",
           {label:data?.nom,value:data?.id,id:data?.id},
           "remove"
        )
        toastMsg("Suppression effectuée avec succès","success")
          
          // alert(`Suppression effectuée avec succès`, "success");
          
        })
        .catch((err) => {
          setLoadingSave(false)
          toastMsg("Vous ne pouvez pas effectuer cette suppression","danger")
          // alert(`Vous ne pouvez pas effectuer cette suppression`, "danger");
        });
      
    };

    const handleOpenModal=(val)=>{
      setForm(val)
      setOpenAdd(true)
    }

    const handleOpenConfirmModal=(val)=>{
      setForm(val)
      setOpen(true)
    }

    // const getCategories = async () => {
    //   console.log("cat",context?.familles)
    //   setFamille(context?.familles)
    // };
    
    const getCategoriesPaginated = async (count,page) => {
      setLoading(true)
      const { data } = await getData("graphql?query={famillespaginated(count:"+count+",page:"+page+"){ metadata{current_page per_page} data{id nom}}}");
      setNumber(
        data.data.famillespaginated.data.length!==0?data.data.famillespaginated.data.length:0
        )
        if(data.data.famillespaginated.data.length){
          setIsNext(true)
        }else{
          setFamille([])
          setIsNext(false)
        }
        setFamille(data.data.famillespaginated.data)
  
        setLoading(false)
    };
  
    const refresh=(data,type)=>{
      var last=famille
      if(type=="remove"){ 
        const filter=last.filter((val)=>val?.id!=data)
        setFamille(filter)
      }
    }

    const handleNext=()=>{
      if(isNext){
        setNext(next+1)
        getCategoriesPaginated(page,next+1)
      }
      
    }
    const handlePage=(e)=>{
      setPage(e.value)
      getCategoriesPaginated(e.value,next)
    }
  
    const handlePreview=()=>{
      if(next-1>0){
        setNext(next-1)
        getCategoriesPaginated(page,next-1)
      }
      
    }

    useEffect(() => {
      getCategoriesPaginated(10,1)
    }, []);
   
  
    return (
      <div className="n-produit">
       
        <div style={{alignSelf:"flex-end",alignContent:"flex-end"}}>
           <BouttonGroup
              title2="Nouvelle Famille"
              handle2={()=>{setOpenAdd(true);setForm({})}}
           />
           <ModalConfirmation
            show={open}
            toggle={()=>setOpen(!open)}
            save={()=>handleRemove()}
            loading={loadingSave}
           />
           {openAdd?
            <CreateCategorie
              show={openAdd}
              toggle={()=>setOpenAdd(!openAdd)}
              save={(data)=>onSubmit(data)}
              loading={loadingSave}
              categorie={form}
            />:null
           }
        </div>
        <div className="n-produit">
           <Table striped hover responsive>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Nom</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {!loading?
                <>
                {famille.map((val,id)=>(
                  <tr>
                    <td>12/01/2020</td>
                    <td>{val.nom}</td>
                    <td >
                    <> <span onClick={()=>handleOpenModal(val)} style={{color:"blue",cursor:"pointer",fontSize:20,marginLeft:30,marginRight:10}} className="fa fa-pencil-square" ></span> <span onClick={()=>handleOpenConfirmModal(val)} style={{color:"red",fontSize:20,cursor:"pointer"}} className="fa fa-trash-alt" ></span> </>
                    </td>
                    
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
              <span style={{color:"black",marginRight:7}}>{famille?.length?1:0} à {number} - {next}</span>
              <span onClick={()=>handlePreview()} style={{fontSize:20,marginRight:5,color:"grey",cursor:"pointer"}} className="fa fa-chevron-left"></span>
              <span onClick={()=>handleNext()} style={{fontSize:20,color:"grey",cursor:"pointer"}} className="fa fa-chevron-right"></span>
            </Col>
          </Row>
            
        </div>
      </div>
    );
  };