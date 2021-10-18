$(document).ready(function () {
    $('.ui.modal').modal();
    $('#uploadButton').on('click', function () {
        $('.ui.modal').modal('show');
    });
    var holder = $('#holder');
    holder.on('drop', function (e) {
        e.preventDefault();
        $(this).removeClass('hover');
        var file = e.originalEvent.dataTransfer.files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#output').show();
            $('.ui.modal').modal('hide');
            var result = reader.result;
            result = result.split('\n').join('<br>');
            $('#output').html(result);
        };
        reader.readAsText(file);
    });
    holder.on('dragover', function (e) {
        e.stopPropagation();
        e.preventDefault();
        $(this).addClass('hover');
    });
    holder.on('dragleave', function (e) {
        e.preventDefault();
        $(this).removeClass('hover');
    });
});