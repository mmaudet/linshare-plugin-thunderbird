/*  Linshare extension for Thunderbird: send attachments with LinShare
    http://www.linpki.org/ 
    Copyright (C) 2009 Linagora <raphael.ouazana@linagora.com>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

if ( typeof(LinshareServerAPIv2) == "undefined" ) {
    var scriptLoader = Components
                            .classes["@mozilla.org/moz/jssubscript-loader;1"]
                            .createInstance(Components.interfaces.mozIJSSubScriptLoader);
    
    scriptLoader.loadSubScript("chrome://linshare/content/server/LinshareServerAPIv2.js");

    var msg = Components
			.classes["@mozilla.org/moz/jssubscript-loader;1"]
			.createInstance(Components.interfaces.mozIJSSubScriptLoader);

}

function LinshareServerAPIv3() {
	this.logInfo("using api : linshareServerAPIv3");
}

LinshareServerAPIv3.prototype = {
    __proto__: new LinshareServerAPIv2(),
    
    shareMultipleFiles: function (serverInfo, fileIds, recipient) {
        var fileParams = "";
        
        for (var i=0; i < fileIds.length; i++) {
            fileParams += "&file=" + fileIds[i];
        }

	this.logError("coucou");
	this.logError(this.nsIMsgCompFields);
	this.logError(this.nsIMsgCompFields.messageId);
	this.logError(this.nsIMsgCompFields.replyTo);
	this.logError(this.nsIMsgCompFields.subject);

        var params = "targetMail=" + recipient + fileParams 
	params = params + "&inReplyTo=<51E6C9EA.4070506@int1.linshare.dev>&references=<51E6C9EA.4070506@int1.linshare.dev>";
        var request = this.newRequest("POST", this.multipleShareDocumentsUrl(serverInfo.url), false, serverInfo.username, serverInfo.password);
        
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.setRequestHeader("Content-length", params.length);
        request.setRequestHeader("Connection", "close");
        request.send(params);
        
        return request.status == 204;
    },

    shouldSwitchVersion: function (serverInfo) {
	return false;
    },
    
    nextVersion: function () {
        return ;
    }
};
