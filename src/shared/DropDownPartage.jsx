import { useState } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Table,
    Row,
    Col,
    Button,
    FormGroup,
    Input,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
  } from "reactstrap";


const DropDownPartage = ({color="warning",children,title}) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggle = () => setDropdownOpen((prevState) => !prevState);
  

	return (
		<Dropdown  isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle color={color} caret>
             {title}
            </DropdownToggle>
            <DropdownMenu container="body">
             {children}
            </DropdownMenu>
        </Dropdown>
	)
};
export default DropDownPartage;
