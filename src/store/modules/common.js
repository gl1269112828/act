
const getDefaultState = () => {
    return {
        conditionList: [
            { name: "等于", value: "Equal" },
            { name: "不等于", value: "NotEqual" },
            { name: "包含", value: "Like" },
            { name: "大于", value: "GreaterThan" },
            { name: "大于等于", value: "GreaterThanOrEqual" },
            { name: "小于", value: "LessThan" },
            { name: "小于等于", value: "LessThanOrEqual" }
        ],
    };
};
const state = getDefaultState();
const mutations = {
    RESET_STATE: state => {
        Object.assign(state, getDefaultState());
    }
};
const actions = {
    //初始化对象
    initObj({ }, parm) {
        return new Promise((resolve, reject) => {
            Object.keys(parm).forEach(key => {
                parm[key] = undefined;
            })
            resolve(parm)
        })
    }
}
export default {
    namespaced: true,
    state,
    mutations,
    actions,
};
