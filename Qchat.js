'use strict';

//简单的点X切换可见状态功能
function toggleDelete(){
    if (!$("#deleteMode").linkbutton("options").selected) {
        //遍历.cross元素，根据其后div是否显示而改变文字
        function changeX(){
            $(".cross").each(function(){
            var followingDiv = $(this).next("div");
            if (followingDiv.css("display") == "none") {
                $(this).text("还原");
            }else{
                $(this).text("X");
            }
            });
        };
        $("<span class='cross'></span>").insertBefore($("#main>div"));
        changeX();
        $(".cross").click(function(){
            $(this).next("div").toggle();
            changeX();
        });
    }else{  //第二次按下时
        $(".cross").remove();
    };
};

function toggleImgDrop(){
    if (!$("#dropMode").linkbutton("options").selected){
        var dottedBox = $("<div class='dBox'></div>")
        //暂时还无法做到插到文字前方
        dottedBox.insertBefore($(".Qtext"));
        dottedBox.insertAfter($(".Qtext"));
        makeDropBox();
        // console.log("droppable");
    }else{
        $(".dBox").remove();
    }
};
//使虚线框可接受图片
function makeDropBox(){
    using(JEUIplugins,function(){
        $(".dBox").droppable({
                accept: "img",
                onDragEnter:function(e,source){
                    $(source).draggable('options').cursor='auto';
                    $(this).addClass('over');
                },
                onDragLeave:function(e,source){
                    $(source).draggable('options').cursor='not-allowed';
                    $(this).removeClass('over');
                },
                onDrop:function(e,source){
                    $(this).after(source)
                    $(this).removeClass('over');
                }
            });
    });
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
    //内容/表情包不为空时
    if (messageIn != "" || emoIn != null) {
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
    var newp = $("<p class='Qtext'>"+message+"</p>");

    newp.css("font-size", $("#avatar").data("font-size"));
    newp.css("color", $("#avatar").data("font-color"));

    newp.appendTo(newDiv);
    //添加在main末尾
    mainDiv.append(newDiv);
    //触发设定img为缩放的function
    $("#main").trigger("newDivAdded")
}

//重置（表格）
//这段出自StackOverFlow
window.reset = function(e){
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

    //easyloader导入模块
var JEUIplugins = new Array("draggable","droppable","resizable");
//新增对话时触发
$(document).on("newDivAdded", "#main", function() {
using(JEUIplugins,function(){
    $("img").draggable({
                revert: true,
                //防止拖动边缘触发缩放
                edge: 4,
                cursor: 'move',
                onStartDrag:function(){
                    $(this).draggable('options').cursor='not-allowed';
                },
                onStopDrag:function(){
                    $(this).draggable('options').cursor='auto';
                }
            }).resizable({
                maxWidth:500,
                maxHeight:500,
            });

        $("p").droppable({
                accept: "img",
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
            });

//下面两个千万别动
    });
});