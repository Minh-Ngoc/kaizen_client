import { toast } from "react-toastify";

function NotifyMessage(title, type) {
    return toast[type](
        title, {
            position: "top-right",
            autoClose: 2000,
        }
    );
}

export default NotifyMessage;