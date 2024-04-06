function observe(container, element, func, once) {
    'use strict';
    if (once === undefined) once = false;
    try {
        const no = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) if (mutation.type === 'childList') {
                for (const node of mutation.addedNodes) {
                    if (!node || node.nodeType !== 1) continue
                    if (node.matches(element)) {
                        func([node])
                        if (once) {
                            no.disconnect()
                            continue
                        }
                    }
                    if (typeof node?.querySelectorAll === "function" && node.querySelectorAll(element).length > 0) {
                        const query = node.querySelectorAll(element)
                        if (!query) continue
                        func(query)
                        if (once) {
                            no.disconnect()
                            continue
                        }
                    }
                }
            }
        })
        no.observe(container, { childList: true, subtree: true })
        return no
    }
    catch (err) {
        console.log("err.message: " + err.message)
    }
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

observe(document, 'main', _ => {
    console.log("[UnBlurd] Observing <main/>", _[0])
    observe(_[0], '[role="article"],[role="listitem"]', async tweets => {
        try {
            for (const tweet of [...tweets]) {
                const role = tweet.getAttribute('role')
                if (role === "article") {
                    const media_warning = tweet.querySelector('.css-175oi2r.r-1kihuf0.r-1e081e0')
                    if (media_warning) clickTheUnblurButton(media_warning)
                }
                if (role === "listitem") {
                    clickTheUnblurButton(tweet)
                }
            }
        } catch (err) {
            console.error("[UnBlurd] Error", err)
            console.log("[UnBlurd] Additional data", { tweets })
        }
    })
}, true)

function clickTheUnblurButton(container) {
    const unblur_button = container.querySelectorAll('[role="button"]')
    if (!unblur_button) return false
    for (const button of [...unblur_button]) {
        const click_event = button?.click
        if (typeof click_event !== "function") return false
        click_event.call(button)
    }
}
