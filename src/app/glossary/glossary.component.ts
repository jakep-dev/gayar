import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuService, ApplicationService} from 'app/services/services';
import { GlossaryDataModel } from 'app/model/model';

@Component({
  selector: 'glossary',
  templateUrl: './glossary.component.html',
  styleUrls: ['./glossary.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GlossaryComponent implements OnInit {

  header: string = 'Glossary';
  terms: any;

  constructor(private menuService: MenuService,
    private applicationService: ApplicationService) {
    this.menuService.breadCrumb = 'Appendix';
  }

  ngOnInit() {
    this.loadGlossaryData();
  }

  loadGlossaryData() {
    this.applicationService.getGlossary()
      .subscribe((res: GlossaryDataModel) => {
        this.terms = res.glossaries;
      });
  }

}
