<template>
  <div class="container" v-if="!inExam">
    <card-with-line :title="title">

      <chose-chaptes-circels
        :explanation="[]"
        :noCircles="noChapters"
        :circlesInfo="circlesInfo"
        :disableAudio="disableAudio"
        :chooseOne="false"
        @circlesChosen="circlesChosen"
      ></chose-chaptes-circels>
      <ion-button @click="startExam" class="btn" :disabled="!isChosen" 
        >בחן אותי</ion-button
      >
    </card-with-line>
  </div>
  <trivia-game
  v-if="inExam"
  :chaptersChosen="chaptersChosen"
    :type="gameType"
    :exam="-1"
    :key="3"
    :data-index="1"
  ></trivia-game>
</template>

<script>
import CardWithLine from "@/components/reuse/CardWithLine.vue";
import ChoseChaptesCircels from "@/components/reuse/ChoseChaptesCircels.vue";
import TriviaGame from "../SubMenu3/Games/Trivia/TriviaGame.vue";
import { mapState, mapMutations, mapActions } from "vuex";
import { IonButton } from "@ionic/vue";
import ChapterInfo from "@/json/chapters/ChapterInfo";
import trivia from "@/json/games/trivia.json";


export default {
  name: "SubMenu1",
  components: { CardWithLine, ChoseChaptesCircels, IonButton, TriviaGame },

  data() {
    return {
      explanation: [
  
      ],
      gameType: "5",
      // noChapters: 11,
      // circlesInfo: Array.from({ length: 11 }, (_, i) => `פרק ${i+1}`),
      // disableAudio: 11,

      circlesInfo: [],
      disableAudio: trivia.length,
      ChapterInfo,
      noChapters: trivia.length,
      title: "בחר את הפרקים עליהם תרצו להיבחן",
      disableBtn: true,
      inExam: false,
      chaptersChosen: [],
      isChosen: false
    };
  },

  computed: {
    ...mapState("returning", ["backToSubMenu1"]),
  },

  created() {
  this.circlesInfo = this.ChapterInfo.map((c) => c.title);
}
,

  methods: {
    ...mapMutations("navigation", ["hideNavi", "toggleMiniIcon", "smallNavi"]),
    ...mapActions("games", ["setGameType", "addOrRemoveChap"]),
    ...mapActions("returning", ["setReturningFunc"]),

    circlesChosen(noChap) {
      this.addOrRemoveChap(noChap);
this.chaptersChosen = noChap
if (Object.values(this.chaptersChosen).some(val => val === true)){
  this.isChosen = true;
} else {
  this.isChosen = false;
}
},

    startExam() {
      this.inExam = true;
      this.setReturningFunc(3);
      this.hideNavi();
      this.smallNavi();
      this.setGameType(5)

      setTimeout(() => {
        this.toggleMiniIcon();
      }, 500);

    
    },
  },

  watch: {
    backToSubMenu1: {
      handler() {
        if (this.backToSubMenu1) {
          this.exam = -1;
          this.inExam = false;
        }
      },
    },
  },
};
</script>

<style scoped>
* {
  transition: all 0.5s ease;
}
.container {
  width: 100%;
  height: fit-content;
  border-radius: 2dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4% 0 4%;
  transition: all 0.5s ease;
  font-size: 1.2rem;
  flex-direction: column;
  position: relative;
  top: -6%;
}

.btn {
  --border-radius: 3dvh;
  font-size: 100%;
}
</style>
