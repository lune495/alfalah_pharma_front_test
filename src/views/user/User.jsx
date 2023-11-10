import {useContext, useEffect, useState} from "react"
import "./User.css"

import { BusinessContext } from "../BusinessContext";
import { alert, getData,sendData, removeData, toastMsg } from "../../methodes";
import { Col,FormGroup, Input,Table, Label, Row } from "reactstrap";
import Select from 'react-select';
import BouttonGroup from "shared/Bouttons/BouttonGroup";
import CreateUser from "components/Modals/CreateUser";
import ModalConfirmation from "components/Modals/ModalConfirmation";


export  const User = () => {
    const [redirectProd,setRedirectProd] = useState(false);
    const [loading,setLoading] = useState(true);
    const [openAdd,setOpenAdd] = useState(false);
    const [loadingSave,setLoadingSave] = useState(false);
    const [isOpen,setIsOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({});
    const [userId,setUserId] = useState(null);
    const [users,setUsers] = useState([]);
    const context = useContext(BusinessContext);
    const [number,setNumber] = useState(0);
    const [page,setPage] = useState(10);
    const [next,setNext] = useState(1);
    const [isNext,setIsNext] = useState(true);
    

    const action=(val)=>{
      return (
       <> <span onClick={()=>updateUser(val)} style={{color:"blue",cursor:"pointer",fontSize:20,marginLeft:30,marginRight:10}} className="fa fa-pencil-square" ></span> <span onClick={()=>handleOpenModal(val)} style={{color:"red",fontSize:20,cursor:"pointer"}} className="fa fa-trash-alt" ></span> </>
      )
    }

    const onSubmit = async (post) => {
      setLoadingSave(true);
      await sendData(
        "api/register",
          post,
         )
        .then(async ({ data }) => {
          context.addState(
            "users",
             data?.user,
             post?.id?"update":"add"
           )
           toastMsg(
            post?.id?"Utilisateur modifié avec succès":"Utilisateur ajouté avec succès",
           "success")

          //  alert(
          //   post?.id?"Utilisateur modifié avec succès":"Utilisateur ajouté avec succès",
          //   "success"
          // );
          setOpenAdd(false)
  
        })
        .catch(({ response }) => {
          setLoadingSave(false);
          let violations = null;
          let apiErrors = { error: response?.data?.message };
          console.log("error",response)
          toastMsg(
            "Une erreur est survenue",
           "error")
          // alert(
          //   "Une erreur est survenue",
          //   "danger"
          // );
        });
  
      setLoadingSave(false);
    }

  

    const getUsersPaginated = async (count,page) => {
      setLoading(true)
      const { data } = await getData("graphql?query={userspaginated(count:"+count+",page:"+page+"){ metadata{current_page per_page} data{id name email role{nom}}}}");
      setNumber(
        data.data.userspaginated.data.length!==0?data.data.userspaginated.data.length:0
        )
        if(data.data.userspaginated.data.length){
          setIsNext(true)
        }else{
          setUsers([])
          setIsNext(false)
        }
        let datas=[]
      
      
        setUsers(data?.data?.userspaginated?.data)
  
        setLoading(false)
    };

    const handleRemove = async () => {
      setLoadingSave(true);
      await removeData("users/"+userId?.id)
        .then(({ data }) => {
          if(data.data){
            users(users?.filter((val)=>val.id!=userId?.id))
          }
          toastMsg(
           "Suppression effectuée avec succès",
           "success")
            // alert(`Suppression effectuée avec succès`, "success");
           setIsOpen(false)
        })
        .catch((err) => {
          setLoadingSave(false);
          toastMsg(
            "Impossible de supprimer cet utilisateur",
           "error")
          // alert(`Impossible de supprimer cet utilisateur`, "danger");
        });
      
    };
    const handleOpenModal=(prod)=>{
      setUserId(prod?.id)
      setIsOpen(true)
    }
    const updateUser=(data)=>{
      setForm({...data,role_id:data?.role?.id})
      setOpenAdd(true)
    }

   

    const handleNext=()=>{
      if(isNext){
      setNext(next+1)
      getUsersPaginated(page,next+1)
      }
    }
    const handlePage=(e)=>{
      setPage(e.value)
      getUsersPaginated(page,next)
    }
  
    const handlePreview=()=>{
      if(next-1>0){
        setNext(next-1)
        getUsersPaginated(page,next-1)
      }
      
    }

    useEffect(() => {
      getUsersPaginated(10,1)
    }, []);
   
  
    return (
      <div className="content n-produit" style={{paddingTop:15}}>

        <div style={{alignSelf:"flex-end",alignContent:"flex-end"}}>
           <BouttonGroup
              title2="Nouveau utilisateur"
              handle2={()=>{setForm({});setOpenAdd(true)}}
           />
            <ModalConfirmation
              show={isOpen}
              toggle={()=>setIsOpen(!isOpen)}
              save={()=>handleRemove()}
              loading={loadingSave}
            />
            {openAdd?
            <CreateUser
              show={openAdd}
              toggle={()=>setOpenAdd(!openAdd)}
              save={(data)=>onSubmit(data)}
              loading={loadingSave}
              user={form}
            />:null
           }
        </div>
        <div className="n-produit">
        <Table striped hover responsive>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {!loading?
                <>
                {users.map((val,id)=>(
                  <tr>
                    <td >{val?.name}</td>
                    <td >{val?.role?.nom}</td>
                    <td >{action(val)}</td>
                    
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
              <span style={{color:"black",marginRight:7}}>{users?.length?1:0} à {number} - {next}</span>
              <span onClick={()=>handlePreview()} style={{fontSize:20,marginRight:5,color:"grey",cursor:"pointer"}} className="fa fa-chevron-left"></span>
              <span onClick={()=>handleNext()} style={{fontSize:20,color:"grey",cursor:"pointer"}} className="fa fa-chevron-right"></span>
            </Col>
          </Row>
          </div>

      </div>
    );
  };