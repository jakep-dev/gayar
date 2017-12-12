import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuService, GlossaryService } from 'app/services/services';
import { GlossaryDataModel } from 'app/model/model';

@Component({
  selector: 'glossary',
  templateUrl: './glossary.component.html',
  styleUrls: ['./glossary.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GlossaryComponent implements OnInit {

  header: string = 'Appendix';
  terms: any;

  constructor(private menuService: MenuService,
    private glossaryService: GlossaryService) {
    this.menuService.breadCrumb = 'Glossary';
  }

  ngOnInit() {
    this.loadGlossaryData();
  }

  loadGlossaryData() {
    this.glossaryService.getGlossary()
      .subscribe((res: GlossaryDataModel) => {
        this.terms = res.glossaries;
      });
  }

}
