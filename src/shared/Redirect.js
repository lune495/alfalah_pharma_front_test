import { Redirect} from "react-router-dom";

const Redirection = ({link,isRedirect}) => {
	return (
		isRedirect?
        <Redirect to={link} />:null
	)
};
export default Redirection;
