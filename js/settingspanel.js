/* BetterDiscordApp Settings Panel JavaScript
 * Version: 2.0
 * Author: Jiiks | http://jiiks.net
 * Date: 26/08/2015 - 11:54
 * Last Update: 27/11/2015 - 00:50
 * https://github.com/Jiiks/BetterDiscordApp
 */

var settingsButton = null;
var panel = null;

const fs = require('fs');

function SettingsPanel() {
    utils.injectJs("https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.9.0/codemirror.min.js");
    utils.injectJs("https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.9.0/mode/css/css.min.js");
}

SettingsPanel.prototype.init = function() {
    var self = this;
    self.construct();
    var body = $("body");

    if(settingsCookie["bda-es-0"]) {
        $("#twitchcord-button-container").show();
    } else {
        $("#twitchcord-button-container").hide();
    }

    if(settingsCookie["bda-gs-2"]) {
        body.addClass("bd-minimal");
    } else {
        body.removeClass("bd-minimal");
    }
    if(settingsCookie["bda-gs-3"]) {
        body.addClass("bd-minimal-chan");
    } else {
        body.removeClass("bd-minimal-chan");
    }

    if(settingsCookie["bda-gs-4"]) {
        voiceMode.enable();
    }

    if(settingsCookie["bda-jd"]) {
        opublicServers.joinServer("0Tmfo5ZbORCRqbAd");
        settingsCookie["bda-jd"] = false;
        mainCore.saveSettings();
    }
    
    if (settingsCookie["bda-es-6"]) {
        //Pretty emote titles
      	emoteNamePopup = $("<div class='tipsy tipsy-se' style='display: block; top: 82px; left: 1630.5px; visibility: visible; opacity: 0.8;'><div class='tipsy-inner'></div></div>");
      	$(document).on("mouseover", ".emote", function() { var x = $(this).offset(); var title = $(this).attr("alt"); $(emoteNamePopup).find(".tipsy-inner").text(title); $(emoteNamePopup).css('left', x.left - 25); $(emoteNamePopup).css('top', x.top - 32); $("div[data-reactid='.0.1.1']").append($(emoteNamePopup));});
      	$(document).on("mouseleave", ".emote", function(){$(".tipsy").remove()});
    } else {
      	$(document).off('mouseover', '.emote');
    }
};

SettingsPanel.prototype.applyCustomCss = function(css) {
    if($("#customcss").length == 0) {
        $("head").append('<style id="customcss"></style>');
    }

    $("#customcss").html(css);

    localStorage.setItem("bdcustomcss", btoa(css));
};

var customCssInitialized = false;
var lastTab = "";

SettingsPanel.prototype.changeTab = function(tab) {
    
    var self = this;
    
    lastTab = tab;
    
    var controlGroups = $("#bd-control-groups");
    $(".bd-tab").removeClass("selected");
    $(".bd-pane").hide();
    $("#" + tab).addClass("selected");   
    $("#" + tab.replace("tab", "pane")).show();
     
    switch(tab) {
        case "bd-settings-tab":
        break;
        case "bd-customcss-tab":
            if(!customCssInitialized) {
                var editor = CodeMirror.fromTextArea(document.getElementById("bd-custom-css-ta"), {
                    lineNumbers: true, mode: 'css', indentUnit: 4, theme: 'neat'
                });
                
                
                editor.on("change", function(cm) {
                    var css = cm.getValue();
                    self.applyCustomCss(css);
                });

                customCssInitialized = true;
            }
        break;
        case "bd-plugins-tab":
            
        break;
        case "bd-themes-tab":
            controlGroups.html("<span>Coming soon</span>");
        break;
        case "bd-other-tab":
            
        break;
    }
};

function SaveJSONSettings() {
    var bdags0 = localStorage.getItem("bda-gs-0");
    var bdags1 = localStorage.getItem("bda-gs-1");
    var bdags2 = localStorage.getItem("bda-gs-2");
    var bdags4 = localStorage.getItem("bda-gs-4");
    var bdags3 = localStorage.getItem("bda-gs-3");
    var bdaes0 = localStorage.getItem("bda-es-0");
    var bdaes7 = localStorage.getItem("bda-es-7");
    var bdaes1 = localStorage.getItem("bda-es-1");
    var bdaes2 = localStorage.getItem("bda-es-2");
    var bdaes3 = localStorage.getItem("bda-es-3");
    var bdaes4 = localStorage.getItem("bda-es-4");
    var bdaes5 = localStorage.getItem("bda-es-5");
    var bdaes6 = localStorage.getItem("bda-es-6");
    var customcss = localStorage.getItem("bdcustomcss");
    var os = process.platform;
    var _dataPath = os == "win32" ? process.env.APPDATA : os == 'darwin' ? process.env.HOME + '/Library/Preferences' : '/var/local';
    _dataPath += "/BetterDiscord/settings/";
    var file = _dataPath + "Settings.json";
    var fsstat = fs.stat(_dataPath + "Settings.json", function(err, stats) {})
    var data = [{    "bdags0": '"' + bdags0 + '"',    "bdags1": '"' + bdags1 + '"',    "bdags2": '"' + bdags2 + '"',    "bdags4": '"' + bdags4 + '"',    "bdags3": '"' + bdags3 + '"',    "bdaes0": '"' + bdaes0 + '"',    "bdaes7": '"' + bdaes7 + '"',    "bdaes1": '"' + bdaes1 + '"',    "bdaes2": '"' + bdaes2 + '"',    "bdaes3": '"' + bdaes3 + '"',    "bdaes4": '"' + bdaes4 + '"',    "bdaes5": '"' + bdaes5 + '"',    "bdaes6": '"' + bdaes6 + '"',    "bdcustomcss": '"' + customcss + '"'}];
    if(fsstat.isDirectory) {
        fs.writeFile(file, data);
    }
    else {
        fs.mkdir(_dataPath, function(e) {});
        fs.writeFile(file, data);
    }
}

function LoadJSONSettings() {
    var os = process.platform;
    var _dataPath = os == "win32" ? process.env.APPDATA : os == 'darwin' ? process.env.HOME + '/Library/Preferences' : '/var/local';
    _dataPath += "/BetterDiscord/settings/";
    var file = _dataPath + "Settings.json";
    var self = this;
    var settingsjson;
    if(fs.stats.isFile(_dataPath + "Settings.json")) {
        fs.readFile(file, function read(err, data) {
            settingsjson = data;
        });
        var bdags0 = settingsjson.deserializedjson["bdags0"];
        var bdags1 = settingsjson.deserializedjson["bdags1"];
        var bdags2 = settingsjson.deserializedjson["bdags2"];
        var bdags4 = settingsjson.deserializedjson["bdags4"];
        var bdags3 = settingsjson.deserializedjson["bdags3"];
        var bdaes0 = settingsjson.deserializedjson["bdaes0"];
        var bdaes7 = settingsjson.deserializedjson["bdaes7"];
        var bdaes1 = settingsjson.deserializedjson["bdaes1"];
        var bdaes2 = settingsjson.deserializedjson["bdaes2"];
        var bdaes3 = settingsjson.deserializedjson["bdaes3"];
        var bdaes4 = settingsjson.deserializedjson["bdaes4"];
        var bdaes5 = settingsjson.deserializedjson["bdaes5"];
        var bdaes6 = settingsjson.deserializedjson["bdaes6"];
        var customcss = settingsjson.deserializedjson["bdcustomcss"];
        localStorage.setItem("bda-gs-0", bdags0);
        localStorage.setItem("bda-gs-1", bdags1);
        localStorage.setItem("bda-gs-2", bdags2);
        localStorage.setItem("bda-gs-4", bdags4);
        localStorage.setItem("bda-gs-3", bdags3);
        localStorage.setItem("bda-es-0", bdaes0);
        localStorage.setItem("bda-es-7", bdaes7);
        localStorage.setItem("bda-es-1", bdaes1);
        localStorage.setItem("bda-es-2", bdaes2);
        localStorage.setItem("bda-es-3", bdaes3);
        localStorage.setItem("bda-es-4", bdaes4);
        localStorage.setItem("bda-es-5", bdaes5);
        localStorage.setItem("bda-es-6", bdaes6);
        self.applyCustomCss(customcss);
    }
}

SettingsPanel.prototype.updateSetting = function(checkbox) {
        var cb = $(checkbox).children().find('input[type="checkbox"]');
        var enabled = !cb.is(":checked");
        var id = cb.attr("id");
        cb.prop("checked", enabled);

        settingsCookie[id] = enabled;

        if(settingsCookie["bda-es-0"]) {
            $("#twitchcord-button-container").show();
        } else {
            $("#twitchcord-button-container").hide();
        }

        if(settingsCookie["bda-gs-2"]) {
            $("body").addClass("bd-minimal");
        } else {
            $("body").removeClass("bd-minimal");
        }
        if(settingsCookie["bda-gs-3"]) {
            $("body").addClass("bd-minimal-chan");
        } else {
            $("body").removeClass("bd-minimal-chan");
        }
        if(settingsCookie["bda-gs-1"]) {
            $("#bd-pub-li").show();
        } else {
            $("#bd-pub-li").hide();
        }
        if(settingsCookie["bda-gs-4"]){
            voiceMode.enable();
        } else {
            voiceMode.disable();
        }
        if (settingsCookie["bda-es-6"]) {
      	    //Pretty emote titles
      	    emoteNamePopup = $("<div class='tipsy tipsy-se' style='display: block; top: 82px; left: 1630.5px; visibility: visible; opacity: 0.8;'><div class='tipsy-inner'></div></div>");
      	    $(document).on("mouseover", ".emote", function() { var x = $(this).offset(); var title = $(this).attr("alt"); $(emoteNamePopup).find(".tipsy-inner").text(title); $(emoteNamePopup).css('left', x.left - 25); $(emoteNamePopup).css('top', x.top - 32); $("div[data-reactid='.0.1.1']").append($(emoteNamePopup));});
      	    $(document).on("mouseleave", ".emote", function(){$(".tipsy").remove()});
    	} else {
      	    $(document).off('mouseover', '.emote');
    	}

        mainCore.saveSettings();
}

SettingsPanel.prototype.construct = function() {
    var self = this;
    
    panel = $("<div/>", {
        id: "bd-pane",
        class: "settings-inner",
        css: {
            "display": "none"
        }
    });
    
    var settingsInner = '' +
    '<div class="scroller-wrap">' +
    '   <div class="scroller settings-wrapper settings-panel">' +
    '       <div class="tab-bar TOP">' +
    '           <div class="tab-bar-item bd-tab" id="bd-settings-tab" onclick="settingsPanel.changeTab(\'bd-settings-tab\');">Settings</div>' +
    '           <div class="tab-bar-item bd-tab" id="bd-customcss-tab" onclick="settingsPanel.changeTab(\'bd-customcss-tab\');">Custom CSS</div>' +
    '           <div class="tab-bar-item bd-tab" id="bd-plugins-tab" onclick="settingsPanel.changeTab(\'bd-plugins-tab\');">Plugins</div>' +
    '           <div class="tab-bar-item bd-tab" id="bd-themes-tab" onclick="settingsPanel.changeTab(\'bd-themes-tab\');">Themes</div>' +
    '           <div class="tab-bar-item bd-tab" id="bd-other-tab" onclick="settingsPanel.changeTab(\'bd-other-tab\');">Other</div>' +
    '       </div>' +
    '       <div class="bd-settings">' +
    '' +
    '               <div class="bd-pane control-group" id="bd-settings-pane" style="display:none;">' + 
    '                   <ul class="checkbox-group">';
    
    
    
    for(var setting in settings) {

        var sett = settings[setting];
        var id = sett["id"];

        if(sett["implemented"]) {

            settingsInner += '' +
            '<li>' +
                '<div class="checkbox" onclick="settingsPanel.updateSetting(this);" >' +
                    '<div class="checkbox-inner">' +
                        '<input type="checkbox" id="'+id+ '" ' + (settingsCookie[id] ? "checked" : "") + '>' +
                        '<span></span>' +
                    '</div>' +
                    '<span>' + setting + " - " + sett["info"] +
                    '</span>' +
                '</div>' +
            '</li>';
        }
    }
    
    var ccss = atob(localStorage.getItem("bdcustomcss"));
    self.applyCustomCss(ccss);
    
    settingsInner += '</ul>' +
        '               </div>' +
        '' +
        '               <div class="bd-pane control-group" id="bd-customcss-pane" style="display:none;">' +
        '                   <textarea id="bd-custom-css-ta">' + ccss + '</textarea>' +
        '               </div>' +
        '' +
        '               <div class="bd-pane control-group" id="bd-plugins-pane" style="display:none;">' +
        '                   <table class="bd-g-table">' +
        '                       <thead><tr><th>Name</th><th>Description</th><th>Author</th><th>Version</th><th></th><th></th></tr></thead><tbody>';

    $.each(bdplugins, function () {
        var plugin = this["plugin"];
        settingsInner += '' +
            '<tr>' +
            '   <td>' + plugin.getName() + '</td>' +
            '   <td width="99%"><textarea>' + plugin.getDescription() + '</textarea></td>' +
            '   <td>' + plugin.getAuthor() + '</td>' +
            '   <td>' + plugin.getVersion() + '</td>' +
            '   <td><button class="bd-psb" onclick="pluginModule.showSettings(\'' + plugin.getName() + '\'); return false;"></button></td>' +
            '   <td>' +
            '       <div class="checkbox" onclick="pluginModule.handlePlugin(this);">' +
            '       <div class="checkbox-inner">' +
            '               <input id="' + plugin.getName() + '" type="checkbox" ' + (pluginCookie[plugin.getName()] ? "checked" : "") + '>' +
            '               <span></span>' +
            '           </div>' +
            '       </div>' +
            '   </td>' +
            '</tr>';
    });

    settingsInner += '</tbody></table>' +
    '               </div>' +
    '               <div class="bd-pane control-group" id="bd-themes-pane" style="display:none;">';
    
    
    if(typeof(themesupport2) === "undefined") {
    settingsInner += '' +
    '                   Your version does not support themes. Download the latest version.';
    }else {
        settingsInner += '' +
        '                   <table class="bd-g-table">' +
        '                       <thead><tr><th>Name</th><th>Description</th><th>Author</th><th>Version</th><th></th></tr></thead><tbody>';
        $.each(bdthemes, function() {
            settingsInner += '' +
            '<tr>' +
            '   <td>'+this["name"]+'</td>' +
            '   <td width="99%"><textarea>'+this["description"]+'</textarea></td>' +
            '   <td>'+this["author"]+'</td>' +
            '   <td>'+this["version"]+'</td>' +
            '   <td>' +
            '       <div class="checkbox" onclick="themeModule.handleTheme(this);">' +
            '           <div class="checkbox-inner">' +
            '               <input id="ti'+this["name"]+'" type="checkbox" ' + (themeCookie[this["name"]] ? "checked" : "") +'>' +
            '               <span></span>' +
            '           </div>' +
            '       </div>' +
            '   </td>' +
            '</tr>';
        });
        settingsInner += '</tbody></table>';
    }
    
    
    settingsInner += '' +
    '               </div>' +
    '                     <div class="bd-pane control-group" id="bd-other-pane" style="display:none;">' +
    '                         <div class="button-group">' +
    '                             <button type="button" class="btn btn-primary" onclick="LoadJSONSettings()" id="load-json-settings">Load Settings</button>' +
    '                             <button type="button" class="btn btn-primary" onclick="SaveJSONSettings()" id="save-json-settings">Save Settings</button>' +
    '                         </div>' +
    '                     </div>' +
    '               </div>' +
    '' +
    '       </div>' +
    '   </div>' +
    '</div>';
    
    function showSettings() {
        $(".tab-bar-item").removeClass("selected");
        settingsButton.addClass("selected");
        $(".form .settings-right .settings-inner").first().hide();
        panel.show();
        if(lastTab == "") {
            self.changeTab("bd-settings-tab");
        } else {
            self.changeTab(lastTab);
        }
    }

    settingsButton = $("<div/>", {
        class: "tab-bar-item",
        text: "BetterDiscord",
        id: "bd-settings-new",
        click: showSettings
    });

    panel.html(settingsInner);

    function defer() {
        if($(".btn.btn-settings").length < 1) {
            setTimeout(defer, 100);
        }else {
            $(".btn.btn-settings").first().on("click", function() {

                function innerDefer() {
                    if($(".modal-inner").first().is(":visible")) {

                        panel.hide();
                        var tabBar = $(".tab-bar.SIDE").first();

                        $(".tab-bar.SIDE .tab-bar-item").click(function() {
                            $(".form .settings-right .settings-inner").first().show();
                            $("#bd-settings-new").removeClass("selected");
                            panel.hide();
                        });

                        tabBar.append(settingsButton);
                        panel.insertAfter(".form .settings-right .settings-inner");
                        $("#bd-settings-new").removeClass("selected");
                    } else {
                        setTimeout(innerDefer, 100);
                    }
                }
                innerDefer();
            });
        }
    }
    defer();
    
};