import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { Form,Input,Button,Label,FormGroup, Col, Row } from "reactstrap";
import { getData } from "../methodes";
import Select from 'react-select';
import { useContext } from "react";
import { format } from "date-fns";
import { BusinessContext } from "./BusinessContext";
import CardColumn from "components/Card/CardColumn";
import CardRowSmall from "components/Card/CardRowSmall";
import CardRow from "components/Card/CardRow";

var _ = require("lodash");

const Dashboard = (props) => {
	const [value, setValue] = useState({
		nb_vente_jour: 0,
		nb_vente_mois: 0,
		nb_vente_annee: 0,
		Caventeannee: 0,
		Caventejour: 0,
		Caventemois: 0,
		Caproduit:0,
		Cajour:0,
		Cahier:0,
		Camois: 0,
		Camoisdernier: 0

	});
	const [dashboard, setDashboard] = useState({
		nb_vente_jour: 0,
		nb_vente_mois: 0,
		nb_vente_annee: 0,
		Caventeannee: 0,
		Caventejour: 0,
		Caventemois: 0,
		Caproduit:0,
		Cajour:0,
		Cahier:0,
		Camois:0,
		Camoisdernier:0

	});
	
	const [loading, setLoading] = useState(false);
	const [showByDate, setShowByDate] = useState(false);
	const [form, setForm] = useState({});
	const [caProduit, setCaProduit] = useState({});
	const [selectProduit, setSelectProduit] = useState([]);
	const [param, setParam] = useState(2022);
	const context = useContext(BusinessContext);

	const color="#2b6afc"
	const options=[
		{label:"Tout",value:"tout",text:"le jours",ex:" exemple:10/03/2022"},
		{label:"Jours",value:"date_day",text:"le jours",ex:" exemple:10/03/2022"},
		{label:"Mois",value:"date_month",text:"le mois",ex:"exemple:2"},
		{label:"Année",value:"date_year",text:"l'année",ex:"exemple:2022"},
		{label:"Chiffre affaire / produit",value:"produit",text:"l'année",ex:"exemple:2022"},
	]

	const handleFiltre= async (attr)=>{
		setLoading(true)
        const { data } = await getData("graphql?query={dashboards("+attr+": \""+param+"\") { Caventemois Caventeannee Caventejour Cajour Cahier Camois Camoisdernier Caproduit}}");
		setValue(data?.data?.dashboards[0])
		if(param==2022){
			setDashboard(data?.data?.dashboards[0])
		 }
		
		console.log("search prod",data)
		setLoading(false)

    }

	const handleFiltreByProduct= async (attr)=>{
		setLoading(true)
        const { data } = await getData("graphql?query={dashboards("+attr+": "+param+") { Caventemois Caventeannee Caventejour Cajour Cahier Camois Camoisdernier Caproduit}}");
		setValue(data?.data?.dashboards[0])
		setLoading(false)

    }

	const handleChooseProduct= async (attr1,attr2,attr3)=>{
		const filtre="graphql?query={dashboards("+attr1+": "+caProduit?.produit_id+","+attr2+": \""+caProduit?.date_start+"\","+attr3+": \""+caProduit?.date_end+"\") {Caproduit Caventemois Caventeannee Caventejour Cajour Cahier Camois Camoisdernier}}"
		setLoading(true)
        const { data } = await getData(filtre);
		setValue(data?.data?.dashboards[0])
		console.log("search interval filtre",filtre)
		console.log("search interval data",data?.data?.dashboards[0])
		setLoading(false)

    }

	const handleFilterByDate=()=>{
		setShowByDate(true)
		console.log("ca produit",caProduit)
		if(caProduit?.produit_id && caProduit?.date_start && caProduit?.date_end ){
			handleChooseProduct("produit_id","date_start","date_end")
			setParam(2022)
		}else{
			setParam(caProduit?.produit_id)
			handleFiltreByProduct("produit_id")
		}
	}

	

	const handleFilter=(e)=>{
		setForm(e)
		setParam(2022)
		if(e?.value!="produit"){
			setShowByDate(false)
			setCaProduit({})
		}
		 if(e?.value=="tout"){
			setForm({})
			handleFiltre("date_year")
		}
		
		
	}

	const handleSearch=()=>{
		handleFiltre(form?.value)
	}

	useEffect(() => {
		let data=[]
		handleFiltre("date_year")
		setSelectProduit(context?.produits)

	  }, []);


	return (
		<div className="content">
		

		
	   <Row style={{marginBottom:10,marginTop:30}}>
	    <Col md="12">
             <h5>Top 5 produits vendu</h5>
			{context?.top_ventes.map((val,id)=>(
				<div key={id} style={{marginBottom:10,margin:10}}>
					<CardRowSmall
					price={val?.montant+" fcfa"}
					title={val?.designation}
					/>
				</div>
			))
			
            }
			 
			 
			 
			 
        </Col>

		

	   </Row>
		

		</div>
	);
};
export default Dashboard;
