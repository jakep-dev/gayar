import { BasePage } from './base.page';
import { SeverityDataModel } from 'app/model/model';

export class SeverityTopPeerGroupLossesPage extends BasePage  {

    public static pageType:string = 'SeverityTopPeerGroupLossesPage';

    private prefix: string = SeverityTopPeerGroupLossesPage.pageType + '_';

    public getPrefix() {
        return this.prefix;
    }

    public setPrefix(prefix: string) {
        this.prefix = prefix;
        this.updatePdfContent();
    }

    public getPageType(): string {
        return SeverityTopPeerGroupLossesPage.pageType;
    }
    
    private headerStyle: any = {
        color: '#b1d23b',
        fontSize: 14,
        bold: true,
        margin: [ 60, 0, 40, 0]
    };

    private header: any = {
        text: 'Top Peer Group Losses',
        style: this.prefix + 'headerStyle'
    };
    
    private tableHeaderStyle: any = {
        color: '#464646',
        fontSize: 12,
        bold: true
    };

    private tableRowContentStyle: any = {
        color: '#464646',
        fontSize: 12
    };

    private tableRowContentDescriptionStyle: any = {
        color: '#464646',
        fontSize: 10
    };

    private table: any = {
        margin: [ 60, 20, 60, 0 ],
        table: {
            headerRows: 1,
            //widths: ['18%','18%','13%','18%','18%'],
            widths: ['24%', '23%', '13%', '17%', '23%'],
            body: [
                [
                    { text: 'Company Name', alignment: 'left', style: this.prefix + 'tableHeaderStyle', border: [true, true, false, true] },
                    { text: 'Type of Incident', alignment: 'left', style: this.prefix + 'tableHeaderStyle', border: [false, true, false, true] },
                    { text: 'Incident Date', alignment: 'left', style: this.prefix + 'tableHeaderStyle', border: [false, true, false, true] },
                    { text: 'Records Affected', alignment: 'left', style: this.prefix + 'tableHeaderStyle', border: [false, true, false, true] },
                    { text: 'Type of Loss', alignment: 'left', style: this.prefix + 'tableHeaderStyle', border: [false, true, true, true] }
                ]
            ]
        },
        pageBreak: 'after'
    };

    private pdfContent: Array<any> = [];

    public getPdfContent(): Array<any> {
        return this.pdfContent;
    }

    private styles: Array<any> = [];

    public getStyles(): Array<any> {
        return this.styles;
    }

    private images: Array<string> = [];

    public getImages(): Array<string> {
        return this.images;
    }

    private peerGroupData: Array<SeverityDataModel>

    constructor() {
        super();
        this.updatePdfContent();
    }

    private updatePdfContent() {

        this.header.style = this.prefix + 'headerStyle';
        this.table.table.body[0][0].style = this.prefix + 'tableHeaderStyle';
        this.table.table.body[0][1].style = this.prefix + 'tableHeaderStyle';
        this.table.table.body[0][2].style = this.prefix + 'tableHeaderStyle';
        this.table.table.body[0][3].style = this.prefix + 'tableHeaderStyle';
        this.table.table.body[0][4].style = this.prefix + 'tableHeaderStyle';

        let i: number;
        let n: number = this.table.table.body.length;
        let tableRow: any;
        for(i = 1; i < n; i++) {
            tableRow = this.table.table.body[i];
            if(i % 2 == 0) {
                tableRow[0].style = this.prefix + 'tableRowContentDescriptionStyle';
            } else {
                let j: number;
                for(j = 0; j < tableRow.length; j++) {
                    tableRow[j].style = this.prefix + 'tableRowContentStyle';
                }
            }
        }

        this.clearArray(this.styles);
        this.styles[this.prefix + 'headerStyle'] = this.headerStyle;
        this.styles[this.prefix + 'tableHeaderStyle'] = this.tableHeaderStyle;
        this.styles[this.prefix + 'tableRowContentStyle'] = this.tableRowContentStyle;
        this.styles[this.prefix + 'tableRowContentDescriptionStyle'] = this.tableRowContentDescriptionStyle;

        this.clearArray(this.pdfContent);
        this.pdfContent.push(this.header);
        this.pdfContent.push(this.table);
    }

    public setPeerGroupData(peerGroupData: Array<SeverityDataModel>) {
        this.peerGroupData = peerGroupData;
        this.table.table.body.length = 1;
        let i: number;
        let n: number = this.peerGroupData.length;
        let dataRow: any;
        let dataDescription: any;
        let companyName: string;
        let typeOfIncident: string;
        let incidentDate: string;
        let recordsAffected: string;
        let typeOfLoss: string;
        let caseDescription: string;

        for(i = 0; i < n; i++) {
            companyName = (this.peerGroupData[i].company_name != null) ? this.peerGroupData[i].company_name : '';
            typeOfIncident = (this.peerGroupData[i].type_of_incident != null) ? this.peerGroupData[i].type_of_incident : '';
            incidentDate = (this.peerGroupData[i].incident_date != null) ? this.peerGroupData[i].incident_date : '';
            incidentDate = incidentDate.substr(0,10).replace(/\-/g,'/');
            recordsAffected = (this.peerGroupData[i].records_affected != null) ? this.peerGroupData[i].records_affected : '';
            typeOfLoss = (this.peerGroupData[i].type_of_loss != null) ? this.peerGroupData[i].type_of_loss : '';
            caseDescription = (this.peerGroupData[i].case_description != null) ? this.peerGroupData[i].case_description : '';
            dataRow = [
                { text: companyName, alignment: 'left', style: this.prefix + 'tableRowContentStyle', border: [true, true, false, false] },
                { text: typeOfIncident, alignment: 'left', style: this.prefix + 'tableRowContentStyle', border: [false, true, false, false] },
                { text: incidentDate, alignment: 'left', style: this.prefix + 'tableRowContentStyle', border: [false, true, false, false] },
                { text: recordsAffected, alignment: 'left', style: this.prefix + 'tableRowContentStyle', border: [false, true, false, false] },
                { text: typeOfLoss, alignment: 'left', style: this.prefix + 'tableRowContentStyle', border: [false, true, true, false] }
            ];
            this.table.table.body.push(dataRow);
            dataDescription = [
                { text: caseDescription, colSpan: 5, style: this.prefix + 'tableRowContentDescriptionStyle', border: [true, false, true, true] }
            ];
            this.table.table.body.push(dataDescription);
        }
    }

    public isPageCountingRequired(): boolean {
        return true;
    }

    private pageCount: number = 0;

    public getPageCount(): number {
        return this.pageCount;
    }

    public setPageCount(pageCount: number) {
        this.pageCount = pageCount;
    }

};