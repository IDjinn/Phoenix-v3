export default abstract class AbstractManager{
    private name: string;
    constructor(name: string) {
        this.name = name;
    }
    public abstract init(): void;
    public abstract destroy(): void;
}