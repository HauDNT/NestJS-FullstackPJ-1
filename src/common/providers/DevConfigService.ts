import { Injectable } from "@nestjs/common";

@Injectable()
export class DevConfigService {
    private DBHOST = "http://localhost:8080";
    
    getDBHOST() {
        return this.DBHOST;
    };
}