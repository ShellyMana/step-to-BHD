<template>
  <opening-animation v-if="!toClose" :timeForScreen="timeForScreen">
  </opening-animation>
</template>

<script>
import OpeningAnimation from "./OpeningAnimation.vue";

export default {
  name: "StartingPages",
  components: {
    OpeningAnimation,
  },
  data() {
    return {
      toClose: false,
      timeForScreen: 5000,
      lessTimeIfLogged: 2000,
     };
  },

  mounted() {
    setTimeout(() => {
      this.toClose = true;
      this.$router.push('/home');
    }, this.timeForScreen);
  },
  
  methods: {
  },
};
</script>
