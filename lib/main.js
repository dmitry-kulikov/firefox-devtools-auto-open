"use strict";

// Add-on SDK
const { Cu } = require("chrome");
const { viewFor } = require("sdk/view/core");

// DevTools
const { gDevTools } = Cu.import("resource:///modules/devtools/gDevTools.jsm", {});
const { devtools } = Cu.import("resource://gre/modules/devtools/shared/Loader.jsm", {});

// Tabs
const tabs = require("sdk/tabs");

/**
 * Application entry point.
 */
function main() {
    // ideally toolbox should be shown on "open" event,
    // but Firefox doesn't trigger this event for first tab of first window,
    // so use "ready" event as fallback
    tabs.on("open", showToolbox).on("ready", showToolbox);
}

function onUnload() {
    tabs.off("open", showToolbox).off("ready", showToolbox);
}

function showToolbox(tab) {
    gDevTools.showToolbox(devtools.TargetFactory.forTab(viewFor(tab)));
}

// Exports from this module
exports.main = main;
exports.onUnload = onUnload;
