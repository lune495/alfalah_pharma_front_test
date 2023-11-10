import {useContext, useEffect, useState} from "react"
import "./Setting.css"
import { BusinessContext } from "../BusinessContext";
import { alert, getData, removeData, sendData, toastMsg } from "../../methodes";
import { Col,FormGroup, Input,Table, Label, Row } from "reactstrap";
import Select from 'react-select';
import BouttonGroup from "shared/Bouttons/BouttonGroup";
import CreateFounisseur from "components/Modals/CreateFournisseur";
import ModalConfirmation from "components/Modals/ModalConfirmation";




export  const Fournisseur = ({clients}) => {
    const [redirectProd,setRedirectProd] = useState(false);
    const [open,setOpen] = useState(false);
    const [loading,setLoading] = useState(false);
    const [openAdd,setOpenAdd] = useState(false);
    const [loadingSave,setLoadingSave] = useState(false);
    const [errors,setErrors] = useState({});
    const [famille,setFamille] = useState([]);
    const [form,setForm] = useState({});
    const context = useContext(BusinessContext);
    const [isOpen,setIsOpen] = useState(false);
    const [number,setNumber] = useState(10);
    const [page,setPage] = useState(10);
    const [next,setNext] = useState(1);
    const [isNext,setIsNext] = useState(true);


    const onSubmit = async (post) => {

      setLoadingSave(true);
      setErrors({});
      await sendData(
         "api/fournisseurs",
         post,
         )
        .then(async ({ data }) => {
          console.log("foun",data)
          if(post?.id){
            refresh(data,"update")
          }else{
            refresh(data,"add")
          }
          context.addState(
              "fournisseurs",
               data,
               post?.id?"update":"add"
          )
          context.addState(
            "fournisseurs_select",
             {label:data?.nom_complet,value:data?.id,id:data?.id},
             post?.id?"update":"add"
          )
          setOpenAdd(false)
          toastMsg(
            post?.id?"Client modifié avec succès":"Client ajoute avec succès",
          "success")
         
          // alert(
          //   post?.id?"Client modifié avec succès":"Client ajoute avec succès",
          //   "success"
          // );
        })
        .catch(({ response }) => {
          setLoadingSave(false);
          // alert(
          //  "Une erreur est survenue",
          //   "danger"
          // );
          toastMsg(
            "Une erreur est survenue",
            "error")
        });
  
        setLoadingSave(false);
    }
    const action=(val)=>{
      return (
       <> <span onClick={()=>handleOpenModal(val)} style={{color:"blue",cursor:"pointer",fontSize:20,marginLeft:30,marginRight:10}} className="fa fa-pencil-square" ></span> <span onClick={()=>handleOpenConfirmModal(val)} style={{color:"red",fontSize:20,cursor:"pointer"}} className="fa fa-trash-alt" ></span> </>
      )
    }
    const handleRemove = async () => {
      setLoadingSave(true)
      await removeData("api/fournisseurs/"+form?.id)
        .then(({ data }) => {
          refresh(form?.id,"remove")
          setOpen(false)
          context.addState(
            "fournisseurs",
             form?.id,
             "remove"
        )
        context.addState(
          "fournisseurs_select",
           {label:data?.nom_complet,value:data?.id,id:data?.id},
           "remove"
        )
          // alert(`Suppression effectuée avec succès`, "success");
          toastMsg(
            "Suppression effectuée avec succès",
            "success")
        })
        .catch((err) => {
          setLoadingSave(false)
          toastMsg(
            "Vous ne pouvez pas effectuer cette suppression",
            "error")
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
    const refresh=(data,type)=>{
      var last=famille
      if(type=="remove"){ 
        const filter=last.filter((val)=>val?.id!=data)
        setFamille(filter)
      }else if(type=="add"){
        last.push(data)
        setFamille(last)
      }
      else{
        const index = last.findIndex((v) =>v.id == data.id);
        last[index]=data
      }
    }
    const getClients = async (count,page) => {
      let datas=[]
      setLoading(true)
      const { data } = await getData("graphql?query={fournisseurspaginated(count:"+count+",page:"+page+"){ metadata{current_page per_page} data{id email adresse telephone nom_complet}}}");
      console.log("client",data)
      setNumber(
        data.data.fournisseurspaginated.data.length!==0?data.data.fournisseurspaginated.data.length:0
        )
        if(data.data.fournisseurspaginated.data.length){
          setIsNext(true)
        }else{
          setFamille([])
          setIsNext(false)
        }
        data.data.fournisseurspaginated.data?.map((val,id)=>{
        datas.push(val)
        setFamille(datas)
      })
      setLoading(false)
    };

    const handleNext=()=>{
      if(isNext){
        setNext(next+1)
        getClients(page,next+1)
      }
      
    }
    const handlePage=(e)=>{
      setPage(e.value)
      getClients(e.value,next)
    }
  
    const handlePreview=()=>{
      if(next-1>0){
        setNext(next-1)
        getClients(page,next-1)
      }
      
    }

    useEffect(() => {
      getClients(10,1)
    }, []);
   
  
    return (
      <div className="n-produit">
       
        <div style={{alignSelf:"flex-end",alignContent:"flex-end"}}>
           <BouttonGroup
              title2="Nouveau fournisseur"
              handle2={()=>{setOpenAdd(true);setForm({})}}
           />
            <ModalConfirmation
              show={open}
              toggle={()=>setOpen(!open)}
              save={()=>handleRemove()}
              loading={loadingSave}
           />
            {openAdd?
            <CreateFounisseur
              show={openAdd}
              toggle={()=>setOpenAdd(!openAdd)}
              save={(data)=>onSubmit(data)}
              loading={loadingSave}
              fournisseur={form}
            />:null
           }
        </div>
        <div className="n-produit">
        <Table striped hover responsive>
              <thead>
                <tr>
                  <th>Nom & Prenom</th>
                  <th>Téléphone</th>
                  <th>Email</th>
                  <th>Adresse</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {!loading?
                <>
                {famille.map((val,id)=>(
                  <tr>
                    <td>{val.nom_complet}</td>
                    <td>{val.telephone}</td>
                    <td>{val.email}</td>
                    <td>{val.adresse}</td>
                    <td>
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