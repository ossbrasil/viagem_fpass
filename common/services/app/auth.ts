import {HttpService} from "@/core/shared/http-service";
import {SignInForm} from "@/app/sign-in";

export class AuthAPI {
    constructor(private readonly httpService: HttpService) {}

    async login(form: SignInForm) {
        form.email = form.email.toLowerCase();
        try {
            const response = await this.httpService.post(
                {
                    subPaths: ['auth', 'login'],
                    auth: false,
                    options: {
                        body: JSON.stringify({...form})
                    },
                });
            if (!response.ok) return false;
            const authResponse = await response.json();
            this.httpService.setSession(JSON.stringify(authResponse));
            return true;
        } catch (e) {
        }
    }
    async logout() {
        this.httpService.setSession(null);
    }
}