import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { UserService } from '../services/data/user.service';
import { NavigationCancel, Router } from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: [
        './home.component.css',
        '../global.styles.css'
    ]
})
export class HomeComponent implements OnInit {
    public users: User[] = [];

    constructor(
        public _userService: UserService,
        private _router: Router
    ) {
    }

    ngOnInit() {
        this.getUsers();

        /* fix width troubles - start */
            // резались карточки со стримами на Iphone 5 (w: 320px)
            let appHome = document.querySelector('app-home');
            appHome['style']['width'] = '100%';
            appHome['style']['display'] = 'block';
        /* fix width troubles - end */
    }

    // TODO: вынести в отделный сервис, чтобы этот метод можно было внедрять в другие страницы без копипаста
    public toggleLoadingBlock() {
        let loadingBlock = document.querySelector('._js_loadingBlock');
        loadingBlock.classList.toggle('loadingBlock--invisible');
    }

    public getUsers() {
        this.toggleLoadingBlock();
        this._userService.getAllUsers()
            .then((result) => {
                this.toggleLoadingBlock();
                this.users = result;
            })
            .catch((error) => {
                this.toggleLoadingBlock();
                console.log(error);
            })
    }
}
