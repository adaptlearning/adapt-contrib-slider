import components from 'core/js/components';
import SliderView from './nativeSliderView';
import SliderModel from './nativeSliderModel';

export default components.register('nativeslider', {
  view: SliderView,
  model: SliderModel
});
