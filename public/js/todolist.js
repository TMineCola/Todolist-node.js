var App = (function(){

    var todos = null;

    /* 綁定事件 */
    function _bindEvent() {
        console.log("Event binding now...");
        $('#add').on('click', _handleAddEvent);
        // 綁定條件在 class='todolist'底下且擁有class='delete-icon'之元素
        $('#todolist').on('click', '.card-block .delete-icon', _handleDeleteEvent)
        $('#clear').on('click', _clear);
        console.log("Event binding sucessful!");
    }

    /* 新增TODO */
    function _handleAddEvent() {
        let content = $('#inputContent').val();
        let list = $('#todolist');
        let title = '快速便籤';
        $.ajax({
            method: "POST",
            url: "/add",
            data: {
                'title': title,
                'time': Date(),
                'content': content
            }
        })
        .done(function( data ) {
            // 新增成功, 重新render頁面
            list.html('');
            $('.loading').css('display', 'block');
            $('.container-fluid').css('display', 'none');
            for(let key in data.result) {
                list.append(`
                <div class="card m-2">
                    <div class="card-block p-2" data-key="${key}">
                        <div class="d-flex mb-2 justify-content-between">
                            <span class="h4 mb-0 card-title">${data.result[key].title} <small class="h6 text-muted">${data.result[key].time}</small></span>
                            <i class="delete-icon mt-1 mr-1 justify-content-end fas fa-times"></i>
                        </div>
                        <p class="card-text">${data.result[key].content}</p>
                    </div>
                </div>
                `);
            }
            $('.loading').css('display', 'none');
            $('.container-fluid').css('display', 'block');
            console.log("Added and successful render");
        })
        .fail(function( data ){
            // 新增失敗, 跳訊息
            alert("Failed!");
        }
        );
        $('#inputContent').val('');
    }

    /* 刪除TODO */
    function _handleDeleteEvent() {
        let key = $(this).parents('.card-block').attr('data-key');
        let self = $(this).parents('.card');
        $.ajax({
            method: "POST",
            url: "/remove",
            data: {
                'id': key
            }
        })
        .done(function( data ) {
            // 成功刪除, 刪除自己
            self.remove();
        })
        .fail(function( data ){
            // 失敗, 跳訊息
            alert("Failed!");
        }
        );
    }

    function _clear() {
        $.ajax({
            method: "PUT",
            url: "/remove"
        })
        .done(function( data ) {
            // 成功
            let list = $('#todolist');
            list.html('');
            console.log("Clear sucessful!");
        })
        .fail(function( data ){
            // 失敗跳訊息
            alert("Failed!");
        }
        );
    }

    function init() {
        console.log("Initialzating!");
        _bindEvent();
        console.log("Initialzation sucessful!");
    }

    return {
        init
    };
})();