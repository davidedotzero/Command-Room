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
