async function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)) };

class CallIfNotExistsSet extends Set {
    constructor(...args) {
        super(...args)
    }
    call(thing, func) {
        if (this.has(thing)) return
        this.add(thing)
        func(thing)
    }
}

function css(raw, ...data) {
    const style = document.createElement('style')
    style.innerHTML = raw
    setTimeout(() => document.head.appendChild(style), 0)
    return style
}

function observe(container, query, func, once) {
    'use strict';
    once = once || false
    const nmo = new MutationObserver((mutationsList) => {
        const set = new CallIfNotExistsSet()
        for (const mutation of mutationsList) if (mutation.type === 'childList') {
            for (const node of mutation.addedNodes) {
                if (!node || node.nodeType !== 1) continue
                if (node.matches?.(query)) {
                    set.call(node, () => func(node))
                    if (once) return nmo.disconnect()
                }
                else if (node.querySelectorAll(query).length > 0) {
                    for (const elem of node.querySelectorAll(query))
                        set.call(elem, () => func(elem));
                    if (once) return nmo.disconnect()
                }
            }
        }
    })
    nmo.observe(container, { childList: true, subtree: true })
    return nmo
}
