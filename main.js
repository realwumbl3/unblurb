function monitorFor(element, func) {
    'use strict';
    try {
        let observer = new MutationObserver((mutationsList) => {
            for (var mutation of mutationsList) if (mutation.type === 'childList') {
                for (let node of mutation.addedNodes) {
                    if (typeof node?.querySelectorAll === "function" && node.querySelectorAll(element).length > 0) func(node.querySelectorAll(element))
                }
            }
        })
        observer.observe(document.body, { childList: true, subtree: true })
    }
    catch (err) {
        console.log("err.message: " + err.message)
    }
}
monitorFor('[data-testid="primaryColumn"]', _ => {
    monitorFor('article', _ => {
        for (let article of [..._]) {
            const article_media = article.querySelector('.css-1dbjc4n.r-9aw3ui')
            if (!article_media) return false
            const media_buttons = article_media.querySelectorAll('[role="button"][style]')
            if (!media_buttons) return false
            for (const button of [...media_buttons]) {
                const click_event = button?.click
                if (typeof click_event !== "function") return false
                setTimeout(_ => click_event.call(button), 1)
            }
        }
    })
})
