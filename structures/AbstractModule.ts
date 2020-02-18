export default abstract class AbstractModule{
    public readonly name: string;
    public readonly data: any;
    constructor(name: string, data: any){
        this.name = name;
        this.data = data;
    }
    public abstract init();
    public abstract destroy();
}