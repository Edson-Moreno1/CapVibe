import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class LayoutService {
    private _isSidebarVisible = new BehaviorSubject<boolean>(true);

    public isSidebarVisible$ = this._isSidebarVisible.asObservable();

    toggleSidebar(){
        this._isSidebarVisible.next(!this._isSidebarVisible.value);
    }

    closeSidebar(){
        this._isSidebarVisible.next(false);
    }
}