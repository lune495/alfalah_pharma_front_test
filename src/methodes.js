import axios from "axios";
import Toast from "./Toast";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const apiUrl = "http://localhost/alfalah_pharma_back/public";
// const apiUrl = "http://45.63.94.164/alfalah_pharma_back";
// const apiUrl = "http://144.202.100.33";
const baseUrl = ""
const webUrl = ""
const pass=localStorage.getItem("user_alfalah_data") 

export const getBaseUrl = () => { 
	return baseUrl;
};

export const getWebUrl = () => {
	return webUrl;
};

export const getApiUrl = () => {
	return apiUrl;
};

// axios.interceptors.request.use((config) => {
// 	if (keycloak.login && !config.url.includes("/public/")) {
// 		const cb = () => {
// 			config.headers.Authorization = `Bearer ${keycloak.token}`;
// 			return Promise.resolve(config);
// 		};

// 		return updateToken(cb);
// 	}else{
// 		return config
// 	}
// });

export var sendData = (route, dataBody, type) => {
	
	const customConfig = {
		headers: {
		'Authorization':'Bearer '+JSON.parse(pass)?.token,
		}
	};
	return axios[type ? type : "post"](`${apiUrl}/${route}`, dataBody,customConfig);
};

export var getData = (route, config) => {
	const customConfig = {
		headers: {
		'Authorization':'Bearer '+JSON.parse(pass)?.token,
		}
	};
	console.log("token",JSON.parse(pass)?.token)
	return axios.get(`${apiUrl}/${route}`, customConfig);
};
export var removeData = (route) => {
	const customConfig = {
		headers: {
		'Authorization':'Bearer '+JSON.parse(pass)?.token,
		}
	};
	return axios.delete(`${apiUrl}/${route}`,customConfig);
};

export const alert = (mess, type) => {
	new Toast({
		message: mess,
		type: type,
	});
};

export const toastMsg = (mess, type) => {
	toast?.[type](mess, {
		position: "top-right",
		autoClose: 5000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "light",
		});

		
};

export const getPhoneNumber = (value) => {
	value = value.replace(/ /g, "");
	return value.startsWith("+1") ? value.slice(2) : value;
};

export const getRandomInt = (max) => {
	return Math.floor(Math.random() * Math.floor(max));
};

export const classicDate = (date) => {
	let dated = new Date(date);

	return `${new Date(dated).toLocaleDateString("fr-FR")}
       à ${dated.toLocaleTimeString("fr-FR")}`;
};

export const simpleDate = (date) => {
	let dated = new Date(date);
	return `${new Date(dated).toLocaleDateString("en-US", {
		year: "numeric",
		month: "numeric",
		day: "numeric",
	})}`;
};

export var createFormData = (formData, key, data) => {
	if (data === Object(data) || Array.isArray(data)) {
		for (var i in data) {
			createFormData(formData, key + "[" + i + "]", data[i]);
		}
	} else {
		formData.append(key, data);
	}
};

export var FormatFCFA = (value, sign) => {
	if (sign) {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(value);
	} else {
		return new Intl.NumberFormat("en-US").format(value).replace(" ", ".");
	}
};
