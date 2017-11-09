export class User {
    public name: string;
    public password: string;
    public dsmport: string = localStorage.getItem('dsm') || document.location.origin;
}
