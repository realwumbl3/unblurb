css`
    .unblurd-fix .css-175oi2r.r-1867qdf.r-16y2uox > [role="button"] {
        opacity: .2 !important;
        transition: opacity .3s, transform .3s;
    }
    .unblurd-fix .css-175oi2r.r-1867qdf.r-16y2uox:hover > [role="button"] {
        opacity: 1 !important;
        transform: translateY(-160%);
    }
`

function clickButtons(container, cond) {
    if (!container) return
    for (const button of [...container.querySelectorAll('[role="button"]')]) {
        if (cond(button)) {
            button?.click.call(button)
        }
    }
}

observe(document, 'main', _ => {
    console.log("[UnBlurd] Observing <main/>", _)
    observe(_, '[role="article"],[role="listitem"]', async tweet => {
        if (tweet.matches(`[data-testid="UserCell"],[data-testid="cellInnerDiv"]`)) return false // Skip user cells
        if (tweet.getAttribute('role') === "listitem") {
            return clickButtons(tweet, _ => _.previousElementSibling?.previousElementSibling?.matches('svg'))
        }
        tweet.classList.add('unblurd-fix')
        clickButtons(tweet, _ => _.previousElementSibling?.firstChild?.matches('svg'))
    })
}, true)

// 