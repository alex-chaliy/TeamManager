import { Component, OnInit } from '@angular/core';
import { Stream } from '../models/stream';
import { StreamService } from '../shared/stream.service';
import {NavigationCancel, Router} from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: [
        './home.component.css',
        '../global.styles.css'
    ]
})
export class HomeComponent implements OnInit {
    public streams: Stream[] = [];
    public shadowedStreams = [];

    constructor(
        public streamService: StreamService,
        private _router: Router
    ) {
    }

    ngOnInit() {
        this.streamService.currentStreamPage = 0;
        this.getAllShadowedStreams();

        /* fix width troubles - start */
            // резались карточки со стримами на Iphone 5 (w: 320px)
            let appHome = document.querySelector('app-home');
            appHome['style']['width'] = '100%';
            appHome['style']['display'] = 'block';
        /* fix width troubles - end */
    }

    public toggleLoadingBlock() {
        let loadingBlock = document.querySelector('._js_loadingBlock');
        loadingBlock.classList.toggle('loadingBlock--invisible');
    }

    public getStreams() {
        this.toggleLoadingBlock();
        this.streamService.getAllStreams()
            .then((result) => {
                this.toggleLoadingBlock();
                const streams = result
                    .filter((s) => !this.shadowedStreams
                        .find((ss) => ss.excepted_id === s.idStream));
                this.streams = (this.streams.length > 0) ? this.streams.concat(streams) :
                    streams;
            })
            .catch((error) => {
                this.toggleLoadingBlock();
                console.log(error);
            })
    }

    public getAllShadowedStreams () {
        this.streamService.getShadowedStreamIdS()
            .then((streams) => {
                this.shadowedStreams = streams;
                this.getStreams();
            })
            .catch((error) => {
                console.log(error);
            })
    }

    public detectVideoSource(stream: Stream) {
        this.streamService.comesFrom = (stream.streamLink.search('twitch') !== -1) ?
            'twitch' : 'youtube';
        this.streamService.selectedStreamId = stream.idStream;
    }

    public invertSortType () {
        this.streamService.isReverseSort = !this.streamService.isReverseSort;
        this.streamService.currentStreamPage = 0;
        this.streams = [];
        this.getAllShadowedStreams();
    }

    public loadMoreStreams () {
        this.streamService.currentStreamPage++;
        this.getAllShadowedStreams()
    }

    public reformatUrl (url: string) {
        return url.replace(/ /g, '-');
    }
}
