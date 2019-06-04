<template>
  <v-container>
    <v-layout>
      <v-flex xs12 sm12 md9 offset-md2 lg8>
        <v-card>
          <v-layout>
            <v-flex xs12>
              <v-card-text tag="h1" class="headline text-xs-center">{{ questions[current].title }}</v-card-text>
            </v-flex>
          </v-layout>
          <v-card-text>{{ questions[current].description }}</v-card-text>
          <v-card flat>
            <v-layout>
              <v-flex xs4>
                <v-card-text class="text-xs-right hidden-xs-only">Enter your regexp: /</v-card-text>
                <v-card-text class="text-xs-right hidden-sm-and-up">Regexp: /</v-card-text>
              </v-flex>
              <v-flex xs7 sm6>
                <v-text-field solo clearable v-model="regexp"></v-text-field>
              </v-flex>
              <v-flex xs2>
                <v-card-text>/g</v-card-text>
              </v-flex>
            </v-layout>
          </v-card>
          <v-card>
            <v-flex xs10>
              <v-container flat>
                <Question
                  v-for="item in questions[current].content"
                  v-bind:key="item.id"
                  :targets="item.targets"
                  :source="item.source"
                  :regexp="regexp"
                ></Question>
              </v-container>
            </v-flex>
          </v-card>
          <v-card>
            <v-card-text>
              <div>
                <p
                  class="text-blue"
                >Blue is text you need to match [{{ requiredAmount }} characters]</p>
              </div>
              <div>
                <p
                  class="text-green"
                >Green is text you've matched correctly [{{ matchedAmount }} characters]</p>
              </div>
              <div>
                <p
                  class="text-red"
                >Red is text matched incorrectly [{{ incorrectAmount }} characters]</p>
              </div>
            </v-card-text>
          </v-card>
          <v-card v-if="isPassed">
            <v-card-text>
              <v-layout align-center justify-center class="green--text">
                <h1>Passed!</h1>
              </v-layout>
            </v-card-text>
          </v-card>
          <v-card v-if="current > 0 || isPassed">
            <v-card-text>
              <v-layout row>
                <v-flex xs1 offset-xs1>
                  <v-btn v-if="current > 0" color="success" right v-on:click="previousQuestion">
                    <v-icon left>fas fa-chevron-left</v-icon>Previous
                  </v-btn>
                </v-flex>
                <v-flex xs1 offset-xs7 align-center>
                  <v-btn
                    v-if="current < questions.length - 1 && isPassed"
                    color="success"
                    v-on:click="nextQuestion"
                  >
                    Next
                    <v-icon right>fas fa-chevron-right</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
          <v-card>
            <v-footer height="auto">
              <v-layout justify-center row wrap>
                <v-flex py-3 text-xs-center white--text xs12>
                  &copy;2019 — Clone from
                  <a href="http://regextutorials.com/">
                    <strong>http://regextutorials.com/</strong>
                  </a>
                </v-flex>
              </v-layout>
            </v-footer>
          </v-card>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Question from "./Question.vue";
import questions from "../assets/json/question.json";

export default {
  name: "RegexBoard",
  components: {
    Question
  },
  data: () => ({
    current: 0,
    passed:
      typeof Storage == "undefined" ||
      !window.sessionStorage.getItem("RTV_passed")
        ? []
        : JSON.parse(window.sessionStorage.getItem("RTV_passed")),
    regexp: "",
    questions
  }),
  computed: {
    matchedAmount: function() {
      return this.matchCompute(true);
    },
    incorrectAmount: function() {
      return this.matchCompute(false);
    },
    requiredAmount: function() {
      var amount = 0;
      this.questions[this.current].content.forEach(function(item) {
        item.targets.forEach(function(e) {
          amount += e.length;
        });
      });
      amount = amount - this.matchedAmount;
      return amount;
    },
    isPassed: function() {
      if (this.passed.indexOf(this.current) >= 0) {
        return true;
      } else {
        if (this.requiredAmount == 0 && this.incorrectAmount == 0) {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.passed.push(this.current);
          window.sessionStorage.setItem(
            "RTV_passed",
            JSON.stringify(this.passed)
          );
          return true;
        }
      }
      return false;
    }
  },
  methods: {
    nextQuestion: function() {
      var questionNumber = this.questions.length;
      if (this.current < questionNumber - 1) {
        this.current++;
      } else {
        this.current = 0;
      }
      this.regexp = "";
    },
    previousQuestion: function() {
      this.current--;
      this.regexp = "";
    },
    matchCompute: function(isCorrect) {
      var content = this.questions[this.current].content,
        matched = 0;

      for (var i = 0, el; (el = content[i]); i++) {
        var source = el.source,
          targets = el.targets,
          targetPivots = [],
          testPivot = 0,
          test,
          j,
          target,
          element,
          start,
          end;

        try {
          var regexp = new RegExp(this.regexp, "g");
        } catch (e) {
          continue;
        }

        var match = source.match(new RegExp(regexp, "g"));

        if (!match) {
          continue;
        }

        for (j = 0, target; (target = targets[j]); j++) {
          start = source.indexOf(target);
          end = start + target.length - 1;
          targetPivots.push({
            start: start,
            end: end
          });
        }

        for (j = 0, element; (element = match[j]); j++) {
          var remainSource = source.substr(testPivot);
          start = testPivot + remainSource.indexOf(element);
          end = start + element.length - 1,
            test = false;

          for (var k = 0, pivot; (pivot = targetPivots[k]); k++) {
            if (start >= pivot.start && end <= pivot.end) {
              test = true;
            }
          }

          if (isCorrect && test) {
            matched += element.length;
          } else if (!isCorrect && !test) {
            matched += element.length;
          }

          testPivot = end + 1;
        }
      }
      return matched;
    }
  }
};
</script>
