import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { BaseServiceClient } from 'app/services/base.service.client';

@Injectable()
export class GetFileService extends BaseServiceClient {
    private fileData = new BehaviorSubject<string>(null);
    public fileData$: Observable<string> = this.fileData.asObservable();

    constructor(http: HttpClient) {
        super(http);
    }

    private setFileData(fileName: string, base64Blob: string) {
        this.fileData.next(base64Blob);
    }

    private convertBlob(fileName: string, blob: Blob) {
        let reader =  new FileReader();
        reader.readAsDataURL(blob);
        var callback = this.setFileData.bind(this);

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
        var convertBlob = this.convertBlob.bind(this);
        super.Get<Blob>(filePath, null)
            .subscribe(blob => convertBlob(filePath, blob));
    }
    
}
