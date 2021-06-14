const Keyboard = {
    elements: {
        main: null,
        keysContainer : null,
        keys: []
    },

    eventHandlers: {
        oninput: null,
        onclose: null
    },

    properties: {
        value: "",
        capsLock: false
    },

    init() {
        // Create main elements
        this.elements.main = document.createElement("div");
        this.elements.keysContainer = document.createElement("div");

        // Setup main elements
        this.elements.main.classList.add("keyboard", "keyboard--hidden"); // adding two classess , keyboard--hidden means keyboard will be hidden at the start
        this.elements.keysContainer.classList.add("keyboard__keys"); // class for keys 
        this.elements.keysContainer.appendChild(this._createKeys());  // creating keys and append it into the keyContainer

        this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");   


        // Add to DOM
        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);

        // Automatically use keyboard for elements with .use-keyboard-input
        document.querySelectorAll(".use-keyboard-input").forEach(element => {
            element.addEventListener("focus", () => {
                this.open(element.value, currentValue => {
                    element.value = currentValue;
                    // console.log(currentValue);
                });
            });
        });
    },

    _createKeys() 
    {
        const fragment = document.createDocumentFragment(); // it acts like a JPanel in java
        const keyLayout = [
            "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",             // keyboard keys
            "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
            "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
            "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
            "space"
        ];

        // Create HTML for an icon 
        const createIconHTML = (icon_name) => {           // image icon for special keys like => spacebar, backspace, enter, capslock, done
            return `<i class="material-icons">${icon_name}</i>`;  
        };

        keyLayout.forEach(key => {                // selecting all keys one by one from keylayout
            const keyElement = document.createElement("button");            // creating button for every key
            const insertLineBreak = ["backspace", "p", "enter", "?"].indexOf(key) !== -1;   // because index of all other keys will be -1   
           // console.log(["backspace", "p", "enter", "?"].indexOf("done"));   
            // Add attributes/classes

            keyElement.setAttribute("type","button");
            keyElement.classList.add("keyboard__key");   // adding class to keyElement which is created

            switch(key)       // functioning of the keyboard 
            {
                case "backspace" :
                    keyElement.classList.add("keyboard__key--wide");       
                    keyElement.innerHTML = createIconHTML("backspace");     // creating icon for this key 

                    keyElement.addEventListener("click", () => {           // adding click event to the key
                        this.properties.value = this.properties.value.substring(0,this.properties.value.length-1);
                        this._triggerEvent("oninput");
                    });
                    break;
                
                    case "caps" :
                        keyElement.classList.add("keyboard__key--wide","keyboard__key--activatable"); // activatable class will turn on the light on capslock key
                        keyElement.innerHTML = createIconHTML("keyboard_capslock");

                        keyElement.addEventListener("click", () => {
                            this._toggleCapsLock();       
                            keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);   // capslock will toogle b/w true and false
                        });
                        break;
                        
                        case "enter" :
                            keyElement.classList.add("keyboard__key--wide");
                            keyElement.innerHTML = createIconHTML("keyboard_return");
        
                            keyElement.addEventListener("click", () => {
                                this.properties.value += "\n";     // add  a new line
                                this._triggerEvent("oninput");
                            });
                            break;    

                            case "space" :
                                keyElement.classList.add("keyboard__key--extra-wide");        // extra--wide class for spacebar
                                keyElement.innerHTML = createIconHTML("space_bar");
            
                                keyElement.addEventListener("click", () => {
                                    this.properties.value += " ";       // adds space in b/w 
                                    this._triggerEvent("oninput");
                                });
                                break;    

                                case "done" :
                                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");         // key will be wide and of dark color 
                                    keyElement.innerHTML = createIconHTML("check_circle");   // gives tick mark inside a circle
                
                                    keyElement.addEventListener("click", () => {
                                        this.close();                  // it will close the keyboard
                                        this._triggerEvent("onclose");
                                    });
                                    break;
                                    
                             
                        default :
                            keyElement.textContent = key.toLowerCase();     // at the start key are of lowercase
                            
                            keyElement.addEventListener("click", () => {
                                this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();   // adding text acc. to property of keys
                                this._triggerEvent("oninput");
                            });
                            break;
            }

            fragment.appendChild(keyElement);

            if(insertLineBreak)
            {
                fragment.appendChild(document.createElement("br"));
            }

        });

        return fragment;
    },

    _triggerEvent(handlerName) {
        if(typeof this.eventHandlers[handlerName] == "function")
        {
            this.eventHandlers[handlerName](this.properties.value);
        }
    },

    _toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock;         // it will change property of key 

        for(const key of this.elements.keys)      // key is an empty array
        {
            if(key.childElementCount === 0 )         // so count will be 0
            {
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();

                // if property is true then textcontent is uppercase ,else lowercase
            }
        }
    },

    open(initialValue, oninput, onclose) 
    {
        this.properties.value = initialValue || "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose  = onclose;
        this.elements.main.classList.remove("keyboard--hidden");
    },

    close() {                           // this method is called when done button is clicked
        this.properties.value = "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.add("keyboard--hidden");
    }
};

window.addEventListener("DOMContentLoaded", function() {        // it works when html document is loaded
    Keyboard.init();
    // Keyboard.open("dcode", function(currentValue) {
    //     console.log("valuechanged! here it is: " + currentValue);
    // }, function(currentValue) {
    //     console.log("keyboar closed: Finishing value: " + currentValue);
    // })
});