import { ResponseModel } from "./response.model";

export interface GlossaryModel{
    letter: string;
    definition: string;
    term: string;
    link: string;
    subComponents: Array<SubComponentData>;
}

export interface GlossaryDataModel {
    glossaries: GlossaryModel;
    response : ResponseModel;
}

export interface SubComponentData{
    term: string;
    definition: string;
    type: string;
}
