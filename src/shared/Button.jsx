import React, { useEffect, useState } from 'react';

const MyButton = ({type, title, disabled, icon, className, bold, size, handleClick, loading, style}) =>{
    return (
        <button style={style} type="button" disabled={disabled || loading}  onClick={handleClick} className={`${className}`}>
            {
                !loading 

                ?

                <>
                    {icon && (<span className="mr-1"><i className={`fa fa-${icon}`}></i></span>)}
                    <span style={{fontSize: size}} className="">{title}</span>
                </>

                :

                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            }
        </button>
      );
}

export const ButtonFilter = ({icon, name, active, size, handleClick, className}) =>{
    return (
            <button onClick={handleClick} className={ `${className}`}>
                {icon &&(<i className={`fa fa-${icon}`}></i>)} <span>{name}</span>
            </button>
        )
}

export default MyButton;