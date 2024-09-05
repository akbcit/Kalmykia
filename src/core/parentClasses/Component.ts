let nextComponentId = 0;

export abstract class Component {
    private readonly id: number;
    private readonly name: string;

    constructor(name?: string) {
        this.id = nextComponentId++;
        this.name = name || this.constructor.name;
        this.onInit();
    }

    // Returns the unique identifier of the component
    public getId(): number {
        return this.id;
    }

    // Returns the component's name, used for identification and debugging
    public getName(): string {
        return this.name;
    }

    // Initialization hook for setup logic, can be overridden
    protected onInit(): void {
        // Override in derived classes if needed
    }

    // Destruction hook for cleanup logic, can be overridden
    protected onDestroy(): void {
        // Override in derived classes if needed
    }

    // Update method, often overridden to define component behavior during updates
    public update(delta: number): void {
        // Override in derived classes if needed
    }

    // Cleanup method that calls the destruction hook
    public dispose(): void {
        this.onDestroy();
    }
}
