import { createPortal } from "react-dom";

function DeleteProjectModal() {
    return createPortal(
        <>
            <p>DELLETE</p>
            <p>DELLETE</p>
            <p>DELLETE</p>
            <p>DELLETE</p>
            <p>DELLETE</p>
            <p>DELLETE</p>
            <p>DELLETE</p>
            <p>DELLETE</p>
            <p>DELLETE</p>
            <p>DELLETE</p>
            <p>DELLETE</p>
        </>,
        document.getElementById("modal-root")!
    );
}

export default DeleteProjectModal;
