import { Injectable } from "@angular/core";
import { LanguageModel } from "../model/language.model";

@Injectable()
export class LanguageService {
  languages : Array<LanguageModel> = new Array<LanguageModel>();

   constructor() {
     this.languages.push(
       {name: "Українська", code: "ua"},
       {name: "Русский", code: "ru"}
     );
   }

   getLanguages(){
     return this.languages;
   }
 }
