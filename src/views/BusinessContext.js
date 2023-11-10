import React from "react";
import { getData, sendData } from "../methodes";

const BusinessContext = React.createContext();

export default class BusinessProvider extends React.Component {
	state = {
		showAlert: false,
		loading: true,
		loadingReload:false,
		users: [],
		roles: [],
		clients: [],
		fournisseurs: [],
		clients_select: [],
		fournisseurs_select: [],
		categories:[],
		top_clients:[],
		top_ventes:[],
		stocks:[],
		liste_appro:[],
		produits:[],
		boutique:[],
		familles:[],
		init: true,
		countData:[
			{label:10,value:10 },
			{label:50,value:50 },
			{label:100,value:100 },
			{label:200,value:200 },
			{label:500,value:500 },
			{label:1000,value:1000 },
			{label:10000,value:10000 }
		   ]
	};



	getUsers = async () => {
		const { data } = await getData("graphql?query={userspaginated(count:10,page:1){ metadata{current_page per_page} data{id name email role{nom}}}}");
		console.log("users",data)
		this.setState({ users: data?.data?.userspaginated.data });
	};

	
	getRoles = async () => {
		let datas=[]
		const { data } = await getData("graphql?query={roles{id nom}}");
		console.log("data roles",data)
		data?.data?.roles.map((val,id)=>{
            datas.push({label:val.nom,value:parseInt(val.id)})    
			this.setState({ roles:datas });
		 })
		
	};

	getClients = async () => {
		let datas=[]
		const { data } = await getData("graphql?query={clients{id email adresse telephone nom_complet}}");
		console.log("data client",data)
		this.setState({ clients:data?.data?.clients })
		data?.data?.clients.map((val,id)=>{
            datas.push({label:val.nom_complet,value:parseInt(val.id),id:val?.id})    
			this.setState({ clients_select:datas });
		 })
		
	};

	getFournisseurs = async () => {
		let datas=[]
		const { data } = await getData("graphql?query={fournisseurs{id adresse telephone nom_complet}}");
		console.log("data fournisseurs",data)
		this.setState({ fournisseurs:data?.data?.fournisseurs })
		data?.data?.fournisseurs.map((val,id)=>{
            datas.push({label:val.nom_complet,value:parseInt(val.id),id:data?.id})    
			this.setState({ fournisseurs_select:datas });
		 })
		
	};

	getCategories = async () => {
		let datas=[]
		const { data } = await getData("graphql?query={familles{id nom}}");
		this.setState({ familles: data?.data?.familles });
		data?.data?.familles.map((val,id)=>{
            datas.push({label:val.nom,value:val.id,id:data?.id})    
			this.setState({ categories:datas });
		 })
		 console.log("famille",data?.data)
	};

	 action=()=>{
		return (
		 <> <span style={{color:"blue",cursor:"pointer",fontSize:20,marginLeft:30,marginRight:10}} className="fa fa-pencil-square" ></span> <span style={{color:"red",cursor:"pointer",fontSize:20}} className="fa fa-trash-alt" ></span> </>
		)
	  }

	getProduits = async () => {
		let datas=[]
		const { data } = await getData("graphql?query={produits{id capital designation limite pa qte pv depots{stock} famille{ id nom} }}");
		this.setState({ boutique: data?.data?.produits });
		data?.data?.produits?.map((val,id)=>{
			datas.push({label:val?.designation,value:val?.id,id:data?.id})
			this.setState({ produits: datas });
		})
		console.log("produits",data)
	};

	 getStocks = async () => {
     
      const { data } = await getData("graphql?query={depots{id limite  stock pa produit{designation id} }}");
      this.setState({ stocks: data?.data?.depots });
       
    };

	 getVentes = async () => {
		const { data } = await getData("graphql?query={ventes{id created_at vente_produits{qte total produit{designation} }  montant montantencaisse qte monnaie user { id name} }}");
		this.setState({ ventes: data?.data?.ventes });
	    console.log("ventes",data?.data?.ventes)
	
	};

	getListeApro = async () => {
		const { data } = await getData("graphql?query={approvisionnements{id montant qte_total_appro fournisseur{nom_complet} created_at ligne_approvisionnements{quantity_received  produit{designation} }  user { id name} }}");
		this.setState({ liste_appro: data?.data?.approvisionnements });
	    console.log("approvisionnements",data?.data?.approvisionnements)
	
	};


	getTopClient = async () => {
		const { data } = await getData("api/top_meilleur_client");
		this.setState({ top_clients:data, });
	    console.log("top client",data)
	
	};
	getTopProduit = async () => {
		const { data } = await getData("api/top_produit_vendu");
		this.setState({top_ventes:data });
	    console.log("top client",data)
	
	};

	

	// getNotifs = async () => {
	// 	const { data } = await getData("notifications");
	// 	this.setState({
	// 		notifs: data
	// 			? data
	// 			: {
	// 					confirmed: false,
	// 					toPickup: false,
	// 					atPickup: false,
	// 					pickedUp: false,
	// 					toDropoff: false,
	// 					atDropoff: false,
	// 					delivered: false,
	// 					canceled: false,
	// 			  },
	// 	});
	// };

	setCardId = (id) => {
		this.setState({ cardId: id });
	};

	stateAction = (state, value, type) => {
		let saved = this.state[state];
		if (type === "clear") {
			saved = [];
		} else if (type === "add") {
			saved = [...saved, value];
		} else if (type === "update") {
			const index = saved.findIndex((v) =>v.id == value.id);
            console.log(state,"index",index)
			saved[index] = value;
		} else if (type === "update-appro") {
			const index = saved.findIndex((v) =>v.id == value.produit_id);
			saved[index].qte = parseInt(value.quantite)+ parseInt(saved[index]?.qte);
		}
		 
		else {
			saved = saved.filter((v) => v.id != value);
		}

		this.setState({ [state]: saved });
	};

	stateReloadAction = async(type) => {
		if (type === "reload-vente") {
			this.setState({loadingReload:true})
			await (
				this.getVentes()
			)
			this.setState({loadingReload:false})
		} else if (type === "reload-boutique") {
			this.setState({loadingReload:true})
			await (this.getProduits())
			this.setState({loadingReload:false})
		} else if (type === "reload-stock") {
			this.setState({loadingReload:true})
			await (this.getStocks())
			this.setState({loadingReload:false})
		}
	}

	async initState() {
		this.setState({ init: true,});
			await (
			this.getUsers(),
			this.getClients(),
			this.getTopClient(),
			this.getTopProduit(),
			// this.getListeApro(),
			this.getRoles(),
			this.getFournisseurs(),
			// this.getVentes(),
			this.getCategories(),
			this.getProduits(),
			this.getStocks());

		this.setState({ init: false,loading:false });
	}


	componentDidMount() {
		this.initState();
	}

	render() {
		// return this.state.init ? (
		// 	<div>Chargement...</div>
		// ) :
		return (
			<div>
				<BusinessContext.Provider
					value={{
						users: this.state.users,
						loading: this.state.loading,
						loadingReload:this.state.loadingReload,
						roles: this.state.roles,
						clients: this.state.clients,
						clients_select: this.state.clients_select,
						fournisseurs: this.state.fournisseurs,
						fournisseurs_select: this.state.fournisseurs_select,
						categories: this.state.categories,
						familles: this.state.familles,
						liste_appro: this.state.liste_appro,
						stocks: this.state.stocks,
						top_clients: this.state.top_clients,
						top_ventes: this.state.top_ventes,
						ventes: this.state.ventes,
						produits: this.state.produits,
						boutique: this.state.boutique,
						countData:this.state.countData,
						addState: this.stateAction,
						setReload: this.stateReloadAction
					}}>
					{this.props.children}
				</BusinessContext.Provider>
			</div>
		);
	}
}

export { BusinessContext };
