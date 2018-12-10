function textToMat(text){
    var lines = $.trim(text).split(/\n/);
    var matMap = new Array();
    for (i in lines){
        matMap[i] = $.trim(lines[i]).split(" ");
    }
    var M = $M(matMap);
    if (M == null){
        prompt_fail("输入矩阵格式错误");
    }
    return M;
}

function matToText(mat){
    var text = new String('');
    for (i = 1; i <= mat.rows(); i++){
        var vec = mat.row(i);
        for (j = 1; j <= vec.dimensions(); j++){
            text += (vec.e(j) + '\t');
        }
        text += '\n';
    }
    return text;
}

function randomMat(id){
    var mat = new String('');
    for (i = 0; i < 5; i++){
        for (j = 0; j < 5; j++){
            mat += Math.floor(Math.random() * 10);
            mat += ' ';
        }
        mat += '\n';
    }
    $(id).val(mat);
}

$('.selector').click(
    function trySelectFunction(){
        $('.solve').hide();
        $('.solve#' + $(this)[0].id).show();
        prompt_info("进入" + $(this).html() + "模式");
    }
)

$('#inverse-solve').click(
    function trySolveInverse(){
        var A = textToMat($('#inverse-input').val());
        var A_inv = A.inverse();
        var ret = "求解失败";
        if (A_inv == null){
            prompt_warning("该矩阵无法求逆");
        }else{
            prompt_success("求逆成功");
            ret = matToText(A_inv);
        }
        $('#inverse-output').val(ret);
    }
)

$('#rank-solve').click(
    function trySolveRank(){
        var A = textToMat($('#rank-input').val());
        var A_rank = A.rank();
        prompt_success("求秩成功");
        $('#rank-output').val(A_rank);
    }
)


$('#det-solve').click(
    function trySolveRank(){
        var A = textToMat($('#det-input').val());
        var A_det = A.determinant();
        var ret = '求解失败';
        if (A_det == null){
            prompt_warning("该矩阵无法求行列式");
        }else{
            prompt_success("求行列式成功");
            ret = A_det;
        }
        $('#det-output').val(ret);
    }
)