<template>
  <transition-group tag="div" class="trivia" appear name="fadeA" mode="out-in">
    <count-down
      :key="0"
      @timerEnd="this.stage = 'game'"
      v-if="stage == 'timer'"
    ></count-down>

    <div class="box" v-else :key="1">
   
      <trivia-questions
      :chaptersChosen="chaptersChosen"
      ></trivia-questions>
    </div>
  </transition-group>
</template>

<script>
import CountDown from "./CountDown.vue";
import TriviaQuestions from "./TriviaQuestions.vue";
import {mapActions } from "vuex";

export default {
  name: "TriviaGame",
  components: { CountDown, TriviaQuestions},

  props: ["chaptersChosen" ,"exam"],
  data() {
    return {
      stage: "timer",
      noCorrect: 0,
      noWrong: 0,
    };
  },

  methods: {
    ...mapActions("games", ["resetPicked", "updatequestNum"]),
 
    endGame() {
      this.stage = "end";
    },

    changeCorrect(n) {
      this.noCorrect += n;
    },

    changeWrong(n) {
      this.noWrong += n;
    },
    showReview() {
      this.updatequestNum(0)
      this.stage = "review";
    },
  },
};
</script>

<style scoped>
.trivia {
  height: 90dvh;
  display: flex;
  align-items: space-between;
  flex-direction: column;
  padding: 1% 4% ;
}

.box {
  height: 100%;
  width: 100%;
}

.trivia-icon {
  display: inline-block;
  width: 10%;
  height: 10%;
}

.transparent {
  opacity: 0;
  transition: all 0.5s ease;
}

@media only screen and (max-height: 800px) {
  .trivia {
    padding: 4%, 1%;
  }
}
</style>
