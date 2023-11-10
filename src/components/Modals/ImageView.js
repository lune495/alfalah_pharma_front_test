import React from "react";
import { Button, Modal,
   ModalHeader, ModalBody,
    ModalFooter, Table,Col,
    Row, 
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    CardTitle,
   } from 'reactstrap';
// used for making the prop types of this component
import "./modal.css";
import { useState } from "react";
import { useEffect } from "react";
import logo from "../../assets/product.png"

function ImageView({toggle,url,show}) {

  useEffect(() => {
    },[]);

  return (
    <div>
   
    <Modal style={{padding:0}} className="my-modal" size="md" isOpen={show} toggle={toggle}>
      <ModalHeader  toggle={toggle}>{url?.name}</ModalHeader>
      {/* <ModalBody> */}
          <img style={{cursor:"pointer",width:"100%",height:"100%"}} className="preview" src={url?.url} alt="" />
      {/* </ModalBody> */}
     
    </Modal>
  </div>
  )

}

  export default ImageView;