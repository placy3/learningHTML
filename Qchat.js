'use strict';

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
        //TODO 按submit按钮的时候把这个移到正文里去
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
//TODO 昵称下拉框
//表情包就再说啦
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
            //去掉"emo-preview" id
            $(emoIn).removeAttr("id");
            //使用easyloader加载resizable模块使用到的相关js和css样式
            easyloader.load('resizable',function(){
            //创建对象
                //偷个懒直接把所有img加上缩放了
                $("img").resizable({
                    maxWidth:400,
                    maxHeight:300
                })
            });

            $("#main div:last").append(emoIn);
        }

        var idColour = $("input[name=idColour]:checked").val();
        //alert(idColour);
        //选中main末尾的div中的h3，把color改成green
        if (idColour == "green") {
            $("#main div:last>h3").css("color","green");
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
}

//重置（表格）
window.reset = function (e) {
    e.wrap('<form>').closest('form').get(0).reset();
    e.unwrap();
}
//清除File input和末尾的<img>
function clearEmo(){
    reset($("#emo_upload"));
    $("#emo-preview").remove();
}
// function makeResizable(){
// //使用easyloader加载resizable模块使用到的相关js和css样式
//     easyloader.load('resizable',function(){
//         //创建对象
//         $("div").each(function(){
//             $(this).resizable({

//             })
//         })
//     });
// }