import { Component, OnInit } from '@angular/core';
import { ReformatStringService } from './shared/reformat.string.service';
import { CasinoService } from './shared/casino.service';
import { TOP_CASINOS__MAX, RANDOM_CASIOS__AMOUNT } from './shared/constants';
import { Casino } from './models/casino';
import { CookieService } from 'angular2-cookie/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { IBreadcrumb } from 'app/models/breadcrumb';
import 'rxjs/add/operator/filter';
import * as _ from 'lodash';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: [
        './app.component.css',
        './global.styles.css'
    ]
})
export class AppComponent implements OnInit {
    public title = 'app';
    public casinos: Casino[] = [];
    public topCasinos: Casino[] = [];
    public randomCasinos: Casino[] = [];
    public breadcrumbs: IBreadcrumb[] = [];
    public sub: Subscription;

    constructor(
        private _casinoService: CasinoService,
        private _cookieService: CookieService,
        private _router: Router,
        public reformatStringService: ReformatStringService
    ) {}

    public ngOnInit() {
        this.sub = this._router.events
            .filter(event => event instanceof NavigationEnd).subscribe(event => {
                window.scrollTo(0, 0);
                this.generateBreadcrumbs(event);
                // set breadcrumbs
                // let root: ActivatedRoute = this.activatedRoute.root;
                // this.breadcrumbs = this.getBreadcrumbs(root);
        });
        this.getAllCasinos();

        /* fix width troubles - start */
            // резались карточки со стримами на Iphone 5 (w: 320px)
            let appRoot = document.querySelector('app-root');
            appRoot['style']['width'] = '100%';
            appRoot['style']['display'] = 'block';
        /* fix width troubles - end */
    }

    public isAdmin(): boolean {
        // return new RegExp(/admin/).test(window.location.href);
        return !!this._cookieService.getObject('admin') && new RegExp(/admin/).test(window.location.href);
    }

    public getAllCasinos() {
        this._casinoService.getAllCasinos()
            .then((casinos) => {
                this.casinos = JSON.parse( JSON.stringify(casinos) );

                this.randomCasinos = JSON.parse( JSON.stringify(casinos) );
                this.randomCasinos = this.randomCasinos
                    .sort(() => 0.5 - Math.random()).slice(0, RANDOM_CASIOS__AMOUNT);

                // this.topCasinos = [];
                // _.map(casinos, el => el.position < TOP_CASINOS__MAX && this.topCasinos.push(el) );
                this.topCasinos = _.filter(casinos, (casino) => casino.position < TOP_CASINOS__MAX);
                
                // debug
                    // console.log(' \n casinos \n ', casinos);
                    // console.log(' \n this.casinos \n ', this.casinos);
                    // console.log(' \n this.randomCasinos \n ', this.randomCasinos);
                // end - debug
            })
            .catch((error) => {
                console.log(error);
            })
    }

    public onCasinoNavigate (casino: Casino) {
        this._casinoService.selectedCasinoId = casino.id;
    }

    public generateBreadcrumbs (event: any) {
        this.breadcrumbs = [
            {
                label: 'Home',
                url: ''
            }
        ];
        const uri = event.url.replace(/^(\/)*|home|casino(\/)|stream(\/)|(\/)*$/g, '');
        if (uri) {
            this.breadcrumbs[0].url = '/home';
            const urls = uri.split('/');
            for (let i = 0; i < urls.length; i++) {
                let url = (this.breadcrumbs[i - 1]) ? '/' + this.breadcrumbs[i - 1].url + '/' + urls[i] : '/' + urls[i];
                if (i === urls.length - 1) {
                    url = '';
                }
                this.breadcrumbs.push({
                    label: urls[i].toUpperCase(),
                    url: url
                })
            }
        }
    }

    public toggleSidebar(): void {
        document.querySelector('._js_sidebar').classList.toggle('sidebar--opened');
        document.querySelector('._js_btnSwowSidebar').classList.toggle('btnSwowSidebar--movedLeft');
        document.querySelector('._js_closeSidebar').classList.toggle('closeLayer--active');
    }

    private compare(a, b) {
        if (a.position < b.position) {
            return -1;
        }
        if (a.position > b.position) {
            return 1;
        }
        return 0;
    }
}
