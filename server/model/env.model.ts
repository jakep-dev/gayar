export class EnvConfigModel {

    constructor(){
        this.init();
    }

    private init(): void{
        this.Server = new ServerModel();
        this.Api = new ApiModel();
        this.Security = new SecurityModel();
        this.Log = new LogModel();
    }

    Server: ServerModel;

    Api: ApiModel;

    Security: SecurityModel;

    Log: LogModel;
}

export class ServerModel {
    protocol: string;
    host: string;
    port: number;
    useCertificate: boolean;
    certPath: string;
    certKey: string;
    passPhrase: string;
    deploymentFolder: string;
}

export class ApiModel {
        host: string;
        port: number;
        protocol: string;
        endPoints: Array<{
            name: string;
            contract: string;
        }>
}

export class SecurityModel {
        isCookie: boolean;
        httpOnly: boolean;
        secure: boolean;
        sameSite: string;
        ignoreMethods: Array<string>;
        cookieParser: string;
        headers: [{
            name: string;
            value: string;
            type: string;
        }];
}

export class LogModel {
        level: string;
        maxSize: number;
        maxFiles: number;
        dirName: string;
        filePath: string;
        exceptionFilePath: string;
        datePattern: string;
        prepend: boolean;
        handleExceptions: boolean;
        humanReadableUnhandledException: boolean;
        json: boolean;
        colorize: boolean;
        prettyPrint: boolean;
        timeStamp: string;
        formatter: string;
}