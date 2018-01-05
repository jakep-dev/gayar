import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SessionService } from 'app/services/session.service';
import { ResponseModel} from 'app/model/response.model';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private sessionService: SessionService,
              private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authReq = request.clone({headers: request.headers.set('Authorization', this.sessionService.Token)});
    return next.handle(authReq).do(event => {
          if (event instanceof HttpResponse) {
              const resp:ResponseModel = event.body.resp as ResponseModel || null;
              if(resp &&
                 resp.code !== 200) {
                  this.router.navigate([`/${resp.code}`]);
              }
          }
    }, err => {
      this.router.navigate(['/error']);
    });
  }
}
