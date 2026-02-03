/**
 * Declarations for the MTScript object used in MapTool scripting.
 */
declare const MTScript: {
    /**
     * Similar to the abort() macro, but accepts no arguments. 
     * Immediately halts macro execution with no message.
     */
    abort(): void;

    /**
     * 
     * @param check 
     * @param message 
     * @param pad 
     */
    mtsAssert(check: boolean, message:string, pad:boolean = true): void;

    /**
     * 
     * @param name 
     * @param value 
     */
    setVariable(name: string, value: any): void;

    /**
     * 
     * @param name 
     * @param value 
     */
    getVariable(name: string): any;

    /**
     * 
     * @param macro 
     */
    evalMacro(macro: string): any;
    
    /**
     * 
     * @param macro 
     */
    execMacro(macro: string): any;

    /**
     * 
     */
    getMTScriptCallingArgs(): any[];
    /**
     * 
     * @param name 
     * @param func 
     */
    registerMacro(name: string, func: (...args: any[]) => any): any?;
}