'use strict'
const Browser = window.browser || window.chrome;
const promisify = (fn, ...args) => new Promise(resolve => fn(...args, resolve));

const mergeWindows = async () => {
    let [currentWindow, ...tabs] = await Promise.all([
        promisify(Browser.windows.getCurrent),
        promisify(Browser.tabs.query, {currentWindow: false, windowType: 'normal'}),
        promisify(Browser.tabs.query, {currentWindow: false, windowType: 'popup'})
    ]);

    await promisify(Browser.tabs.move, tabs.flat().map(tab => tab.id), {
        windowId: currentWindow.id,
        index: -1
    })

    for (const tab of tabs) {
        if (tab.pinned) {
            Browser.tabs.update(tab.id, {pinned: true})
        }
    }
}

Browser.browserAction.onClicked.addListener(mergeWindows);