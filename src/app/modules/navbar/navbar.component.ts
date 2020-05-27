import { Component, OnInit, Inject, HostListener, Input } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Input() Theme: string;

  DOCUMENT: Document;
  constructor(@Inject(DOCUMENT) document, public translate: TranslateService) {
    this.DOCUMENT = document;
    if (!this.Theme) {
      this.Theme = 'black';
    }
  }

  ngOnInit() { }
}
