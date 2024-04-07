const sleep = async (ms) => new Promise(resolve => setTimeout(resolve, ms));

function observe(container, query, func, once) {
    'use strict';
    once = once || false
    const nmo = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) if (mutation.type === 'childList') {
            for (const node of mutation.addedNodes) {
                if (!node || node.nodeType !== 1) continue
                if (node.matches(query)) {
                    func(node)
                    if (once) return nmo.disconnect()
                } else if (node.querySelectorAll(query).length > 0) {
                    for (const elem of node.querySelectorAll(query)) func(elem)
                    if (once) return nmo.disconnect()
                }
            }
        }
    })
    nmo.observe(container, { childList: true, subtree: true })
    return nmo
}

function clickTheUnblurButton(container) {
    const unblurButton = container.querySelectorAll('[role="button"]')
    if (!unblurButton) return false
    for (const button of [...unblurButton]) button?.click.call(button)
}

observe(document, 'main', _ => {
    console.log("[UnBlurd] Observing <main/>", _)
    observe(_, '[role="article"],[role="listitem"]', async tweet => {
        try {
            const role = tweet.getAttribute('role')
            if (role === "listitem") return clickTheUnblurButton(tweet)
            const mediaWarning = tweet.querySelector('.css-175oi2r.r-1kihuf0.r-1e081e0')
            if (mediaWarning) clickTheUnblurButton(mediaWarning)
        } catch (err) {
            console.error("[UnBlurd] Error", err)
            console.log("[UnBlurd] Err context:", { tweet })
        }
    })
}, true)
