/*!
 * ifunction.DropZoneAjax
 * http://github.com/rynnwang/DropZoneAjax
 *
 * Description:
 * Provide Javascript function for customizing ajax form submit within file upload (including click to upload and drop to upload). 
 * Compared with other library, like DropZone.js, this file help to implement more customization and less limitation.
 * It is still a good sample to show how to submit with both form data (key-value fields) and binaries in one ajax function, using $.ajax().
 * 
 * Dependency:
 * jQuery
 *
 * Copyright 2005, Rynn Wang
 *
 */

function dropZoneAjax(formInstance, dropArea, url, httpMethod, dataType, progressFn, beforeSendFn, successFn, errorFn) {

    if (formInstance && dropArea) {
        var dropbox = $(dropArea)[0];
        dropbox.ondragover = dropbox.ondragenter = function (e) {
            e.stopPropagation();
            e.preventDefault();
        };
        dropbox.addEventListener("drop", function (e) {
            e.stopPropagation();
            e.preventDefault();

            var dt = e.dataTransfer;
            var files = dt.files;

            commitForm(formInstance, files[0], url, httpMethod, dataType, progressFn, beforeSendFn, successFn, errorFn);
        }, false);

        $(formInstance).find("input:file").change(function (e) {
            commitForm(formInstance, null, url, httpMethod, dataType, progressFn, beforeSendFn, successFn, errorFn);
        });

        $(dropArea).click(function (e) {
            formInstance.find("input:file").click();
        });
    }
}

function commitForm(formInstance, file, url, httpMethod, dataType, progressFn, beforeSendFn, successFn, errorFn) {
    if (file) {
        $(formInstance).find('input:file').remove();
    } else {
        file = $(formInstance).find('input:file').first().prop("files")[0];
    }

    var formData = new FormData($(formInstance)[0]);
    if (file) {
        formData.append('file', file);
    }

    $.ajax({
        url: url,
        type: httpMethod,
        dataType: dataType || "json",
        xhr: function () {
            var myXhr = $.ajaxSettings.xhr();
            if (myXhr.upload && progressFn) {
                myXhr.upload.addEventListener('progress', progressFn, false);
            }
            return myXhr;
        },
        beforeSend: beforeSendFn,
        success: successFn,
        error: errorFn,
        data: formData,
        cache: false,
        contentType: false,
        processData: false
    });
}