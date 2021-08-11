import Vue from 'vue';

function hasPermission(parms) {
    const str = String(parms)
    const authoritys = JSON.parse(sessionStorage.getItem("authoritys"))
    return authoritys.indexOf(str) > -1;
}

Vue.directive('hasBtn', {
    inserted: (el, binding, vnode) => {
        if (!hasPermission(binding.value)) {
            el.parentNode.removeChild(el)
        }
    }
});