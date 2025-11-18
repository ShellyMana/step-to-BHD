<template>
  <transition appear name="fadeA">
    <div class="ques" v-if="isGameOrReviewStage">
      <!-- Progress Bar -->
      <div class="progress-bar">
        <button
          v-for="(qIndex, n) in nofQuestions"
          :key="n"
          :class="['circle', circleClass(n)]"
          @click="changeQuest(n)"
        >
          {{ n + 1 }}
        </button>
      </div>

      <!-- Game Stage -->
      <div v-if="stage === 'game'" :key="currentQuestionIndex">
        <div class="ques-card">
          <ion-text class="text-dark-plain">{{ currentQues.ques }}</ion-text>
        </div>
        <div class="line"></div>

        <div class="answers">
          <button
            v-for="n in answerCount"
            :key="n"
            :class="['ans', answerClass(n)]"
            :disabled="isAnswered(currentQuestionIndex)"
            @click="ansPicked(n)"
          >
            <ion-text class="text-dark-plain">{{ currentQues[n] }}</ion-text>
          </button>
        </div>
      </div>

      <!-- Review Stage -->
      <div v-else-if="stage === 'review'" class="answers">
       <div class="ques-card">
  <ion-text class="text-dark-plain">{{ reviewQues.ques }}</ion-text>
</div>


        <div class="answers">
          <div
            v-for="n in answerCount"
            :key="n"
            :class="['ans', reviewAnswerClass(n)]"
          >
            <ion-text class="text-dark-plain">{{ reviewQues[n] }}</ion-text>
          </div>
        </div>

        <!-- Always show review navigation controls -->
        <div class="review-controls">
          <ion-button @click="prevReview" :disabled="reviewIndex === 0">הקודם</ion-button>
          <ion-button @click="nextReview" :disabled="isLastReview">הבא</ion-button>
        </div>

        <div class="score-summary" v-if="isLastReview">
          <p>ניקוד סופי: {{ correctAnswers }} מתוך {{ results.length }}</p>
          <p>אחוז הצלחה: {{ successRate }}%</p>
        </div>
      </div>

      <!-- Done Button -->
      <ion-button
        shape="round"
        size="large"
        v-if="type === 5"
        :class="{ transparent: !allAnswered && stage !== 'review' }"
        @click="reset"
      >
        סיימתי
      </ion-button>
    </div>
  </transition>
</template>

<script>
import { IonText, IonButton } from "@ionic/vue";
import allQuestions from "@/json/games/trivia.json";

export default {
  name: "TriviaQuestions",
  components: { IonText, IonButton },
  props: {
    chaptersChosen: Object,
    type: Number,
  },

  data() {
    return {
      stage: "game",
      selectedQuestions: [],
      nofQuestions: [],
      currentQuestionIndex: 0,
      selectedAnswer: null,
      results: [],
      reviewIndex: 0,
      allAnswered: false,
      answerCount: 4,
    };
  },

  computed: {
    isGameOrReviewStage() {
      return this.stage === "game" || this.stage === "review";
    },
    currentQues() {
      const idx = this.nofQuestions[this.currentQuestionIndex];
      return this.selectedQuestions[idx];
    },
    reviewQues() {
      const idx = this.nofQuestions[this.reviewIndex];
      return this.selectedQuestions[idx];
    },
    reviewResult() {
      return this.results[this.reviewIndex] || {};
    },
    isLastReview() {
      return this.reviewIndex === this.results.length - 1;
    },
    correctAnswers() {
      return this.results.filter((r) => r.correct).length;
    },
    successRate() {
      return Math.round((this.correctAnswers / this.results.length) * 100);
    },
  },

  beforeMount() {
    const selectedIndices = Object.entries(this.chaptersChosen)
      .filter(([_, selected]) => selected)
      .map(([index]) => Number(index));

    this.selectedQuestions = selectedIndices
      .map((index) => allQuestions[parseInt(index)])
      .flat();

    const indices = new Set();
    while (indices.size < 10 && this.selectedQuestions.length > 0) {
      indices.add(Math.floor(Math.random() * this.selectedQuestions.length));
    }

    this.nofQuestions = Array.from(indices);
  },

  mounted() {
    this.loadQuestion(0);
  },

  methods: {
    loadQuestion(index) {
      this.currentQuestionIndex = index;
      const result = this.results[index];
      this.selectedAnswer = result?.selected ?? null;
    },

    isAnswered(index) {
      const result = this.results[index];
      return result?.selected !== null && result?.selected !== undefined;
    },

    ansPicked(choice) {
      const index = this.currentQuestionIndex;

      // Prevent re-answering
      if (this.isAnswered(index)) return;

      this.selectedAnswer = choice;
      const correct = choice === this.currentQues.correct;

      this.results[index] = {
        selected: choice,
        correct,
        skipped: false,
      };

      // Jump to next unanswered question
      setTimeout(() => {
        const nextUnanswered = this.findNextUnanswered();
        if (nextUnanswered !== null) {
          this.loadQuestion(nextUnanswered);
        } else {
          this.allAnswered = true;
          this.stage = "review";
          this.reviewIndex = 0;
        }
      }, 1500);
    },

    findNextUnanswered() {
      for (let i = this.currentQuestionIndex + 1; i < this.nofQuestions.length; i++) {
        const res = this.results[i];
        if (!res || res.selected === null) return i;
      }
      for (let i = 0; i < this.currentQuestionIndex; i++) {
        const res = this.results[i];
        if (!res || res.selected === null) return i;
      }
      return null; // All answered
    },

    answerClass(n) {
      const index = this.currentQuestionIndex;
      const result = this.results[index];

      if (!result || result.selected === null) return "";
      return n === this.currentQues.correct
        ? "correct"
        : n === result.selected
        ? "wrong"
        : "";
    },

    reviewAnswerClass(n) {
      const { selected, correct } = this.reviewResult;
      if (selected === null) return "";
      if (n === selected) return correct ? "correct" : "wrong";
      if (n === this.reviewQues.correct && selected !== n) return "correct";
      return "";
    },

    circleClass(n) {
      const result = this.results[n];
      let baseClass = "";
      if (!result) baseClass = "";
      else if (result.selected === null) baseClass = "skipped";
      else baseClass = result.correct ? "correct" : "wrong";

      const isCurrent =
        (this.stage === "game" && n === this.currentQuestionIndex) ||
        (this.stage === "review" && n === this.reviewIndex);

      return isCurrent ? `${baseClass} current` : baseClass;
    },

    changeQuest(index) {
      if (this.stage === "game") {
        // Mark current as skipped if unanswered
        if (!this.results[this.currentQuestionIndex]) {
          this.results[this.currentQuestionIndex] = {
            selected: null,
            correct: false,
            skipped: true,
          };
        }
        this.loadQuestion(index);
      } else if (this.stage === "review") {
        // Just change review index; keep buttons visible
        this.reviewIndex = index;
      }
    },

    nextReview() {
      if (!this.isLastReview) this.reviewIndex++;
    },

    prevReview() {
      if (this.reviewIndex > 0) this.reviewIndex--;
    },

    reset() {
      this.stage = "game";
      this.currentQuestionIndex = 0;
      this.results = [];
      this.selectedAnswer = null;
      this.reviewIndex = 0;
      this.allAnswered = false;
      this.loadQuestion(0);
    },
  },
};
</script>

<style scoped>
.ques {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4% 0;
  height: 100%;
}

.ques-card {
  background-color: var(--ion-white);
  width: 100%;
  height: 10rem;
  border-radius: 2dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0% 3%;
  font-size: 100%;
}

.line {
  background-color: var(--ion-white);
  width: 95%;
  margin-top: 5%;
  height: 0.4rem;
  border-radius: 2dvh;
}

.answers {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  margin: 5% 0%;
}

.ans {
  background-color: var(--ion-color-tertiary-shade);
  color: inherit;
  border: none;
  padding: 2%;
  border-radius: 3dvh;
  font-size: 2.5dvh;
  margin: 2% 0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
}

.circle.current {
  filter: brightness(0.85);
  border: 2px solid var(--ion-color-dark);
}

.correct {
  background-color: var(--ion-color-success) !important;
  color: white;
}
.wrong {
  background-color: var(--ion-color-danger) !important;
  color: white;
}

.transparent {
  opacity: 0;
  transition: all 0.5s ease;
}

.review-controls {
  display: flex;
  justify-content: space-between;
  margin: 2rem 0;
  width: 100%;
}

.score-summary {
  text-align: center;
  margin-top: 2rem;
  font-size: 1.2rem;
  color: var(--ion-color-dark);
}

.progress-bar {
  margin: 1% 0 3% 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(3.5dvh, 1fr));
  gap: 0.5dvh;
  justify-items: center;
  width: 100%;
  max-width: 600px;
}

.circle {
  min-width: 0px;
  border-radius: 100%;
  background: var(--ion-color-primary-tint-light);
  color: var(--ion-color-medium);
  font-weight: 700;
  width: 4dvh;
  height: 4dvh;
  aspect-ratio: 1/1;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.circle.correct {
  background-color: var(--ion-color-success);
  color: white;
}

.circle.wrong {
  background-color: var(--ion-color-danger);
  color: white;
}
</style>
