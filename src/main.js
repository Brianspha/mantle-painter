import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import vuetify from "./plugins/vuetify";
import router from "./router/index";
import VSwatches from "vue-swatches";

// Import the styles too, typically in App.vue or main.js
import "vue-swatches/dist/vue-swatches.css";
Vue.config.productionTip = false;
Vue.component({
  "v-swatches": VSwatches,
});
new Vue({
  store,
  vuetify,
  router,
  render: (h) => h(App),
}).$mount("#app");
