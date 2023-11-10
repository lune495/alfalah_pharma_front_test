
export default function BouttonGroup({handle1,handle2,icon="plus",title1,title2}) {

    return(
        <div style={{flexDirection:"row",
        marginBottom:10,
        alignSelf:"flex-end",
        alignContent:"flex-end",
        alignItems:"flex-end",}}>
        <button style={{
            borderRadius:10,
            backgroundColor:"#1cba36",
            color:"white",
            borderColor:"#28fa6e",
            height:45,
            alignContent:"flex-end",
            alignItems:"flex-end",
            marginRight:8
            }}
            onClick={()=>handle2()}
            >
            <i style={{ marginRight:8}} className={"icon-sidebar fa fa-"+icon}></i>{title2}
        </button>
        

        {  
            title1?
            <button style={{
                borderRadius:10,
                height:45,
                borderColor:"#7d3ce6",
                color:"white",
                backgroundColor:"#6107f0",
                marginRight:10,
                alignContent:"flex-end",
                alignItems:"flex-end",

                }}
                onClick={()=>handle1()}
                >
                <i style={{ marginRight:8}} className={`icon-sidebar fa fa-print`}></i>{title1}
            </button>:null
        }
         
         
        </div>
    )

}