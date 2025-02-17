import * as E from 'electron';

import * as Const from 'Const';
import { isSameCookieDomain } from 'Utils/Main';

export class Session {
    private _hasFigmaSession: boolean;
    private assessSessionTimer: NodeJS.Timer;

    constructor() {
        this._hasFigmaSession = null;
        this.assessSessionTimer = null;
    }

    public hasFigmaSession = (): boolean => {
        return this._hasFigmaSession;
    }

    public handleAppReady = () => {
        E.session.defaultSession.cookies.get({ url: Const.HOMEPAGE }, (error, cookies) => {
            E.session.defaultSession.cookies.on('changed', this.handleCookiesChanged);
            if (error) {
                console.error('[wm] failed to get cookies during handleAppReady:', Const.HOMEPAGE, error);
                return;
            }
            this._hasFigmaSession = !!cookies.find((cookie) => {
                return cookie.name === Const.FIGMA_SESSION_COOKIE_NAME;
            });
            console.log('[wm] already signed in?', this._hasFigmaSession);
        });
    };

    private handleCookiesChanged = (event: E.Event, cookie: E.Cookie, cause: string, removed: boolean) => {
        if (isSameCookieDomain(cookie.domain || '', Const.PARSED_HOMEPAGE.hostname || '')) {
            if (cookie.name === Const.FIGMA_SESSION_COOKIE_NAME) {
                console.log(`${cookie.name} cookie changed:`, cause, cookie.name, cookie.domain, removed ? 'removed' : '');
            }
        }
    }
}
