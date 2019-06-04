<template>
  <li v-html="content"></li>
</template>

<script>
export default {
  name: "Question",
  props: ["source", "targets", "regexp"],
  computed: {
    content: function() {
      var string = this.source,
        targets = this.targets,
        pivot = 0,
        correctPivots = [],
        injectPosition = [],
        start,
        end,
        remain,
        i,
        j,
        p,
        target,
        match,
        regexp,
        element;

      for (i = 0; (target = targets[i]); i++) {
        remain = string.substr(pivot);
        start = pivot + remain.indexOf(target);
        end = start + target.length - 1;

        injectPosition.push({
          start: start,
          end: end + 1,
          tag: "not_match"
        });

        pivot = string.lastIndexOf(">") + 1;
      }

      try {
        regexp = new RegExp(this.regexp, "g");
      } catch (e) {
        return this.parsingInjector(string, injectPosition);
      }

      match = string.match(regexp);

      if (!match) {
        return this.parsingInjector(string, injectPosition);
      }

      for (i = 0; (target = targets[i]); i++) {
        start = string.indexOf(target);
        end = start + target.length - 1;
        correctPivots.push({
          start: start,
          end: end
        });
      }

      pivot = 0;

      for (i = 0; (element = match[i]); i++) {
        remain = string.substr(pivot);
        start = pivot + remain.indexOf(element);
        end = start + element.length - 1;
        pivot = end + 1;

        if (correctPivots.length <= 0) {
          injectPosition.push({
            start: start,
            end: end + 1,
            tag: "match_incorrect"
          });
        }

        for (j = 0; (p = correctPivots[j]); j++) {
          if ((start < p.start && end < p.start) || start > p.end) {
            injectPosition.push({
              start: start,
              end: end + 1,
              tag: "match_incorrect"
            });
          } else if (start < p.start && end >= p.start) {
            injectPosition.push({
              start: start,
              end: p.start,
              tag: "match_incorrect"
            });
            if (end < p.end) {
              injectPosition.push({
                start: p.start,
                end: end + 1,
                tag: "match_correct"
              });
            } else {
              injectPosition = injectPosition.concat([
                {
                  start: p.start,
                  end: p.end + 1,
                  tag: "match_correct"
                },
                {
                  start: p.end + 1,
                  end: end + 1,
                  tag: "match_incorrect"
                }
              ]);
            }
          } else if (start >= p.start) {
            if (end <= p.end) {
              injectPosition.push({
                start: start,
                end: end + 1,
                tag: "match_correct"
              });
            } else {
              injectPosition = injectPosition.concat([
                {
                  start: start,
                  end: p.end + 1,
                  tag: "match_correct"
                },
                {
                  start: p.end + 1 + 1,
                  end: end + 1,
                  tag: "match_incorrect"
                }
              ]);
            }
          }
        }
      }

      return this.parsingInjector(string, injectPosition);
    }
  },
  methods: {
    parsingInjector: function(string, injectArray) {
      var i,
        j,
        element,
        startTag,
        endTag,
        firstHalf,
        target,
        remainHalf,
        amount,
        retval = string,
        injectPosition = injectArray;

      if (typeof injectPosition == "undefined" || injectPosition.length <= 0) {
        return retval;
      }

      for (i = 0; (element = injectPosition[i]); i++) {
        startTag = `<${element.tag}>`;
        endTag = `</${element.tag}>`;
        firstHalf = retval.substr(0, element.start);
        target = retval.substr(element.start, element.end - element.start);
        remainHalf = retval.substr(element.end);
        retval = `${firstHalf}${startTag}${target}${endTag}${remainHalf}`;

        for (j = i + 1; j < injectPosition.length; j++) {
          amount = 0;
          if (injectPosition[j].start >= element.start) {
            amount += startTag.length;
          }
          if (injectPosition[j].start >= element.end) {
            amount += endTag.length;
          }
          injectPosition[j].start += amount;
          amount = 0;
          if (injectPosition[j].end > element.start) {
            amount += startTag.length;
          }
          if (injectPosition[j].end > element.end) {
            amount += endTag.length;
          }
          injectPosition[j].end += amount;
        }
      }

      return retval;
    }
  }
};
</script>
