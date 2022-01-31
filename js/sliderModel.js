import Adapt from 'core/js/adapt';
import QuestionModel from 'core/js/models/questionModel';

export default class SliderModel extends QuestionModel {

  init() {
    QuestionModel.prototype.init.call(this);

    this.setupModelItems();
    this.selectDefaultItem();
  }

  /**
  * @param {string} [type] 'hard' resets _isComplete and _isInteractionComplete, 'soft' resets _isInteractionComplete only.
  * @param {boolean} [canReset] Defaults to this.get('_canReset')
  * @returns {boolean}
  */
  reset(type = 'hard', canReset = this.get('_canReset')) {
    const wasReset = super.reset(type, canReset);
    if (!wasReset) return false;
    this.deselectAllItems();
    this.selectDefaultItem();
    return true;
  }

  selectDefaultItem() {
    this.set('_selectedItem', this.get('_items')[0]);
  }

  /**
   * Returns the number of decimal places in a specified number
   */
  getDecimalPlaces(num) {
    return (num.toString().split('.')[1] || []).length;
  }

  setupModelItems() {
    const items = [];
    const answer = this.get('_correctAnswer');
    const range = this.get('_correctRange');
    const start = this.get('_scaleStart');
    const end = this.get('_scaleEnd');
    const step = this.get('_scaleStep') || 1;

    const dp = this.getDecimalPlaces(step);

    for (let i = start; i <= end; i += step) {
      if (dp !== 0) {
        // Ensure that steps with decimal places are handled correctly.
        i = parseFloat(i.toFixed(dp));
      }

      items.push({
        value: i,
        selected: false,
        // _correctAnswer/answer is a String - this allows AAT users to assign it no value when _correctRange needs to be used instead
        // we therefore need to convert it to Number when checking the answer (see https://github.com/adaptlearning/adapt_framework/issues/2259)
        correct: answer ? i === Number(answer) : (i >= range._bottom && i <= range._top)
      });
    }

    this.set({
      _items: items,
      _marginDir: Adapt.config.get('_defaultDirection') === 'rtl' ? 'right' : 'left'
    });
  }

  /**
  * allow the user to submit immediately; the slider handle may already be in the position they want to choose
  */
  canSubmit() {
    return true;
  }

  restoreUserAnswers() {
    if (!this.get('_isSubmitted')) {
      this.set({
        _userAnswer: undefined
      });
      this.selectDefaultItem();
      return;
    }

    const items = this.get('_items');
    const userAnswer = this.get('_userAnswer');
    const selectedItem = items.find(({ value }) => value === userAnswer);
    if (selectedItem) {
      selectedItem.selected = true;
      this.set('_selectedItem', selectedItem);
    }

    this.setQuestionAsSubmitted();
    this.markQuestion();
    this.setScore();
    this.setupFeedback();
  }

  // This preserves the state of the users answers for returning or showing the users answer
  storeUserAnswer() {
    this.set('_userAnswer', this.get('_selectedItem').value);
  }

  resetUserAnswer() {
    this.set({
      _isAtLeastOneCorrectSelection: false,
      _userAnswer: undefined
    });
    this.selectDefaultItem();
  }

  deselectAllItems() {
    this.get('_items').forEach(item => (item.selected = false));
  }

  isCorrect() {
    const numberOfCorrectAnswers = this.get('_items').filter(({ selected, correct }) => selected && correct).length;

    this.set('_isAtLeastOneCorrectSelection', numberOfCorrectAnswers > 0);
    this.set('_numberOfCorrectAnswers', numberOfCorrectAnswers);

    return this.get('_isAtLeastOneCorrectSelection');
  }

  isPartlyCorrect() {
    return this.get('_isAtLeastOneCorrectSelection');
  }

  // Used to set the score based upon the _questionWeight
  setScore() {
    const numberOfCorrectAnswers = this.get('_numberOfCorrectAnswers');
    const questionWeight = this.get('_questionWeight');
    const score = questionWeight * numberOfCorrectAnswers;
    this.set('_score', score);
  }

  /**
  * Used by adapt-contrib-spoor to get the user's answers in the format required by the cmi.interactions.n.student_response data field
  */
  getResponse() {
    return this.get('_userAnswer').toString();
  }

  /**
  * Used by adapt-contrib-spoor to get the type of this question in the format required by the cmi.interactions.n.type data field
  */
  getResponseType() {
    return 'numeric';
  }

  getCorrectAnswers() {

    // are we dealing with a single correct answer or a range?
    const answerSingle = this.get('_correctAnswer');
    const answers = [];
    if (answerSingle) {
      return [ answerSingle ];
    }
    const answerMultiple = this.get('_correctRange');
    if (!answerMultiple) {
      return answers;
    }
    const bottom = answerMultiple._bottom;
    const top = answerMultiple._top;
    if (bottom === undefined || top === undefined) {
      return answers;
    }
    let answer = bottom;
    const step = this.get('_scaleStep') || 1;
    while (answer <= top) {
      answers.push(answer);
      answer += step;
    }
    return answers;
  }

  /**
   * Creates a string explaining the answer (or answer range) the learner should have chosen
   * Used by ButtonsView to retrieve question-specific correct answer text for the ARIA
   * 'live region' that gets updated when the learner selects the 'show correct answer' button
   * @return {string}
   */
  getCorrectAnswerAsText() {
    const globals = Adapt.course.get('_globals')._components._slider;
    const answers = this.getCorrectAnswers();
    if (answers.length > 1) {
      return Handlebars.compile(globals.ariaCorrectAnswerRange)({
        bottom: answers.shift(),
        top: answers.pop()
      });
    }

    return Handlebars.compile(globals.ariaCorrectAnswer)({ correctAnswer: answers[0] });
  }

  /**
   * Creates a string listing the answer the learner chose
   * Used by ButtonsView to retrieve question-specific user answer text for the ARIA
   * 'live region' that gets updated when the learner selects the 'hide correct answer' button
   * @return {string}
   */
  getUserAnswerAsText() {
    const answerTemplate = Adapt.course.get('_globals')._components._slider.ariaUserAnswer;
    return Handlebars.compile(answerTemplate)({ userAnswer: this.get('_userAnswer') });
  }

}
