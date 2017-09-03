import { Component, OnInit, Input } from '@angular/core';
import { User } from '../models/user.model';
import { UserService } from '../services/data/user.service';
import {
    NavigationCancel,
    Router,
    ActivatedRoute,
    ParamMap
} from '@angular/router';
import { ArrayService } from '../services/array.service';
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
    public filteredUsers: User[] = [];

    public indexUserToUpdate: number;
    public prevStateUserToUpdate: User;
    @Input() public userToWrite: User;

    writeActive: boolean = false;
    // modes: 'edit', 'add'
    private mode: string;

    public notifyText: string;
    public isUsersTableMinimized: boolean = false;
    @Input() public searchValue: string;
    public activeTab: string;

    constructor(
        public _userService: UserService,
        public _arrayService: ArrayService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.getUsers();

        console.log( 'parsed Url is : ', this._router.url, this._router.parseUrl( this._router.url ) );


        this._activatedRoute.params.subscribe( (params: ParamMap) => {
            this.activeTab = params['tab'];
            if ( !this.activeTab )
                this._router.navigate(['/home', { tab: 'people' }]);
            console.log( 'current tab is : ', this.activeTab );
        })

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
        this.userToWrite = new User();
        this.toggleLoadingBlock();
        this._userService.getAllUsers()
            .then((result) => {
                this.toggleLoadingBlock();
                this.users = result;
                this.filteredUsers = result;
            })
            .catch((error) => {
                this.toggleLoadingBlock();
                console.log(error);
            })
    }

    public addUser( userToWrite: User ) {
        this._userService.addUser( userToWrite )
            .then((user) => {
                this.notify('User was successfully created.', 'green');
                this.users.unshift( user );
                this.userToWrite = new User();
            })
            .catch((error) => {
                this.notify('Validation error', 'red');
                console.log(error);
            })
    }

    public startEdit( user: User, userIndex: number ) {
        this.indexUserToUpdate = userIndex;
        this.prevStateUserToUpdate = JSON.parse( JSON.stringify( user ));
        this.userToWrite = user;
        this.writeActive = true;
        this.mode = 'edit';
    }
    public startAdd() {
        this.writeActive = true;
        this.mode = 'add';
    }
    public cancelWrite() {
        this.userToWrite = new User();
        // this.users[ this.indexUserToUpdate ] = this.prevStateUserToUpdate;
        this.writeActive = false;
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

    public filterUsers() { // sv - search value
        let sv: string = this.searchValue.toLowerCase();
        this.filteredUsers = _.filter( this.users, (user: User) => {
            let expression: boolean = user.name_first.toLowerCase().indexOf( sv ) > -1 ||
                user.name_last.toLowerCase().indexOf( sv ) > -1 ||
                user.skill.name.toLowerCase().indexOf( sv ) > -1;
            return expression;
            //  || sv == user.name_last || sv == user.skill.name
        });
    }

    public setTab( tabName: string ) {
        this.activeTab = tabName;
        // this._router.navigate(['/home', { tab: tabName }]);
        this._router.navigate(['/home', { tab: tabName }]);
    }
}
