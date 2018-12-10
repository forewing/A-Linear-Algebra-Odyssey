function textToMat(text){
    var lines = $.trim(text).split(/\n+/);
    var matMap = new Array();
    for (i in lines){
        matMap[i] = $.trim(lines[i]).split(/\t|\s+/);
        for (j in matMap[i]){
            matMap[i][j] = parseFloat(matMap[i][j]);
        }
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

function randomMat(id, n, m){
    var mat = new String('');
    for (i = 0; i < n; i++){
        for (j = 0; j < m; j++){
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
        $('#solve-header').html("计算界面 - " + $(this).html());
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

$('#trans-solve').click(
    function trySolvetTrans(){
        var A = textToMat($('#trans-input').val());
        var A_trans = A.transpose();
        prompt_success("转置成功");
        $('#trans-output').val(matToText(A_trans));
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

$('#trace-solve').click(
    function trySolveTrace(){
        var A = textToMat($('#trace-input').val());
        var A_trace = A.trace();
        prompt_success("求迹成功");
        $('#trace-output').val(A_trace);
    }
)

$('#det-solve').click(
    function trySolveDet(){
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

$('#dim-solve').click(
    function trySolveDim(){
        var A = textToMat($('#dim-input').val());
        var A_dim = A.dimensions();
        prompt_success("求维度成功");
        $('#dim-output').val(A_dim.rows + '*' + A_dim.cols);
    }
)

function utmToRef(M){
    var T_arr = new Array();
    for (i = 1; i <= M.rows(); i++){
        vec = M.row(i);
        var vec_arr = new Array();
        var flag = 1;
        for (j = 1; j <= vec.dimensions(); j++){
            if (Math.abs(vec.e(j)) > 1e-7){
                flag = vec.e(j);
                break;
            }
        }
        for (j = 1; j <= vec.dimensions(); j++){
            vec_arr[j-1] = vec.e(j) / flag;
        }
        T_arr[i-1] = vec_arr;
    }
    return $M(T_arr);
}

function refToRef0(M){
    var T_arr = new Array();
    var index = new Array();
    for (i = 1; i <= M.rows(); i++){
        vec = M.row(i);
        for (j = 1; j <= vec.dimensions(); j++){
            if (vec.e(j) == 1){
                index[j] = i;
                break;
            }
        }
    }
    var rank = M.rank();
    for (i = 1; i <= M.rows() && i <= rank; i++){
        vec = M.row(i);
        var vec_t = vec;
        var flag = 0;
        // if (i != M.rows())
        for (j = 1; j <= vec.dimensions() && j <= rank; j++){
            if (flag == 0 && vec.e(j) == 1){
                flag = 1;
            }else if (flag != 0){
                vec_t = vec_t.subtract(M.row(index[j]).x(vec_t.e(j)));
            }
        }
        var vec_arr = new Array();
        for (j = 1; j <= vec.dimensions(); j++){
            vec_arr[j-1] = vec_t.e(j);
        }
        T_arr[i-1] = vec_arr;
    }
    return $M(T_arr);
}

$('#gauss-1-solve').click(
    function trySolveGauss1(){
        var A = textToMat($('#gauss-1-input').val());
        var A_ut = A.toUpperTriangular();
        var A_ref = utmToRef(A_ut);
        prompt_success("求行梯阵成功");
        ret = matToText(A_ref);
        $('#gauss-1-output').val(ret);
    }
)

$('#gauss-2-solve').click(
    function trySolveGauss2(){
        var A = textToMat($('#gauss-2-input').val());
        var A_ut = A.toUpperTriangular();
        var A_ref = utmToRef(A_ut);
        var A_ref0 = refToRef0(A_ref);
        prompt_success("求约化梯阵成功");
        ret = matToText(A_ref0);
        $('#gauss-2-output').val(ret);
    }
)

$('#minor-solve').click(
    function trySolveMinor(){
        var A = textToMat($('#minor-input').val());
        var B = textToMat($('#minor-input-2').val());
        var ret = A.minor(B.row(1).e(1), B.row(1).e(2), B.row(1).e(3), B.row(1).e(4));
        if (ret == null){
            prompt_warning("无法取子阵");
            $('#minor-output').val("求解失败");
        }else{
            prompt_success("取子阵成功");
            $('#minor-output').val(matToText(ret));
        }
    }
)

$('#aug-solve').click(
    function trySolveAug(){
        var A = textToMat($('#aug-input').val());
        var B = textToMat($('#aug-input-2').val());
        var ret = A.augment(B);
        if (ret == null){
            prompt_warning("两矩阵无法附加");
            $('#aug-output').val("求解失败");
        }else{
            prompt_success("附加成功");
            $('#aug-output').val(matToText(ret));
        }
    }
)

$('#aug-solve-I').click(
    function trySolveAugI(){
        A = textToMat($('#aug-input').val());
        ret = Matrix.I(A.rows());
        $('#aug-input-2').val(matToText(ret));
    }
)

$('#add-solve').click(
    function trySolveAdd(){
        var A = textToMat($('#add-input').val());
        var B = textToMat($('#add-input-2').val());
        var ret = A.add(B);
        if (ret == null){
            prompt_warning("两矩阵无法相加");
            $('#add-output').val("求解失败");
        }else{
            prompt_success("相加成功");
            $('#add-output').val(matToText(ret));
        }
    }
)

$('#sub-solve').click(
    function trySolveSub(){
        var A = textToMat($('#sub-input').val());
        var B = textToMat($('#sub-input-2').val());
        var ret = A.subtract(B);
        if (ret == null){
            prompt_warning("两矩阵无法相减");
            $('#sub-output').val("求解失败");
        }else{
            prompt_success("相减成功");
            $('#sub-output').val(matToText(ret));
        }
    }
)

$('#mul-solve').click(
    function trySolveMul(){
        var A = textToMat($('#mul-input').val());
        var B = textToMat($('#mul-input-2').val());
        var ret = A.x(B);
        if (ret == null){
            prompt_warning("两矩阵无法相乘");
            $('#mul-output').val("求解失败");
        }else{
            prompt_success("相乘成功");
            $('#mul-output').val(matToText(ret));
        }
    }
)

$('#mul-solve').click(
    function trySolveMul(){
        var A = textToMat($('#mul-input').val());
        var B = textToMat($('#mul-input-2').val());
        var ret = A.x(B);
        if (ret == null){
            prompt_warning("两矩阵无法相乘");
            $('#mul-output').val("求解失败");
        }else{
            prompt_success("相乘成功");
            $('#mul-output').val(matToText(ret));
        }
    }
)

$('#eigen-solve').click(
    function trySolveEigen(){
        var A = textToMat($('#eigen-input').val());
        prompt_fail("输入数据非法");
    }
)