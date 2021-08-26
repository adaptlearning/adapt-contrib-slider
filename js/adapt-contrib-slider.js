define([
  'core/js/adapt',
  './sliderView',
  './sliderModel'
], function(Adapt, SliderView, SliderModel) {

  return Adapt.register('slider', {
    view: SliderView,
    model: SliderModel
  });

});
