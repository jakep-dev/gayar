import { ComponentPrintSettings } from 'app/model/model';
import { IChartWidget } from 'app/model/report.model';

export abstract class BasePage {

    //page type name for this page
    public static pageType:string = 'BasePage';

    constructor() {
    }

    /**
     * get the page type for the current page of the assessment report
     * 
     * @public
     * @function getPageType
     * @return {string} - page type for the current page of the assessment report.
     */
    public getPageType(): string {
        return BasePage.pageType;
    }
    
    /**
     * get the page prefix for the current page of the assessment report
     * Page prefixes prevent json object names from one page don't clash with other pages
     * 
     * @public
     * @function getPrefix
     * @return {string} - page prefix for the current page of the assessment report.
     */
    public getPrefix(): string {
        return '';
    }

    /**
     * Setter function to set the prefix for this page
     * 
     * @public
     * @function setPrefix
     * @param {string} prefix - prefix use for this page
     * @return {} - No return types.
     */
    public setPrefix(value: string) {}

    /**
     * get the chart component size within the page object
     * This allows the page object to tell the report component 
     * that a chart in a given position needs to have a specific
     * width and height in order to be display properly within 
     * the pdf page
     * 
     * @public
     * @function getPrintSettings
     * @param {number} componentOrder - the position within the page object
     * @return {ComponentPrintSettings} - ComponentPrintSettings object that contains information on the width and height allocated to show the image
     */
    public getPrintSettings(componentOrder: number) : ComponentPrintSettings {
        return {
            width: 0,
            height: 0,
            drillDown: ''
        };
    }

    /**
     * Adds the given chart to a specific position within the underlying page object
     * returns the page number the chart is added to
     * For most pages, it shoult all be on the first page
     * 
     * @public
     * @function addChartLabel
     * @param {number} index - page position within the page object
     * @param {string} chartName - chart name
     * @param {string} chartDataUrl - png image data in string format
     * @return {number} - the page number the chart is added to
     */
    public addChartLabel(index: number, chartName: string, chartDataUrl: string): number { 
        //For most pages, it shoult all be on the first page
        return 1;
    }

    /**
     * get the pdf content array for the assessment report
     * 
     * @public
     * @function getPdfContent
     * @return {Array<any>} - array of json objects for the assessment report.
     */
    public getPdfContent(): Array<any> {
        return [];
    }

    /**
     * get the style array for the assessment report
     * 
     * @public
     * @function getStyles
     * @return {Array<any>} - Associative array of styles for the assessment report.
     */
    public getStyles(): Array<any> {
        return [];
    }

    /**
     * get the images array for the assessment report
     * 
     * @public
     * @function getImages
     * @return {Array<string>} - Associative array of images for the assessment report.
     */
    public getImages(): Array<string> {
        return [];
    }

    /**
     * Clears the contents of the input array 
     * Array can be an associative array or regular array
     * This utility function is used on subclasses of BasePage to clean up unused data
     * 
     * @public
     * @function clearArray
     * @param {Array<any} array - arbitrary array
     * @return {} - No return types.
     */
    public clearArray(array: Array<any>) {
        array.length = 0;
        for(let item in array) {
            delete array[item];
        }
    }

    /**
     * get the number of pages that this page object will be render out to the final pdf
     * 
     * @public
     * @function getPageCount
     * @return {number} - the number of pages that this page object will be render out to the final pdf
     */
    public getPageCount(): number {
        return 1;
    }

    /**
     * get boolean value to indicate if page counting 
     * via pdf rendering is required.  
     * Defaults to false, which means the page object renders 
     * all in one page or have a way to keep track of the 
     * number of pages without pdf rendering
     * If true, only pdf rendering can determine the number of pages
     * 
     * @public
     * @function isPageCountingRequired
     * @return {boolean} - value to indicate if pdf rendering is needed to determine page count
     */
    public isPageCountingRequired(): boolean {
        return false;
    }

    /**
     * set the number of pages that this page object will be render out to the final pdf
     * 
     * @public
     * @function setPageCount
     * @param {number} pageCount - the number of pages that this page object will be render out to the final pdf
     * @return {} - No return types.
     */
    public setPageCount(pageCount: number) {
    }

    /**
     * Tell the underlying page to shoe or hide the header
     * 
     * @public
     * @function showHeader
     * @param {boolean} isShowHeader - true to show header, false to hide header
     * @return {} - No return types.
     */
    public showHeader(isShowHeader: boolean) {
    }

    /**
     * set the caption text for this chart object will be render out to the final pdf
     * 
     * @public
     * @function setChartCaption
     * @param {number} chartPosition - the position within the page object
     * @param {string} captionText - caption text for the chart image
     * @return {} - No return types.
     */
    public setChartCaption(chartPosition: number, captionText: string) {
    }
}