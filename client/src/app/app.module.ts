import { BrowserModule} from '@angular/platform-browser';

import { NgModule , Component } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';

import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NoContentComponent } from './no-content/no-content.component';
import { ROUTES } from './app.routes';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { HttpService } from './services/data/http.service';
import { UserService } from './services/data/user.service';
import { CookieService } from 'angular2-cookie/core';
import { ReformatStringService } from './services/reformat.string.service';


@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        NoContentComponent
    ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        RouterModule.forRoot(ROUTES)
    ],
    providers: [
        { provide: APP_BASE_HREF, useValue: '/' }, // instead of <base href="/">

        HttpService,
        UserService,
        ReformatStringService,
        CookieService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}

