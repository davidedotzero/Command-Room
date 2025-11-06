import Swal from "sweetalert2";

export const ErrorAlertDetailed = (text: string, detail: string) => {
    Swal.fire({
        icon: 'error',
        title: "Error!",
        timer: 3000,
        timerProgressBar: true,
        html: `
            ${text} <br /><br />
            <button 
                onclick="document.getElementById('error-details').classList.toggle('hidden')"
                class="text-blue-500 hover:underline mb-2"
            >
                Show Details
            </button>
            <textarea 
                id="error-details" 
                class="hidden w-full h-32 border border-gray-300 rounded-md text-sm p-2"
                readonly
            >${detail}
            </textarea>
        `
    });
}

export const SuccessAlert = (text: string) => {
    Swal.fire({
        icon: 'success',
        title: "Success!",
        text: text,
        timer: 3000,
        timerProgressBar: true,
    });
}

export const ConfirmAlert = async (text: string) => {
    return Swal.fire({
        icon: 'warning',
        title: "Are you sure?",
        text: text,
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm"
    });
}

export const InfoToast = (text: string) => {
    Swal.fire({
        text: text,
        position: "bottom-end",
        toast: true,
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        customClass: {
            popup: '!rounded-md !border !border-blue-500 !bg-blue-200 !text-blue-900'
        },
        showClass: {
            popup: 'none'
        },
        hideClass: {
            popup: 'swal2-hide'
        },
        didOpen: (toast) => {
            toast.addEventListener('click', Swal.close);
        }
    });
}

export const ErrorToast = (text: string) => {
    Swal.fire({
        text: text,
        position: "bottom-end",
        toast: true,
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        customClass: {
            popup: '!rounded-md !border !border-red-500 !bg-red-200 !text-red-900'
        },
        showClass: {
            popup: 'none'
        },
        hideClass: {
            popup: 'swal2-hide'
        },
        didOpen: (toast) => {
            toast.addEventListener('click', Swal.close);
        }
    });
}

export const NotificationToast = (text: string) => {
    Swal.fire({
        text: text,
        position: "bottom-end",
        toast: true,
        timer: 120000,
        timerProgressBar: true,
        showConfirmButton: false,
        customClass: {
            popup: '!rounded-md !border !border-yellow-500 !bg-yellow-200 !text-yellow-900 !hover:cursor-pointer'
        },
        showClass: {
            popup: 'none'
        },
        hideClass: {
            popup: 'swal2-hide'
        },
        didOpen: (toast) => {
            toast.addEventListener('click', Swal.close);
        }
    });
}
