import QuestionView from 'core/js/views/questionView';

class SliderView extends QuestionView {

  initialize(...args) {
    this.onInput = this.onInput.bind(this);
    this.mapValue = this.mapValue.bind(this);
    this.getIndexFromValue = this.getIndexFromValue.bind(this);
    this.normalise = this.normalise.bind(this);
    this.onNumberSelected = this.onNumberSelected.bind(this);
    this.getCorrectAnswers = this.model.getCorrectAnswers.bind(this.model);
    super.initialize(...args);
  }

  // Used by question to setup itself just before rendering
  setupQuestion() {
    if (this.model.get('_isSubmitted')) return;

    this.selectItem(this.getIndexFromValue(this.model.get('_selectedItem').value));
  }

  onQuestionRendered() {
    this.setReadyStatus();
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

  normalise(value, low, high) {
    const range = high - low;
    return (value - low) / range;
  }

  mapValue(value, inputLow, inputHigh, outputLow, outputHigh) {
    const normal = this.normalise(value, inputLow, inputHigh);
    return normal * (outputHigh - outputLow) + outputLow;
  }

  onNumberSelected(event) {
    event.preventDefault();

    if (this.model.get('_isInteractionComplete')) {
      return;
    }

    const itemValue = parseFloat($(event.currentTarget).attr('data-id'));
    const index = this.getIndexFromValue(itemValue);
    this.selectItem(index);
  }

  onCannotSubmit() { }

  // according to given item index this should make the item as selected
  selectItem(itemIndex) {
    // deselect all items before selecting the chosen item
    this.model.deselectAllItems();
    const item = this.model.get('_items')[itemIndex];
    if (!item) return;
    item.selected = true;
    const numItems = this.model.get('_items').length - 1;
    const fillWidth = (itemIndex / numItems) * 100;
    this.model.set({
      _selectedItem: item,
      _fillWidth: fillWidth
    });
  }

  onInput(e) {
    const value = e.target.value;

    if (this.oldValue === value) {
      return;
    }
    const itemIndex = this.getIndexFromValue(value);
    this.selectItem(itemIndex);
    this.oldValue = value;
  }

}

SliderView.template = 'slider.jsx';

export default SliderView;
