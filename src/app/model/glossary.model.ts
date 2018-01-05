import { ResponseModel } from "./response.model";

export interface GlossaryTerm{
    letter: string;
    definition: string;
    term: string;
    link: string;
    subComponents: Array<GlossarySubTerm>;
}

export interface GlossaryDataModel {
    glossaries: Array<GlossaryTerm>;
    response : ResponseModel;
}

export interface GlossarySubTerm{
    term: string;
    definition: string;
    type: string;
}
