import { describe, whereContent, whereFromPlugin, mutateContent, checkContent, updatePlugin, getComponents, testStopWhere, testSuccessWhere } from 'adapt-migrations';

describe('adapt-contrib-slider - v3.2.0 > v4.2.1', async () => {
  let sliders;

  whereFromPlugin('adapt-contrib-slider - from v3.2.0', { name: 'adapt-contrib-slider', version: '<4.2.1' });

  whereContent('adapt-contrib-slider - where slider', async content => {
    sliders = getComponents('slider');
    return sliders.length;
  });

  mutateContent('adapt-contrib-slider - add slider.ariaQuestion', async () => {
    sliders.forEach(slider => {
      slider.ariaQuestion = '';
    });
    return true;
  });

  checkContent('adapt-contrib-slider - check slider.ariaQuestion attribute', async () => {
    const isValid = sliders.every(({ ariaQuestion }) => ariaQuestion === '');
    if (!isValid) throw new Error('adapt-contrib-slider - ariaQuestion not added to every instance of slider');
    return true;
  });

  updatePlugin('adapt-contrib-slider - update to v4.2.1', { name: 'adapt-contrib-slider', version: 'v4.2.1', framework: '>=5.19.1' });

  testSuccessWhere('non/configured slider component with course._globals', {
    fromPlugins: [{ name: 'adapt-contrib-slider', version: '4.2.0' }],
    content: [
      { _id: 'c-100', _component: 'slider' },
      { _id: 'c-105', _component: 'slider' }
    ]
  });

  testStopWhere('no slider components', {
    fromPlugins: [{ name: 'adapt-contrib-slider', version: '4.2.0' }],
    content: [
      { _component: 'other' },
      { _type: 'course' }
    ]
  });

  testStopWhere('incorrect version', {
    fromPlugins: [{ name: 'adapt-contrib-slider', version: '4.2.1' }]
  });
});

describe('adapt-contrib-slider - v4.2.1 > v4.3.6', async () => {
  let sliders;

  whereFromPlugin('adapt-contrib-slider - from v4.2.1', { name: 'adapt-contrib-slider', version: '<4.3.6' });

  whereContent('adapt-contrib-slider - where slider', async content => {
    sliders = getComponents('slider');
    return sliders.length;
  });

  mutateContent('adapt-contrib-slider - add slider.scaleStepPrefix', async () => {
    sliders.forEach(slider => {
      slider.scaleStepPrefix = '';
    });
    return true;
  });

  mutateContent('adapt-contrib-slider - add slider.scaleStepSuffix', async () => {
    sliders.forEach(slider => {
      slider.scaleStepSuffix = '';
    });
    return true;
  });

  checkContent('adapt-contrib-slider - check slider.scaleStepPrefix attribute', async () => {
    const isValid = sliders.every(({ scaleStepPrefix }) => scaleStepPrefix === '');
    if (!isValid) throw new Error('adapt-contrib-slider - scaleStepPrefix not added to every instance of slider');
    return true;
  });

  checkContent('adapt-contrib-slider - check slider.scaleStepSuffix attribute', async () => {
    const isValid = sliders.every(({ scaleStepSuffix }) => scaleStepSuffix === '');
    if (!isValid) throw new Error('adapt-contrib-slider - scaleStepSuffix not added to every instance of slider');
    return true;
  });

  updatePlugin('adapt-contrib-slider - update to v4.3.6', { name: 'adapt-contrib-slider', version: 'v4.3.6', framework: '>=5.19.1' });

  testSuccessWhere('non/configured slider component with course._globals', {
    fromPlugins: [{ name: 'adapt-contrib-slider', version: '4.3.5' }],
    content: [
      { _id: 'c-100', _component: 'slider' },
      { _id: 'c-105', _component: 'slider' }
    ]
  });

  testStopWhere('no slider components', {
    fromPlugins: [{ name: 'adapt-contrib-slider', version: '4.3.5' }],
    content: [
      { _component: 'other' },
      { _type: 'course' }
    ]
  });

  testStopWhere('incorrect version', {
    fromPlugins: [{ name: 'adapt-contrib-slider', version: '4.3.6' }]
  });
});

describe('adapt-contrib-slider - v4.3.6 > v4.3.9', async () => {
  let sliders;

  whereFromPlugin('adapt-contrib-slider - from v4.3.6', { name: 'adapt-contrib-slider', version: '<4.3.9' });

  whereContent('adapt-contrib-slider - where slider', async content => {
    sliders = getComponents('slider');
    return sliders.length;
  });

  mutateContent('adapt-contrib-slider - add slider.ariaScaleName', async () => {
    sliders.forEach(slider => {
      slider.ariaScaleName = '';
    });
    return true;
  });

  checkContent('adapt-contrib-slider - check slider.ariaScaleName attribute', async () => {
    const isValid = sliders.every(({ ariaScaleName }) => ariaScaleName === '');
    if (!isValid) throw new Error('adapt-contrib-slider - ariaScaleName not added to every instance of slider');
    return true;
  });

  updatePlugin('adapt-contrib-slider - update to v4.3.9', { name: 'adapt-contrib-slider', version: 'v4.3.9', framework: '>=5.19.1' });
});

describe('adapt-contrib-slider - v4.3.9 > v4.6.0', async () => {
  let sliders;

  whereFromPlugin('adapt-contrib-slider - from v4.3.9', { name: 'adapt-contrib-slider', version: '<4.6.0' });

  whereContent('adapt-contrib-slider - where slider', async content => {
    sliders = getComponents('slider');
    return sliders.length;
  });

  mutateContent('adapt-contrib-slider - add slider._canShowCorrectness', async () => {
    sliders.forEach(slider => {
      slider._canShowCorrectness = false;
    });
    return true;
  });

  checkContent('adapt-contrib-slider - check slider._canShowCorrectness attribute', async () => {
    const isValid = sliders.every(({ _canShowCorrectness }) => _canShowCorrectness === false);
    if (!isValid) throw new Error('adapt-contrib-slider - _canShowCorrectness not added to every instance of slider');
    return true;
  });

  updatePlugin('adapt-contrib-slider - update to v4.6.0', { name: 'adapt-contrib-slider', version: 'v4.6.0', framework: '>=5.19.1' });

  testSuccessWhere('correct version slider component', {
    fromPlugins: [{ name: 'adapt-contrib-slider', version: '4.3.5' }],
    content: [
      { _id: 'c-100', _component: 'slider' },
      { _id: 'c-105', _component: 'slider' }
    ]
  });

  testStopWhere('no slider components', {
    fromPlugins: [{ name: 'adapt-contrib-slider', version: '4.3.5' }],
    content: [
      { _component: 'other' },
      { _type: 'course' }
    ]
  });

  testStopWhere('incorrect version', {
    fromPlugins: [{ name: 'adapt-contrib-slider', version: '4.3.6' }]
  });
});
