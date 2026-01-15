/**
 * 
 */
declare const MapTool: {

    /**
     * 
     */
    chat : {

        /**
         * 
         * @param message 
         */
        broadcast(message: string): void;      

        /**
         * 
         * @param targets 
         * @param message 
         */
        broadcastTo(targets: string[], message: string): void;      

        /**
         * 
         * @param message 
         */
        broadcastToGM(message: string): void;      
    }

    clientInfo : {

        /**
         * Returns true if tokens face the edge.
         */
        faceEdge(): boolean;

        /**
         * Returns true if tokens face the vertex.
         */
        faceVertex(): boolean;

        /**
         * Returns the number of pixels used to display portraits.
         */
        portraitSize(): number;

        /**
         * Returns true if the player has show stat sheet selected in preferences.
         */
        showStatSheet(): boolean;

        /**
         * Returns the version string of MapTool.
         */
        version(): string;

        /**
         * Returns if the current frame is fullscreen.
         */
        fullScreen(): boolean;

        /**
         * Returns the current time with ms precision.
         */
        timeInMs(): number;

        /**
         * Returns the current time and date as an opaque object. Just use new Date() instead.
         */
        timeDate(): any;

        /**
         * Returns a map of all library tokens.
         */
        libraryTokens(): {[key: string]: string};

        /**
         * Returns a list of user defined function aliases.
         */
        userDefinedFunctions(): string[];

        /**
         * Returns the unique ID of the current client as a string.
         */
        getClientId(): string;
    }
}