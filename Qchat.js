'use strict';

//简单的点X删除功能
//TODO: 撤销一次操作
function toggleDelete(){
    if (!$("#deleteMode").linkbutton("options").selected) {
        $("<span class='cross'>X</span>").insertBefore($("#main>div"));
        $(".cross").click(function(){
            $(this).next("div").remove();
            $(this).append($("<br/>"));
        });
    }else{
        $(".cross").remove();
    }
    ;
};

//图片上传预览（伪）
$(document).ready(function(){
var input = document.getElementById("emo_upload");
var imageType = /image.*/;
var getOnloadFunc = function(aImg) {
    return function(evt) {
        aImg.src = evt.target.result;
    };
}
input.addEventListener("change", function(evt) {
    for (var i = 0, numFiles = this.files.length; i < numFiles; i++) {
        var file = this.files[i];
        if (!file.type.match(imageType)) {
            continue;
        }

        //在body末尾生成预览
        var img = document.createElement("img");
            img.id = "emo-preview"
        document.body.appendChild(img);

        var reader = new FileReader();
        reader.onload = getOnloadFunc(img);
        reader.readAsDataURL(file);
    }
}, false);
})

//获取昵称&正文&时间 并 调用appendDiv()生成一块对话div
//TODO 昵称下拉框 自定义字体

function submitForm(){
    var messageIn = document.getElementById("message").value;
    var idIn = document.getElementById("user_id").value;
    var timeIn = $("#time").timespinner("getValue");

    //注意这是个img标签
    var emoIn = document.getElementById("emo-preview");
    if (messageIn != "" || emoIn != null) {
        //内容/表情包不为空时

        //所有回车转换
        messageIn = messageIn.replace(/[\r\n]/g,"<br />");
        appendDiv(idIn,messageIn,timeIn);
        if (emoIn != null){
            //去掉"emo-preview" id防止被删
            $(emoIn).removeAttr("id");
            $("#main>div:last>p").append(emoIn);
        }

        var idColour = $("input[name=idColour]:checked").val();
        //alert(idColour);
        if (idColour == "green") {
            $("#main>div:last>h3").css("color","green");
        }
        // $("#message").val("");
        reset($("#emo_upload"));
        reset($("#message"));
    }else{
        //软性提醒
        $("#message").attr("placeholder","内容为空无法发送");
    }
    //防止页面刷新
    return false;
}
//添加一个新的消息div
function appendDiv(id,message,time){
    var mainDiv = $("#main");
    //一层层插入
    var newDiv = $("<div></div>");
    var newh3 = $("<h3>"+id+"&emsp;</h3>");
    $("<span>"+time+"</span>").appendTo(newh3);
    newh3.appendTo(newDiv);
    $("<p>"+message+"</p>").appendTo(newDiv);
    //添加在main末尾
    mainDiv.append(newDiv);
    //触发设定img为缩放的function
    $("#main").trigger("newDivAdded")
}

//重置（表格）
//这段出自StackOverFlow
window.reset = function (e) {
    e.wrap('<form>').closest('form').get(0).reset();
    e.unwrap();
}

//然而id重复的时候只会清理掉第一个img
function clearEmo(){
    reset($("#emo_upload"));
    $("#emo-preview").remove();
}
//直接用外链生成emo-preview
function insertLink(){
    // var textTag = "<img src='"+$("#img_link").val()+"' alt='linkImg'>";
    // $("#message").val($("#message").val() + textTag);
    if ($("#img_link").val() != "") {
        $("<img id='emo-preview' src='"+
            $("#img_link").val()+"'>").appendTo("body");
        $("#img_link").val("");
    }
}

$(document).on("newDivAdded", "#main", function() {
    //easyloader导入模块
var JEUIplugins = new Array("draggable","droppable","resizable");
using(JEUIplugins,function(){
    $("img").draggable({
                revert: true,
                //防止拖动边缘触发缩放
                edge: 6,
                cursor: 'move',
                onStartDrag:function(){
                    $(this).draggable('options').cursor='not-allowed';
                },
                onStopDrag:function(){
                    $(this).draggable('options').cursor='auto';
                    $(".dBox").remove();
                }
            }).resizable({
                maxWidth:500,
                maxHeight:500,
            });
    $("p").droppable({
                accept: "img",
                // onDragOver:function(e,source){
                //     console.log("OVER");
                // },
                onDragEnter:function(e,source){
                    $(source).draggable('options').cursor='auto';
                    $(this).addClass('over');
                },
                onDragLeave:function(e,source){
                    $(source).draggable('options').cursor='not-allowed';
                    $(this).removeClass('over');
                },
                onDrop:function(e,source){
                    $(this).append(source)
                    $(this).removeClass('over');
                }
            })

    // //问题是什么时候触发
    // function dottedBox(){
    //     // var dropBox=$("<div class='dBox'></div>")
    //     // dropBox.appendTo("p");
    //     $(".dBox").droppable({
    //             accept: "img",
    //             onDragEnter:function(e,source){
    //                 $(source).draggable('options').cursor='auto';
    //                 $(this).addClass('over');
    //                 console.log("Enter");
    //             },
    //             onDragLeave:function(e,source){
    //                 $(source).draggable('options').cursor='not-allowed';
    //                 $(this).removeClass('over');
    //                 console.log("Leave");
    //             },
    //             onDrop:function(e,source){
    //                 // console.log($(this).droppable('options'));
    //                 $(this).after(source)
    //                 $(this).removeClass('over');
    //                 console.log("Dropped");
    //             }
    //         });
    // };
//下面两个千万别动
    });
});