$('.selector').click(
    function trySelectFunction(){
        $('.solve').hide();
        $('.solve#' + $(this)[0].id).show();
    }
)