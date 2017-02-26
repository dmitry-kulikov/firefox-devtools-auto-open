# DevTools Auto Open
Add-on for Firefox browser.  
Automatically opens Firefox Developer Tools when new tab / new window is opened.  
If user closed Developer Tools on tab then add-on won't reopen Developer Tools on this tab.  

By default Developer Tools will be opened on tab `ready` event: when the DOM for a tab's content is ready.
If you need then Developer Tools may be opened earlier, immediately when a new tab is opened, for that open
`about:addons` > `DevTools Auto Open` > `Preferences` and check option `On tab open`.
`On tab open` is disabled by default because produces bugs
https://github.com/dmitry-kulikov/firefox-devtools-auto-open/issues/1,
https://github.com/dmitry-kulikov/firefox-devtools-auto-open/issues/2.
