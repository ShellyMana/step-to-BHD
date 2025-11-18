<template>
    <div class="games" v-if="gameType == null" :key="0" :data-index="0">
      <ion-text class="text-dark-plain note animate__animated" ref="note"
        >בחרו את הפרקים אותם תרצו לתרגל</ion-text
      >

      <chose-chaptes-circels
        :explanation="[]"
        :noCircles="noChapters"
        :circlesInfo="circlesInfo"
        :chooseOne="false"
        @circlesChosen="circlesChosen"
      ></chose-chaptes-circels>

        <slot
          ><card-with-line
            class="card-index"
            ref="slide"
            @click="choseGame(1)"
          >
            <div class="circle">
              <ion-img
                class="game-icon"
                :src="require(`@/assets/media1/HomePage/games/icons/1.png`)"
              ></ion-img>
            </div>
            <div class="title">כרטיסיות</div>
            <div class="text">העזרו בכרטיסיות</div>
          </card-with-line></slot
        >
    </div>

  <cards-game v-if="gameType == 1" :key="1" :data-index="1"></cards-game>
</template>

<script>
import CardsGame from "./Games/CardsGame.vue";
import ChoseChaptesCircels from "@/components/reuse/ChoseChaptesCircels.vue";
import CardWithLine from "@/components/reuse/CardWithLine.vue";

import gamesInfo from "@/json/games/gamesInfo.json";
import ChapterInfo from "@/json/chapters/ChapterInfo";
import { IonText, IonImg } from "@ionic/vue";

import { mapState, mapMutations, mapActions } from "vuex";

export default {
  name: "SubMenu3",
  components: {
    CardWithLine,
    IonImg,
    IonText,
    CardsGame,
    ChoseChaptesCircels,
  },

  data() {
    return {
      slidesNum: null,
      gamesInfo: gamesInfo,
      ChapterInfo: ChapterInfo,
      circlesInfo: [],
      noChapters: 10,
    };
  },

  computed: {
    ...mapState("returning", ["backToSubMenu3"]),
    ...mapState("games", ["gameType", "chosenChapters"]),
  },

  created() {
    for (let i = 0; i < this.noChapters; i++)
      this.circlesInfo[i] = this.ChapterInfo[i].title;
  },

  methods: {
    ...mapMutations("navigation", ["hideNavi", "toggleMiniIcon"]),
    ...mapActions("games", ["setGameType", "addOrRemoveChap"]),
    ...mapActions("returning", ["setReturningFunc"]),

    choseGame(noGame) {
      if (this.chosenChapters.length == 0) {
        this.$refs.note.$el.classList.add("animate__flash");

        setTimeout(() => {
          this.$refs.note.$el.classList.remove("animate__flash");
        }, 500);
        return;
      }

      setTimeout(() => {
        this.toggleMiniIcon();
      }, 500);

      this.setReturningFunc(2);
      this.setGameType(noGame);
      this.hideNavi();
    },

    circlesChosen(listOfCircles, noChap) {
      this.addOrRemoveChap(noChap);
    },
  },
};
</script>

<style scoped>
.games > * {
  transition: opacity 0.2s linear;
}

.circle {
  position: relative;
  top: -5dvh;
  background-color: var(--ion-color-secondary-tint);
  height: 10dvh;
  width: 10dvh;
  border-radius: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 1dvh;
  font-size: 3.5dvh;
  font-weight: 700;
  color: var(--ion-color-medium);
  text-shadow: none;
}
.game-icon {
  width: 7dvh;
  height: 7dvh;
}

.title {
  position: relative;
  top: -7dvh;
  width: 100%;
  height: 9dvh;
  padding: 3dvh;
  color: var(--ion-color-medium);
  text-shadow: none;
  font-weight: 700;
  font-size: 3dvh;
  border-bottom: solid 1dvh var(--ion-color-secondary-tint);
}

.text {
  position: relative;
  transform: translateY(-70%);
  font-size: 2.5dvh;
  padding: 0%;
  color: var(--ion-color-medium);
  text-shadow: none;
  width: 90%;
  height: 6dvh;
  font-weight: 500;
}

.blue-circle {
  background: var(--ion-color-primary-tint-light);
  height: 5dvh;
  width: 5dvh;
  margin: 1%;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 100%;
  font-weight: 800;
  transition: 0.2s linear;
}

.box {
  display: grid;
  width: 100%;
  height: fit-content;
  padding: 5% 10%;
  align-self: center;
  grid-template-columns: auto auto auto auto auto;
  row-gap: 10%;
  column-gap: 0%;
  align-items: center;
  justify-items: center;
}

.games {
  position: relative;
  top: -7%;
  animation: fade-scale 0.5s 1 forwards;
}

.circle-chosen {
  background-color: var(--ion-color-primary);
  color: var(--ion-color-secondary-tint);
}

</style>

<style>
.swiper-pagination {
  position: relative;
  top: 0;
}

.swiper-pagination-bullet-active {
  margin-top: 10dvh;
  background-color: var(--ion-color-primary);
}

</style>
