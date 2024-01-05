function observe(container, element, func) {
    'use strict';
    try {
        const no = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) if (mutation.type === 'childList') {
                for (const node of mutation.addedNodes) if (typeof node?.querySelectorAll === "function" && node.querySelectorAll(element).length > 0)
                    func(node.querySelectorAll(element))
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

observe(document.body, '[role="main"]', _ => {
    // console.log("Main >", _)
    observe(_[0], '[role="article"],[role="listitem"]', async tweets => {
        for (const tweet of [...tweets]) {
            const role = tweet.getAttribute('role')
            if (role === "article") {
                // console.log("Tweet Article >", tweet)
                const media_warning = tweet.querySelector('.css-175oi2r.r-1kihuf0.r-1e081e0')
                if (!media_warning) return false
                // console.log("Tweet w Media Warning >", media_warning)
                clickTheUnblurButton(media_warning)
            } else if (role === "listitem") {
                // console.log("Tweet Grid Item >", tweet)
                clickTheUnblurButton(tweet)
            }
        }
    })
})

function clickTheUnblurButton(container) {
    const unblur_button = container.querySelectorAll('[role="button"]')
    if (!unblur_button) return false
    // console.log("Unblur Button >", unblur_button)
    for (const button of [...unblur_button]) {
        const click_event = button?.click
        if (typeof click_event !== "function") return false
        // console.log("Clicking Button >", button)
        click_event.call(button)
    }
}
