// 2020-04-16 08:00:13
//Vue builder
//lets you register different vue attributes in separate modular FileList.
//attrs like mounted created, etc. will be executed sequencially


! function() {

    if (typeof Vue != 'function') throw 'function Vue() could not be found!';

    let vueTemplateObj = {} // demo vue object, acts as reference and blueprint
    let keyWhiteList = [] // key white list built from vueObjectTemplate
    let vueHooksObj = { // Object gets populated with Hook fubctions
        hookName: [
            function() {},
            function() {}
        ]
    }


    vueTemplateObj = {
        el: '',
        data: {},
        methods: {},
        computed: {},
        watch: {},
        beforeCreate: function() {},
        created: function() {},
        beforeMount: function() {},
        mounted: function() {},
        beforeUpdate: function() {},
        updated: function() {},
        beforeDestroy: function() {},
        destroyed: function() {}
    }

    keyWhiteList = function(vueObjectTemplate) {
        let keyWhiteList = [];
        for (let key in vueObjectTemplate) {
            keyWhiteList.push(key);
        }
        return keyWhiteList;
    }(vueTemplateObj);

    vueHooksObj = function(vueObjectTemplate) {
        let vueHooksObj = {};
        for (let key in vueObjectTemplate) {
            if (typeof vueObjectTemplate[key] == 'function') {
                vueHooksObj[key] = [];
            }
        }
        return vueHooksObj;
    }(vueTemplateObj);


    // ******************** Add Functions to Vue Object *******************
    Vue.inspectBuilder = function() {
        return {
            functions: vueHooksObj,
            keyWhiteList: keyWhiteList
        }
    }
    Vue.add = function(vueDataObj) {
        for (let key in vueDataObj) {

            if (keyWhiteList.indexOf(key) == -1) { throw 'key "' + key + '" not supported!'; }
            if (typeof vueTemplateObj[key] != typeof vueDataObj[key]) { throw 'key "' + key + '" should be of type ' + (typeof vueTemplateObj[key]); }

            switch (typeof vueTemplateObj[key]) {
                case 'object':
                    //console.log('merge obj')
                    vueTemplateObj[key] = Object.assign(vueTemplateObj[key], vueDataObj[key])
                    break;
                case 'function':
                    vueHooksObj[key].push(vueDataObj[key]);
                    break;
                default:
                    vueTemplateObj[key] = vueDataObj[key]
                    break;

            }

        }
    }
    Vue.build = function() {
        // builds a function that runs all registered subfunctions

        for (let hookName in vueHooksObj) {
            vueTemplateObj[hookName] = function() {
                // this is the vue object
                for (let indexInnerFunc in vueHooksObj[hookName]) {
                    // bind this / the vue object to the functions and execute
                    vueHooksObj[hookName][indexInnerFunc].call(this);
                }
            }
        }
        return new Vue(vueTemplateObj);
    }.bind(this)
}.apply(Vue)