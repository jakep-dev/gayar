import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuService, ApplicationService, SessionService} from 'app/services/services';
import { GlossaryDataModel } from 'app/model/model';
import { Router } from '@angular/router';

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
    private applicationService: ApplicationService,
    private sessionService: SessionService,
    private router: Router) {
    this.menuService.breadCrumb = 'Appendix';
  }

  ngOnInit() {
    this.checkPermission();
    this.loadGlossaryData();
  }

  checkPermission() {
    let permission = this.sessionService.getUserPermission();
    if(permission && permission.glossary && (!permission.glossary.hasAccess)) {
      this.router.navigate(['/noAccess']);
    }
  }

  loadGlossaryData() {
    this.applicationService.getGlossary()
      .subscribe((res: GlossaryDataModel) => {
        this.terms = res.glossaries;
      });
  }

}
