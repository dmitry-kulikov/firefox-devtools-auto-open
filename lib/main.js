"use strict";

// Add-on SDK
const { Cu } = require("chrome");
const { viewFor } = require("sdk/view/core");

// DevTools
const { gDevTools } = Cu.import("resource:///modules/devtools/gDevTools.jsm", {});
const { devtools } = Cu.import("resource://gre/modules/devtools/shared/Loader.jsm", {});

// Tabs
const tabs = require("sdk/tabs");

// Preferences
const preferences = require("sdk/simple-prefs");

/**
 * Application entry point.
 */
function main() {
    preferences.on("onTabOpen", function () {
        if (preferences.prefs["onTabOpen"]) {
            onTabOpen();
        } else {
            offTabOpen();
        }
    });
    preferences.on("onTabReady", function () {
        if (preferences.prefs["onTabReady"]) {
            onTabReady();
        } else {
            offTabReady();
        }
    });
    if (preferences.prefs["onTabOpen"]) {
        onTabOpen();
    }
    if (preferences.prefs["onTabReady"]) {
        onTabReady();
    }
}

function onUnload() {
    offTabOpen();
    offTabReady();
}

function onTabOpen() {
    tabs.on("open", showToolbox);
}

function onTabReady() {
    tabs.on("ready", showToolbox);
}

function offTabOpen() {
    tabs.off("open", showToolbox);
}

function offTabReady() {
    tabs.off("ready", showToolbox);
}

/**
 * Open Developer Tools.
 * @param {Object} tab browser tab
 */
function showToolbox(tab) {
    gDevTools.showToolbox(devtools.TargetFactory.forTab(viewFor(tab)));
}

// Exports from this module
exports.main = main;
exports.onUnload = onUnload;
