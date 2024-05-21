import QuestionView from 'core/js/views/questionView';

class SliderView extends QuestionView {

  initialize(...args) {
    this.getIndexFromValue = this.getIndexFromValue.bind(this);
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
  getIndexFromValue(value) {
    value = parseFloat(value);
    const step = this.model.get('_scaleStep');
    return this.model.get('_items').reduce((found, item) => {
      if (found) return found;
      if (item.value === value) return item;
      const rangeStart = item.value - (step / 2);
      const rangeEnd = item.value + (step / 2);
      const inRange = (value >= rangeStart && value < rangeEnd);
      if (inRange) return item;
      return found;
    }, null).index;
  }

  onNumberSelected(value) {
    if (this.model.get('_isInteractionComplete')) {
      return;
    }

    const index = this.getIndexFromValue(value);
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
    this.model.set('_selectedItem', item);
  }

}

SliderView.template = 'slider.jsx';

export default SliderView;
