"use strict";

// Add-on SDK
const { Cu } = require("chrome");
const { modelFor } = require("sdk/model/core");
const { viewFor } = require("sdk/view/core");

// DevTools
const { gDevTools } = Cu.import("resource:///modules/devtools/gDevTools.jsm", {});
const { devtools } = Cu.import("resource://gre/modules/devtools/shared/Loader.jsm", {});

// Tabs
const tabs = require("sdk/tabs");

// Preferences
const preferences = require("sdk/simple-prefs");

/**
 * Object containing info about state of Developer Tools on each tab.
 * @type {Object}
 */
const tabStates = {};

/**
 * Application entry point.
 */
function main() {
    gDevTools.on("toolbox-ready", onToolboxReady);
    gDevTools.on("toolbox-destroy", onToolboxDestroy);
    tabs.on("close", onTabClose);

    preferences.on("onTabOpen", onOnTabOpenChanged);
    preferences.on("onTabReady", onOnTabReadyChanged);

    if (preferences.prefs["onTabOpen"]) {
        addTabOpenListener();
    }
    if (preferences.prefs["onTabReady"]) {
        addTabReadyListener();
    }
}

/**
 * Processes unloading of add-on.
 */
function onUnload() {
    gDevTools.off("toolbox-ready", onToolboxReady);
    gDevTools.off("toolbox-destroy", onToolboxDestroy);
    tabs.off("close", onTabClose);

    preferences.off("onTabOpen", onOnTabOpenChanged);
    preferences.off("onTabReady", onOnTabReadyChanged);

    removeTabOpenListener();
    removeTabReadyListener();
}

function addTabOpenListener() {
    tabs.on("open", showToolbox);
}

function addTabReadyListener() {
    tabs.on("ready", showToolbox);
}

function removeTabOpenListener() {
    tabs.off("open", showToolbox);
}

function removeTabReadyListener() {
    tabs.off("ready", showToolbox);
}

/**
 * Get id of XUL tab.
 * @param {Object} xulTab XUL tab
 * @returns {Boolean|String} unique id for the tab or false in case of error.
 */
function getXulTabId(xulTab) {
    if (typeof xulTab == "undefined") {
        return false;
    }
    let tab = modelFor(xulTab);
    if (typeof tab == "undefined") {
        return false;
    }
    return tab.id;
}

/**
 * Listener of "toolbox-ready" event.
 * @param {String} eventName event name
 * @param {Object} toolbox toolbox
 */
function onToolboxReady(eventName, toolbox) {
    let tabId = getXulTabId(toolbox.target.tab);
    if (tabId) {
        tabStates[tabId] = true;
    }
}

/**
 * Listener of "toolbox-destroy" event.
 * @param {String} eventName event name
 * @param {Object} target target
 */
function onToolboxDestroy(eventName, target) {
    let tabId = getXulTabId(target.tab);
    if (tabId) {
        tabStates[tabId] = false;
    }
}

/**
 * Listener of "close" tab event.
 * @param {Object} tab browser tab
 */
function onTabClose(tab) {
    delete tabStates[tab.id];
}

/**
 * Listener of change of "onTabOpen" preference.
 */
function onOnTabOpenChanged() {
    if (preferences.prefs["onTabOpen"]) {
        addTabOpenListener();
    } else {
        removeTabOpenListener();
    }
}

/**
 * Listener of change of "onTabReady" preference.
 */
function onOnTabReadyChanged() {
    if (preferences.prefs["onTabReady"]) {
        addTabReadyListener();
    } else {
        removeTabReadyListener();
    }
}

/**
 * Open Developer Tools.
 * @param {Object} tab browser tab
 */
function showToolbox(tab) {
    // if Developer Tools were closed by user then do not reopen on this tab
    if (tabStates[tab.id] != false) {
        gDevTools.showToolbox(devtools.TargetFactory.forTab(viewFor(tab)));
    }
}

// Exports from this module
exports.main = main;
exports.onUnload = onUnload;
