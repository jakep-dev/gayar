import { ResponseModel } from "./response.model";

export interface GlossaryModel{
    letter: string;
    terms: Array<GlossaryTermsData>;
}

export interface GlossaryDataModel {
    glossaries: GlossaryModel;
    response : ResponseModel;
}

export interface GlossaryTermsData{
    title: string;
    text: string;
}