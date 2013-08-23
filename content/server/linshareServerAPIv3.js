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

if ( typeof(LinshareServerAPIBase) == "undefined" ) {
    var scriptLoader = Components
                            .classes["@mozilla.org/moz/jssubscript-loader;1"]
                            .createInstance(Components.interfaces.mozIJSSubScriptLoader);
    
    scriptLoader.loadSubScript("chrome://linshare/content/server/linshareServerAPIBase.js");

//    nsIMsgCompFields: Components.classes["@mozilla.org/messengercompose/composefields;1"]
//	                         .getService(Components.interfaces.nsIMsgCompFields);

}

function LinshareServerAPIv3() {
	this.logInfo("using api : linshareServerAPIv3");
}

LinshareServerAPIv3.prototype = {
    __proto__: new LinshareServerAPIBase(),
    
    uploadFileUrl: function (url) {
        return url + "/webservice/rest/document/upload";
    },
    
    multipleShareDocumentsUrl: function (url) {
        return url + "/webservice/rest/share/multiplesharedocuments";
    },

    pluginInfoUrl: function (url) {
        return url + "/webservice/rest/plugin/information";
    },
    
    uploadFile: function (serverInfo, attachment, callback) {        
        var file = this.openFile(attachment.url);
	this.logInfo("uploading file : " + attachment.name);
        var request = this.newFileUploadRequest(file, attachment.name, this.uploadFileUrl(serverInfo.url), true, serverInfo.username, serverInfo.password);
        
        request.setRequestHeader("Accept", "application/json");
        request.onreadystatechange = function (e) {
            if (request.readyState == 4) {
		this.logInfo("upload request status : " + request.status)
                if (request.status == 200) {
                    try {
                        var doc = JSON.parse(request.responseText);
                        callback.success(doc.uuid, file);
                    } catch(e) {
    		        Components.utils.reportError("error : " + request.status + " : " + e);
                        callback.error(request.status, e);
                    }
                } else {
    		    Components.utils.reportError("request error code : " + request.status);
                    callback.error(request.status);
                }
            }
        };

        try {
            request.sendFile();
        } catch(e) {
            callback.error(-1, e);
        }
        
        return request;
    },
    
    shareMultipleFiles: function (serverInfo, fileIds, recipient) {
        var fileParams = "";
        
        for (var i=0; i < fileIds.length; i++) {
            fileParams += "&file=" + fileIds[i];
        }

	Components.utils.reportError("LinShare: coucou ");

//	Components.utils.reportError(this.nsIMsgCompFields);
//	Components.utils.reportError(this.nsIMsgCompFields.messageId);
//	Components.utils.reportError(this.nsIMsgCompFields.replyTo);
//	Components.utils.reportError(this.nsIMsgCompFields.subject);

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
