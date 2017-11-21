import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { BaseService } from './base.service';

@Injectable()
export class GetFileService extends BaseService{

    //private fileData: string;

    private fileData = new BehaviorSubject<string>(null);
    public fileData$: Observable<string> = this.fileData.asObservable();

    constructor(http: Http) {
        super(http);
    }

    private setFontFile(fileName: string, base64Blob: string) {
        console.log(fileName + ' loaded.');
        this.fileData.next(base64Blob);
    }

    private convertBlob(fileName: string, blob: Blob) {
        let reader =  new FileReader();
        reader.readAsDataURL(blob);
        var callback = this.setFontFile.bind(this);

        reader.onloadend = async function() {
            var output = (await 
                (new Promise<string>(
                    (resolve, reject) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.onerror = reject;
                        reader.readAsDataURL(blob);
                    }
                    )
                )
            );
            callback(fileName, output);
        };
    }

    public getAsDataUrl(filePath: string) {
        console.log('Loading file:' + filePath);
        var convertBlob = this.convertBlob.bind(this);
        super.GetFile(filePath, null)
            .subscribe(blob => convertBlob(filePath, blob));
    }
    
}
