import { getApiUrl, sendData } from "../../methodes";
import React, { useContext, useState } from "react";
import MyButton from "shared/Button";
import ErrorMsg from "shared/ErrorMsg";

import "./Login.css";
import Redirection from "shared/Redirect";
import { Card, Col, Input, Label, Row } from "reactstrap";

export default function Login(props) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [show, setShow] = useState(false);
	const [form,setForm] = useState({role_id:3});
    const [hide,setHide] = useState(true);


	const onSubmit = async () => {
		console.log("login equest",form)
		setError(false);
		setLoading(true);
		await sendData("api/login", form)
			.then(({data}) => {
				localStorage.setItem("user_alfalah_data", JSON.stringify(data))
				// window.location.reload(false);
				setShow(true)
				console.log("login response",data)
			})
			.catch((error) => {
				setError(true)
				console.log("login err",error.response.data)
			     }
				);
		setLoading(false);
	};

	return (
		<div style={{overflow:"hidden",height:"100%",backgroundColor:"#007fff"}} className='b2c-login2'>
		 <Redirection link="admin/dashboard" isRedirect={show}/>
			{/* <Navbar show={true} signin={true} /> */}
		 <Row >
			{/* <Col md={6}>
				<div style={{display:"flex",justifyContent:"center"}}>
					<img  style={{width:"99%",height:"99%", cursor: "pointer"}} className="preview" src={ getApiUrl() + "/images/image_auth.png"} alt="" />
				</div>
			</Col> */}
			<Col md={2}>
			</Col>
			<Col md={8} style={{padding:100}}>
			<Card style={{padding:30,marginTop:-70}} className="card-chart">
			<div style={{display:"flex",padding:-20,justifyContent:"center"}}>
				<h2 style={{color:"#007fff"}}>CONNEXION</h2>
				{/* <img  style={{width:200,height:200, cursor: "pointer"}} className="preview" src={require("assets/img/medecin2-opacity.png")} alt="" /> */}
			</div>
			<ErrorMsg hide={()=>setError(false)} show={error} errorMsg={"Email ou mot de passe incorrecte"} />
			<div className='form-group'>
				<label>Email</label>
				<input
					name='email'
					type='text'
					onChange={e=>setForm({...form,email:e.target.value})}
					placeholder='email'
					className='input-sign-type'
				/>
			</div>
			<div  className='form-group'>
				<label>Mot de passe</label>
				<input
				    style={{height:20}}
					name='password'
					type={hide?"password":"text"}
					onChange={e=>setForm({...form,password:e.target.value})}
					placeholder='password'
					className='input-sign-type'
				/>
				<div style={{display:"flex",marginTop:-50,marginRight:10,justifyContent:"flex-end"}}><span style={{marginTop:-20}}><i style={{fontSize:25,marginTop:-20,marginLeft:15,marginTop:30,cursor:"pointer"}} onClick={()=>setHide(!hide)} className={hide?"fa fa-eye-slash":"fa fa-eye"}/></span></div>
			</div>
			<div className='row mt-auto'>
				<div className='col-12'>
					<MyButton
						className='continu_button_type my-bg-dark'
						loading={loading}
						handleClick={onSubmit}
						title={"Se connecter"}
					/>
				   </div>
				 </div>
			   </Card>

			  </Col>
			  <Col md={2}>
			</Col>
			</Row>
		</div>
	);
}
