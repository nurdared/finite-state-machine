class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if(!config)
            throw new Error('config is not set');               //For Empty Config
        this.states = config.states;
        this.activeState = config.initial;
        this.prevState = null;                                  //For Undo Function
        this.actualState = null;                                //For Redo Function
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.activeState;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if(state in this.states) {
            this.prevState = this.activeState;                  //Saving previous state for Undo Function
            this.activeState = state;                           //Changing State
        }
        else
            throw new Error('State not found');
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        this.prevState = this.activeState;                      //Saving previous state for Undo Function
        this.changeState(this.states[this.activeState].transitions[event]);
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.activeState = 'normal';
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        const states = [];
        if(!event) {                                            //Event empty
            for(let state in this.states)
                states.push(state);
            return states;
        }
        for(let state in this.states)
            if(event in this.states[state].transitions)         //If event exist inside states
                states.push(state);                             //Pushing to state to array
        return states;

    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if(this.prevState !== null) {
            this.actualState = this.activeState;                //Saving actual state for Redo Function
            this.activeState = this.prevState;
            this.prevState = null;
            return true;
        }
        return false;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if(this.actualState !== null) {
            this.activeState = this.actualState;
            this.actualState = null;
            this.prevState = null;
            return true;
        }
        return false;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.prevState = null;
        this.actualState = null;
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
