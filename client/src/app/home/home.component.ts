import { Component, OnInit, Input } from '@angular/core';
import { User } from '../models/user.model';
import { UserService } from '../services/data/user.service';
import { NavigationCancel, Router } from '@angular/router';
import * as _ from 'lodash';

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
    public indexUserToUpdate: number;
    public prevStateUserToUpdate: User;
    @Input() public userToUpdate: User;
    private editMode: boolean = false;
    public notifyText: string;
    public isUsersTableMinimized: boolean = false;

    constructor(
        public _userService: UserService,
        private _router: Router
    ) {}

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

    // TODO: вынести в отделный сервис, чтобы этот метод можно было внедрять в другие страницы без копипаста
    public notify( text: string = 'Notification', color: string = 'black', duration: number = 3000 ) {
        let colors: Array<string> = [ 'black', 'red', 'green', 'yellow', 'blue', 'purple' ];
        let notifyBlock = document.querySelector('._js_notifyBlock');

        this.notifyText = text;
        notifyBlock.classList.toggle('notifyBlock--invisible');

        _.forEach( colors, _color => {
            notifyBlock.classList.remove('notifyBlock--' + _color);
        });
        notifyBlock.classList.add('notifyBlock--' + color);

        setTimeout(() => {
            notifyBlock.classList.toggle('notifyBlock--invisible');
            notifyBlock.classList.toggle('notifyBlock--' + color);
        }, duration);
    }

    public getUsers() {
        this.userToUpdate = new User();
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

    public addUser() {
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

    public startEdit( user: User, userIndex: number ) {
        this.indexUserToUpdate = userIndex;
        this.prevStateUserToUpdate = JSON.parse( JSON.stringify( user ));
        this.userToUpdate = user;
        this.editMode = true;
    }
    public cancelEdit() {
        this.userToUpdate = new User();
        // this.users[ this.indexUserToUpdate ] = this.prevStateUserToUpdate;
        this.editMode = false;
    }
    public updateUser( user: User ) {
        this._userService.updateUser( user, user.idUser )
            .then((user) => {
                this.notify('User was successfully updated.', 'green');
            })
            .catch((error) => {
                console.log(error);
                this.notify('Server error while user updating.', 'red');
            })
    }

    public deleteUser( userId: string, userIndex: number ) {
        this._userService.deleteUser( userId )
            .then((result) => {
                this.users.splice(userIndex, 1);
                this.notify('User was successfully deleted.', 'green');
            })
            .catch((error) => {
                console.log(error);
                this.notify('Server error while user deleting.', 'red');
            })
    }

    public toggleTable() {
        this.isUsersTableMinimized = !this.isUsersTableMinimized;
    }
}
