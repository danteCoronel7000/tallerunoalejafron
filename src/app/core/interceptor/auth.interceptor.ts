import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "../../auth/services/auth.service";

export function tokenInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn){
      // No agregar token si estamos esta lista de endpoints
    const skipAuth = ['/login', '/register', '/public'];

    if (skipAuth.some(url => req.url.includes(url))) {
    return next(req);
        }
        
    const authenticationService = inject(AuthService);
    if(authenticationService.getToken()){
        req = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${authenticationService.getToken()}`)
        })
    }
    return next(req)

}