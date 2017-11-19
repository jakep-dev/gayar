import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { BaseService } from './base.service';

@Injectable()
export class FontService extends BaseService{

    private fontNameMapping = {
        CenturyGothic: {
            normal: 'gothic-regular.ttf',
            bold: 'gothic-bold.ttf',
            bolditalics: 'gothic-bold-italic.ttf',
            italics: 'gothic-italic.ttf'
        }
    };

    public getFontNames(): any {
        return this.fontNameMapping;
    }

    private fonts: any = {};

    public getFontFiles(): any {
        return this.fonts;
    }

    constructor(http: Http) {
        super(http);
        this.loadFontFiles();
    }

    private setFontFile(fileName: string, base64Blob: string) {
        this.fonts[fileName] = base64Blob;
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
            callback(fileName, output.substr(35));
        };
    }

    private getAsDataUrl(baseUrl: string, fontFileName: string) {
        console.log('Loading font file:' + baseUrl + fontFileName);
        var convertBlob = this.convertBlob.bind(this);
        super.GetFile(baseUrl + fontFileName, null)
        .subscribe(blob => convertBlob(fontFileName, blob));

    }

    private loadFontFiles() {
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
