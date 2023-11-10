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
import { useState } from "react";
import { useEffect } from "react";

function Item({toggle,detail,prof,show}) {

  useEffect(() => {
    console.log("detail",detail)
    },[]);

  return (
    <div style={{
        backgroundColor: '#F0F0F0',
       //   paddingTop:15,FA
         padding:10,
         margin:7,
         marginLeft:15,
         marginRight:25,
         borderRadius: 10,
         flexDirection:"row",
         alignItems:"center",
         justifyContent:"space-between",
         shadowOpacity:12,
         shadowColor: "#000",
         shadowOffset: {
           width: 0,
           height: 2,
         },
         shadowOpacity: 0.25,
         shadowRadius: 3.84,
   
         elevation: 5,
         
       }}>
      test
    </div>
  )

}


  export default Item;