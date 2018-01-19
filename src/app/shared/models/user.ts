export class User {
    
    login: string;
    url: string;
    html_url: string;
    
    constructor(user) {
        this.login = user.login;
        this.url = user.url;
        this.html_url = user.html_url;
    }
}