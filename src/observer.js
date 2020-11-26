import { backupScripts, backupIframes, TYPE_ATTRIBUTE, features } from './variables'
import { isOnBlacklist } from './checks'

// Setup a mutation observer to track DOM insertion
export const observer = new MutationObserver(mutations => {
    console.log(backupIframes);
    for (let i = 0; i < mutations.length; i++) {
        const { addedNodes } = mutations[i];
        for(let i = 0; i < addedNodes.length; i++) {
            const node = addedNodes[i]
            // For each added script tag
            if(node.nodeType === 1 && node.tagName === 'SCRIPT') {
                const src = node.src
                const type = node.type
                // If the src is inside the blacklist and is not inside the whitelist
                if(isOnBlacklist(src, type)) {
                    // We backup the node
                    backupScripts.blacklisted.push([node, node.type])

                    // Blocks inline script execution in Safari & Chrome
                    node.type = TYPE_ATTRIBUTE

                    // Firefox has this additional event which prevents scripts from beeing executed
                    const beforeScriptExecuteListener = function (event) {
                        // Prevent only marked scripts from executing
                        if(node.getAttribute('type') === TYPE_ATTRIBUTE)
                            event.preventDefault()
                        node.removeEventListener('beforescriptexecute', beforeScriptExecuteListener)
                    }
                    node.addEventListener('beforescriptexecute', beforeScriptExecuteListener)

                    // Remove the node from the DOM
                    node.parentElement && node.parentElement.removeChild(node)
                }
            }
            if(node.nodeType === 1 && node.tagName === 'IFRAME' && features.iframe !== false) {
                const src = node.src;
                
                // Controllo che l'src del mio nodo iFrame sia nella blacklist
                if(isOnBlacklist(src)) {
                    let id = `yett_iframe_id_${Math.floor(Math.random() * 1000) + 1}`;
                    
                    // Faccio un backup del nodo
                    backupIframes.blacklisted.push([id, node]);

                    // Rimuovo il nodo
                    let newPlaceholder = document.createElement('span');
                    newPlaceholder.setAttribute('data-yett-id', id);
                    node.parentElement.insertBefore(newPlaceholder, node)
                    node.parentElement && node.parentElement.removeChild(node)
                }
            }
        }
    }
})

// Starts the monitoring
observer.observe(document.documentElement, {
    childList: true,
    subtree: true
})