import {JWTException, SessionException} from "@/core/exceptions/exceptions";
import Toast from "react-native-root-toast";

export class ExceptionHandler {
    static handle(error: any | unknown) {
        let message = '';
        if (error instanceof SyntaxError && error.message.includes('JSON')) {
            //console.error('Error occurred during JSON parsing', error);
        } else if (error instanceof SessionException || error instanceof JWTException) {
            message = 'Voce esta deslogado!';
            //console.error('Session exception', error);
        } else if (error instanceof TypeError) {
            message = 'Houve uma falha na conexão!';

            //console.error('Network Error', error);
        } else {
            console.error(error);
            message = 'Something went wrong';
        }
        if (message) {
            console.log(message);
            const toast = Toast.show(message, {
                duration: Toast.durations.LONG,
                position: Toast.positions.BOTTOM,
            });
            setTimeout(function hideToast() {
                Toast.hide(toast);
            }, 5000);
        }
    }
}