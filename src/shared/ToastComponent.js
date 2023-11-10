import { ToastContainer } from "react-toastify";

const ToastComponent=()=>{
    return(<>
      
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
       />
    <ToastContainer />
          </>)
}
export default ToastComponent;

