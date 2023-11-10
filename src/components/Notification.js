import React from "react";
import { useEffect } from "react";
import NotificationAlert from "react-notification-alert";



export default function Notification({message,type,place,refresh}) {
    const notificationAlert = React.useRef();

    const notify = (place="tl",type="succes") => {
      var options = {};
      options = {
        place: place,
        message: (
          <div>
            <div>
              {message}
            </div>
          </div>
        ),
        type: type,
        icon: "nc-icon nc-bell-55",
        autoDismiss: 7
      };
      notificationAlert.current.notificationAlert(options);
    };



    useEffect(() => {
        notify(message,place,type)
    }, [refresh]);
  
  


return(
    <div className="content">
        <NotificationAlert ref={notificationAlert} />
    </div>
)


}