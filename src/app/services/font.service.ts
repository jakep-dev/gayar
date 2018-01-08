import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { BaseServiceClient } from 'app/services/base.service.client';

@Injectable()
export class FontService extends BaseServiceClient {

    private fontNameMapping = {
        CenturyGothic: {
            normal: 'GOTHIC.TTF',
            bold: 'GOTHICB.TTF',
            bolditalics: 'GOTHICBI.TTF',
            italics: 'GOTHICI.TTF'
        }
    };

    public getFontNames(): any {
        return this.fontNameMapping;
    }

    private fonts: any = {
    };

    private fontFileCount = 4;
    private fontFilesLoaded = 0;

    public isLoadComplete(): boolean {
        return this.fontFileCount == this.fontFilesLoaded;
    }

    private loadCompleted = new BehaviorSubject<boolean>(false);
    public loadCompleted$: Observable<boolean> = this.loadCompleted.asObservable();

    public getFontFiles(): any {
        return this.fonts;
    }

    constructor(http: HttpClient) {
        super(http);
    }

    private setFontFile(fileName: string, base64Blob: string) {
        this.fonts[fileName] = base64Blob;
        this.fontFilesLoaded++;
        this.loadCompleted.next(this.isLoadComplete());
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
            //IE have a different data url.  it has an extra character set parameter
            //Firefox and Chrome don't have this parameter
            //Only common reference point is to locate 'base64,' and get all the data after it
            callback(fileName, output.substr(output.indexOf('base64') + 7));
        };
    }

    private getAsDataUrl(baseUrl: string, fontFileName: string) {
        var convertBlob = this.convertBlob.bind(this);
        super.Get<Blob>(baseUrl + fontFileName, null, 'Blob')
        .subscribe(blob => convertBlob(fontFileName, blob));

    }

    public loadFontFiles() {
        for (let fontFamily in this.fontNameMapping) {
            for (let font in this.fontNameMapping[fontFamily]) {
                let file = this.fontNameMapping[fontFamily][font];
                if (file && typeof this.fonts[file] === 'undefined') {
                    this.getAsDataUrl('/assets/fonts/pdf/', file);
                }
            }
        }
    }

}
