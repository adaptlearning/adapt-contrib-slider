import Adapt from 'core/js/adapt';
import QuestionView from 'core/js/views/questionView';
import 'libraries/rangeslider';

export default class SliderView extends QuestionView {

  events() {
    return {
      'click .js-slider-number-click': 'onNumberSelected',
      'focus .js-slider-item-input': 'onHandleFocus',
      'blur .js-slider-item-input': 'onHandleBlur'
    };
  }

  // Used by question to setup itself just before rendering
  setupQuestion() {
    if (this.model.get('_isSubmitted')) return;

    this.selectItem(this.getIndexFromValue(this.model.get('_selectedItem').value));
  }

  setupRangeslider() {
    this.$sliderScaleMarker = this.$('.js-slider-number-selection');
    this.$slider = this.$('.js-slider-item-input');
    if (this.model.has('_scaleStep')) {
      this.$slider.attr({ step: this.model.get('_scaleStep') });
    }

    this.$slider.rangeslider({
      polyfill: false,
      onSlide: this.handleSlide.bind(this)
    });
    this.oldValue = 0;

    if (this._deferEnable) {
      this.setAllItemsEnabled();
    }
  }

  handleSlide(position, value) {
    if (this.oldValue === value) {
      return;
    }
    const itemIndex = this.getIndexFromValue(value);
    const pixels = this.mapIndexToPixels(itemIndex);
    this.selectItem(itemIndex);
    this.animateToPosition(pixels);
    this.oldValue = value;
  }

  disableQuestion() {
    this.setAllItemsEnabled();
  }

  enableQuestion() {
    this.setAllItemsEnabled();
  }

  setAllItemsEnabled() {
    const isEnabled = this.model.get('_isEnabled');

    if (!this.$slider) {
      this._deferEnable = true; // slider is not yet ready
      return;
    }

    this.$('.slider__widget').toggleClass('is-disabled', !isEnabled);
    this.$slider.prop('disabled', !isEnabled).rangeslider('update', true);
  }

  onQuestionRendered() {
    this.setupRangeslider();
    this.setScalePositions();
    this.onScreenSizeChanged();
    this.showScaleMarker(true);
    this.listenTo(Adapt, 'device:resize', this.onScreenSizeChanged);
    this.setReadyStatus();
  }

  // this should make the slider handle, slider marker and slider bar to animate to give position
  animateToPosition(newPosition) {
    if (!this.$sliderScaleMarker) return;

    this.$sliderScaleMarker
      .velocity('stop')
      .velocity({
        left: newPosition
      }, {
        duration: 200,
        easing: 'linear',
        mobileHA: false
      });
  }

  // this shoud give the index of item using given slider value
  getIndexFromValue(itemValue) {
    const scaleStart = this.model.get('_scaleStart');
    const scaleEnd = this.model.get('_scaleEnd');
    return Math.round(this.mapValue(itemValue, scaleStart, scaleEnd, 0, this.model.get('_items').length - 1));
  }

  mapIndexToPixels(value, $widthObject) {
    const numberOfItems = this.model.get('_items').length;
    const width = $widthObject ? $widthObject.width() : this.$('.js-slider-scale').width();

    return Math.round(this.mapValue(value, 0, numberOfItems - 1, 0, width));
  }

  mapPixelsToIndex(value) {
    const numberOfItems = this.model.get('_items').length;
    const width = this.$('.slider-sliderange').width();

    return Math.round(this.mapValue(value, 0, width, 0, numberOfItems - 1));
  }

  normalise(value, low, high) {
    const range = high - low;
    return (value - low) / range;
  }

  mapValue(value, inputLow, inputHigh, outputLow, outputHigh) {
    const normal = this.normalise(value, inputLow, inputHigh);
    return normal * (outputHigh - outputLow) + outputLow;
  }

  onHandleFocus(event) {
    event.preventDefault();
    this.$slider.on('keydown', this.onKeyDown.bind(this));
  }

  onHandleBlur(event) {
    event.preventDefault();
    this.$slider.off('keydown');
  }

  onKeyDown(event) {
    if (event.which === 9) return; // tab key
    event.preventDefault();

    let newItemIndex = this.getIndexFromValue(this.model.get('_selectedItem').value);

    switch (event.which) {
      case 40: // ↓ down
      case 37: // ← left
        newItemIndex = Math.max(newItemIndex - 1, 0);
        break;
      case 38: // ↑ up
      case 39: // → right
        newItemIndex = Math.min(newItemIndex + 1, this.model.get('_items').length - 1);
        break;
    }

    this.selectItem(newItemIndex);
    if (typeof newItemIndex === 'number') this.showScaleMarker(true);
    this.animateToPosition(this.mapIndexToPixels(newItemIndex));
    this.setSliderValue(this.getValueFromIndex(newItemIndex));
  }

  onNumberSelected(event) {
    event.preventDefault();

    if (this.model.get('_isInteractionComplete')) {
      return;
    }

    // when component is not reset, selecting a number should be prevented
    if (this.$slider.prop('disabled')) {
      return;
    }

    const itemValue = parseFloat($(event.currentTarget).attr('data-id'));
    const index = this.getIndexFromValue(itemValue);
    this.selectItem(index);
    this.animateToPosition(this.mapIndexToPixels(index));
    this.setSliderValue(itemValue);
  }

  getValueFromIndex(index) {
    return this.model.get('_items')[index].value;
  }

  resetControlStyles() {
    this.$('.slider-handle').empty();
    this.showScaleMarker(false);
    this.$('.slider-bar').animate({ width: '0' });
    this.setSliderValue(this.model.get('_items')[0].value);
  }

  onCannotSubmit() { }

  setSliderValue(value) {
    if (!this.$slider) return;
    this.$slider.val(value).change();
  }

  showMarking() {
    if (!this.model.get('_canShowMarking')) return;

    this.$('.slider__widget').removeClass('is-correct is-incorrect')
      .addClass(this.model.get('_selectedItem').correct ? 'is-correct' : 'is-incorrect');
  }

  resetQuestion() {
    this.selectItem(0);
    this.animateToPosition(0);
    this.resetControlStyles();
    this.showScaleMarker(true);
  }

  setScalePositions() {
    const numberOfItems = this.model.get('_items').length;
    this.model.get('_items').forEach((item, index) => {
      const normalisedPosition = this.normalise(index, 0, numberOfItems - 1);
      this.$('.js-slider-number').eq(index).data('normalisedPosition', normalisedPosition);
    });
  }

  showScale() {
    const $markers = this.$('.js-slider-scale-notch-container').empty();

    if (this.model.get('_showScale') === false) {
      $markers.eq(0).addClass('u-display-none');
      this.$('.js-slider-number').addClass(
        this.model.get('_showScaleIndicator') ? 'u-visibility-hidden' : 'u-display-none'
      );
      return;
    }

    const $scaler = this.$('.js-slider-scale');
    for (let i = 1, count = this.model.get('_items').length - 1; i < count; i++) {
      $markers.append(`<div class="slider__scale-notch" style="left: ${this.mapIndexToPixels(i, $scaler)}px">`);
    }
    // Do we show scale numbers
    this.showScaleNumbers();
  }

  showScaleNumbers() {
    const $scaler = this.$('.js-slider-scale');
    const $numbers = this.$('.js-slider-number');

    if (this.model.get('_showScaleNumbers') === false) {
      $numbers.addClass('u-display-none');
      return;
    }

    const scaleWidth = $scaler.width();
    this.model.get('_items').forEach((item, index) => {
      const $number = $numbers.eq(index);
      const newLeft = Math.round($number.data('normalisedPosition') * scaleWidth);
      $number.css({ left: newLeft });
    });
  }

  // Labels are enabled in slider.hbs. Here we manage their containing div.
  showLabels() {
    if (this.model.get('labelStart') || this.model.get('labelEnd')) return;
    this.$('.js-slider-label-container').eq(0).addClass('u-display-none');
  }

  remapSliderBar() {
    const $scaler = this.$('.js-slider-scale');
    const currentIndex = this.getIndexFromValue(this.model.get('_selectedItem').value);
    const left = this.mapIndexToPixels(currentIndex, $scaler);
    this.$('.slider-handle').css({ left: `${left}px` });
    this.$('.js-slider-number-selection').css({ left: `${left}px` });
    this.$('.slider-bar').width(left);
  }

  onScreenSizeChanged() {
    this.showScale();
    this.showLabels();
    this.remapSliderBar();
    if (this.$('.slider__widget').hasClass('show-user-answer')) {
      this.hideCorrectAnswer();
    } else if (this.$('.slider__widget').hasClass('show-correct-answer')) {
      this.showCorrectAnswer();
    }
  }

  showCorrectAnswer() {
    this.showScaleMarker(false);

    const answers = this.model.getCorrectAnswers();
    if (answers.length === 0) {
      console.log('adapt-contrib-slider::WARNING: no correct answer or correct range set in JSON');
      return;
    }

    const middleAnswer = answers[Math.floor(answers.length / 2)];
    this.animateToPosition(this.mapIndexToPixels(this.getIndexFromValue(middleAnswer)));
    this.showModelAnswers(answers);
    this.setSliderValue(middleAnswer);
  }

  showModelAnswers(correctAnswerArray) {
    const $parentDiv = this.$('.js-slider-model-range');
    correctAnswerArray.forEach((correctAnswer, index) => {
      $parentDiv.append($('<div class="slider__number-model-answer">'));

      const $element = this.$('.js-slider-model-range .slider__number-model-answer').eq(index);
      const startingLeft = this.mapIndexToPixels(this.getIndexFromValue(this.model.get('_selectedItem').value));

      if (this.model.get('_showNumber')) $element.html(correctAnswer);

      $element.css({ left: startingLeft }).fadeIn(0, () => {
        $element.animate({ left: this.mapIndexToPixels(this.getIndexFromValue(correctAnswer)) });
      });
    });
  }

  hideCorrectAnswer() {
    const userAnswerIndex = this.getIndexFromValue(this.model.get('_userAnswer'));
    this.$('.js-slider-model-range').empty();

    this.showScaleMarker(true);
    this.selectItem(userAnswerIndex);
    this.animateToPosition(this.mapIndexToPixels(userAnswerIndex));
    this.setSliderValue(this.model.get('_userAnswer'));
  }

  // according to given item index this should make the item as selected
  selectItem(itemIndex) {
    // deselect all items before selecting the chosen item
    this.model.deselectAllItems();
    const item = this.model.get('_items')[itemIndex];
    if (!item) return;
    item.selected = true;
    this.model.set('_selectedItem', item);
    this.$('.js-slider-item-input').attr({
      value: item.value,
      'aria-valuenow': item.value
    });
    this.showNumber(true);
  }

  // this makes the marker visible or hidden
  showScaleMarker(show) {
    const $scaleMarker = this.$('.js-slider-number-selection');
    if (this.model.get('_showScaleIndicator')) {
      this.showNumber(show);
      $scaleMarker.toggleClass('display-block', show);
    }
  }

  // this should add the current slider value to the marker
  showNumber(show) {
    const $scaleMarker = this.$('.js-slider-number-selection');
    if (this.model.get('_showNumber')) {
      if (show) {
        $scaleMarker.html(this.model.get('_selectedItem').value);
      } else {
        $scaleMarker.html = '';
      }
    }
  }

}
