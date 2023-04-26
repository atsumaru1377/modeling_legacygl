const initMat = (height, width) => {
    var mat = [];
    for (let i = 0; i < height; i++) {
    mat[i] = [];
    for (let j = 0; j < width; j++) {
        mat[i][j] = 0;
    }
    }
    return mat
}

const unitMat = (size) => {
    var mat = [];
    for (let i = 0; i < size; i++) {
    mat[i] = [];
    for (let j = 0; j < size; j++) {
        if (i == j) {
        mat[i][j] = 1;
        } else {
        mat[i][j] = 0;
        }
    }
    return mat;
    }
}

const addMat = (mat1, mat2) => {
    const height = mat1.length;
    const width = mat1[0].length;
    var ret_mat = initMat();
    for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
        ret_mat[i][j] = mat1[i][j] + mat2[i][j];
    }
    }
    return ret_mat;
}

const subMat = (mat1, mat2) => {
    const height = mat1.length;
    const width = mat1[0].length;
    var ret_mat = initMat();
    for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
        ret_mat[i][j] = mat1[i][j] - mat2[i][j];
    }
    }
    return ret_mat;
}

const matVecProduct = (mat, vec) => {
    const height = mat.length;
    const width = mat[0].length;
    var ret_vec = Array(height).fill(0);
    for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
        ret_vec[i] += mat[i][j] * vec[j];
    }
    }
    return ret_vec;
}

const matMatProduct = (mat1, mat2) => {
    const height1 = mat1.length;
    const height2 = mat2.length;
    const width1 = mat1[0].length;
    const width2 = mat2[0].length;
    const ret_mat = initMat(height1, width2);
    if (width1 != height2) {
    return;
    }
    for (let i = 0; i < height1; i++) {
    for (let j = 0; j < width2; j++) {
        for (let k = 0; k < height1; k++) {
        ret_mat[i][j] += mat1[i][k] * mat2[k][j];
        }
    }
    }
    return ret_mat;
}

const MyMat = {
    init : initMat,
    unit : unitMat,
    add : addMat,
    sub : subMat,
    vecMul : matVecProduct,
    matMul : matMatProduct   
}

export default MyMat;