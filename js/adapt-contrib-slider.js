import Adapt from 'core/js/adapt';
import SliderView from './sliderView';
import SliderModel from './sliderModel';

export default Adapt.register('slider', {
  view: SliderView,
  model: SliderModel
});
