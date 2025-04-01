import { describe, whereContent, whereFromPlugin, mutateContent, checkContent, updatePlugin, getCourse, getComponents, testStopWhere, testSuccessWhere } from 'adapt-migrations';
import _ from 'lodash';

describe('adapt-contrib-slider - v2.0.0 > v2.0.1', async () => {
  let sliders;

  whereFromPlugin('adapt-contrib-slider - from v2.0.0', { name: 'adapt-contrib-slider', version: '>=2.0.0 <2.0.1' });

  whereContent('adapt-contrib-slider - where slider', async content => {
    sliders = getComponents('slider');
    return sliders.length;
  });

  mutateContent('adapt-contrib-slider - add slider._showScale', async () => {
    sliders.forEach(slider => {
      slider._showScale = true;
    });
    return true;
  });

  mutateContent('adapt-contrib-slider - add slider._recordInteraction', async () => {
    sliders.forEach(slider => {
      slider._recordInteraction = true;
    });
    return true;
  });

  checkContent('adapt-contrib-slider - check slider._showScale attribute', async () => {
    const isValid = sliders.some(({ _showScale }) => _showScale === true);
    if (!isValid) throw new Error('adapt-contrib-slider - _showScale not added to every instance of slider');
    return true;
  });

  checkContent('adapt-contrib-slider - check slider._recordInteraction attribute', async () => {
    const isValid = sliders.every(({ _recordInteraction }) => _recordInteraction === true);
    if (!isValid) throw new Error('adapt-contrib-slider - _recordInteraction not added to every instance of slider');
    return true;
  });

  updatePlugin('adapt-contrib-slider - update to v2.0.1', { name: 'adapt-contrib-slider', version: '2.0.1', framework: '>=2.0.0' });

  testSuccessWhere('slider component with empty course', {
    fromPlugins: [{ name: 'adapt-contrib-slider', version: '2.0.0' }],
    content: [
      { _id: 'c-100', _component: 'slider' },
      { _type: 'course' }
    ]
  });

  testStopWhere('no slider components', {
    fromPlugins: [{ name: 'adapt-contrib-slider', version: '2.0.0' }],
    content: [{ _component: 'other' }]
  });

  testStopWhere('incorrect version', {
    fromPlugins: [{ name: 'adapt-contrib-slider', version: '2.0.1' }]
  });
});

describe('adapt-contrib-slider - v2.0.1 > v2.0.3', async () => {
  let sliders;

  whereFromPlugin('adapt-contrib-slider - from v2.0.1', { name: 'adapt-contrib-slider', version: '<2.0.3' });

  whereContent('adapt-contrib-slider - where slider', async content => {
    sliders = getComponents('slider');
    return sliders.length;
  });

  mutateContent('adapt-contrib-slider - add slider._correctAnswer', async () => {
    sliders.forEach(slider => {
      const newValue = String(slider._correctAnswer ?? '');
      slider._correctAnswer = newValue;
    });
    return true;
  });

  mutateContent('adapt-contrib-slider - modify slider._correctRange._bottom', async () => {
    sliders.forEach(slider => {
      if (!_.has(slider, '_correctRange._bottom')) {
        _.set(slider, '_correctRange._bottom', 0);
      }
    });
    return true;
  });

  mutateContent('adapt-contrib-slider - modify slider._correctRange._top', async () => {
    sliders.forEach(slider => {
      if (!_.has(slider, '_correctRange._top')) {
        _.set(slider, '_correctRange._top', 0);
      }
    });
    return true;
  });

  checkContent('adapt-contrib-slider - check slider._correctAnswer attribute', async () => {
    const isValid = sliders.some(({ _correctAnswer }) => _correctAnswer !== undefined);
    if (!isValid) throw new Error('adapt-contrib-slider - _correctAnswer not added to every instance of slider');
    return true;
  });

  checkContent('adapt-contrib-slider - check slider._correctRange._bottom attribute', async () => {
    const isValid = sliders.every(({ _correctRange }) => _correctRange._bottom !== undefined);
    if (!isValid) throw new Error('adapt-contrib-slider - _correctRange._bottom not modified in every instance of slider');
    return true;
  });

  checkContent('adapt-contrib-slider - check slider._correctRange._top attribute', async () => {
    const isValid = sliders.every(({ _correctRange }) => _correctRange._top !== undefined);
    if (!isValid) throw new Error('adapt-contrib-slider - _correctRange._top not modified in every instance of slider');
    return true;
  });

  updatePlugin('adapt-contrib-slider - update to v2.0.3', { name: 'adapt-contrib-slider', version: '2.0.3', framework: '>=2.0.0' });

  testSuccessWhere('non/configured slider component with empty course', {
    fromPlugins: [{ name: 'adapt-contrib-slider', version: '2.0.2' }],
    content: [
      { _id: 'c-100', _component: 'slider' },
      { _id: 'c-105', _component: 'slider', _correctRange: { _bottom: 5, _top: 10 } },
      { _id: 'c-110', _component: 'slider', _correctAnswer: 5 },
      { _type: 'course' }
    ]
  });

  testStopWhere('no slider components', {
    fromPlugins: [{ name: 'adapt-contrib-slider', version: '2.0.2' }],
    content: [{ _component: 'other' }]
  });

  testStopWhere('incorrect version', {
    fromPlugins: [{ name: 'adapt-contrib-slider', version: '2.0.3' }]
  });
});

describe('adapt-contrib-slider - v2.0.3 > v2.0.4', async () => {
  let sliders;

  whereFromPlugin('adapt-contrib-slider - from v2.0.3', { name: 'adapt-contrib-slider', version: '<2.0.4' });

  whereContent('adapt-contrib-slider - where slider', async content => {
    sliders = getComponents('slider');
    return sliders.length;
  });

  mutateContent('adapt-contrib-slider - add slider._canShowModelAnswer', async () => {
    sliders.forEach(slider => {
      slider._canShowModelAnswer = true;
    });
    return true;
  });

  checkContent('adapt-contrib-slider - check slider._canShowModelAnswer attribute', async () => {
    const isValid = sliders.every(({ _canShowModelAnswer }) => _canShowModelAnswer === true);
    if (!isValid) throw new Error('adapt-contrib-slider - _canShowModelAnswer not added to every instance of slider');
    return true;
  });

  updatePlugin('adapt-contrib-slider - update to v2.0.4', { name: 'adapt-contrib-slider', version: '2.0.4', framework: '>=2.0.0' });

  testSuccessWhere('non/configured slider component with empty course', {
    fromPlugins: [{ name: 'adapt-contrib-slider', version: '2.0.3' }],
    content: [
      { _id: 'c-100', _component: 'slider' },
      { _id: 'c-105', _component: 'slider' },
      { _type: 'course' }
    ]
  });

  testStopWhere('no slider components', {
    fromPlugins: [{ name: 'adapt-contrib-slider', version: '2.0.3' }],
    content: [{ _component: 'other' }]
  });

  testStopWhere('incorrect version', {
    fromPlugins: [{ name: 'adapt-contrib-slider', version: '2.0.4' }]
  });
});

describe('adapt-contrib-slider - v2.0.4 > v2.1.0', async () => {
  let sliders;

  whereFromPlugin('adapt-contrib-slider - from v2.0.4', { name: 'adapt-contrib-slider', version: '<2.1.0' });

  whereContent('adapt-contrib-slider - where slider', async content => {
    sliders = getComponents('slider');
    return sliders.length;
  });

  mutateContent('adapt-contrib-slider - add slider._scaleStep', async () => {
    sliders.forEach(slider => {
      slider._scaleStep = 1;
    });
    return true;
  });

  mutateContent('adapt-contrib-slider - add slider._canShowModelAnswer', async () => {
    sliders.forEach(slider => {
      slider._canShowModelAnswer = true;
    });
    return true;
  });

  checkContent('adapt-contrib-slider - check slider._scaleStep attribute', async () => {
    const isValid = sliders.every(({ _scaleStep }) => _scaleStep === 1);
    if (!isValid) throw new Error('adapt-contrib-slider - _scaleStep not added to every instance of slider');
    return true;
  });

  checkContent('adapt-contrib-slider - check slider._canShowModelAnswer attribute', async () => {
    const isValid = sliders.every(({ _canShowModelAnswer }) => _canShowModelAnswer === true);
    if (!isValid) throw new Error('adapt-contrib-slider - _canShowModelAnswer not added to every instance of slider');
    return true;
  });

  updatePlugin('adapt-contrib-slider - update to v2.1.0', { name: 'adapt-contrib-slider', version: '2.1.0', framework: '>=2.0.0' });

  testSuccessWhere('empty slider component', {
    fromPlugins: [{ name: 'adapt-contrib-slider', version: '2.0.4' }],
    content: [
      { _id: 'c-100', _component: 'slider' },
      { _id: 'c-105', _component: 'slider' },
      { _type: 'course' }
    ]
  });

  testStopWhere('no slider components', {
    fromPlugins: [{ name: 'adapt-contrib-slider', version: '2.0.4' }],
    content: [{ _component: 'other' }]
  });

  testStopWhere('incorrect version', {
    fromPlugins: [{ name: 'adapt-contrib-slider', version: '2.1.0' }]
  });
});

describe('adapt-contrib-slider - v2.1.0 > v2.1.1', async () => {
  let sliders;

  whereFromPlugin('adapt-contrib-slider - from v2.1.1', { name: 'adapt-contrib-slider', version: '<2.1.1' });

  whereContent('adapt-contrib-slider - where slider', async content => {
    sliders = getComponents('slider');
    return sliders.length;
  });

  mutateContent('adapt-contrib-slider - add slider._scaleStep', async () => {
    sliders.forEach(slider => {
      slider._scaleStep = 1;
    });
    return true;
  });

  mutateContent('adapt-contrib-slider - add slider._canShowModelAnswer', async () => {
    sliders.forEach(slider => {
      slider._canShowModelAnswer = true;
    });
    return true;
  });

  mutateContent('adapt-contrib-slider - add slider._canShowMarking', async () => {
    sliders.forEach(slider => {
      slider._canShowMarking = true;
    });
    return true;
  });

  checkContent('adapt-contrib-slider - check slider._scaleStep attribute', async () => {
    const isValid = sliders.every(({ _scaleStep }) => _scaleStep === 1);
    if (!isValid) throw new Error('adapt-contrib-slider - _scaleStep not added to every instance of slider');
    return true;
  });

  checkContent('adapt-contrib-slider - check slider._canShowModelAnswer attribute', async () => {
    const isValid = sliders.every(({ _canShowModelAnswer }) => _canShowModelAnswer === true);
    if (!isValid) throw new Error('adapt-contrib-slider - _canShowModelAnswer not added to every instance of slider');
    return true;
  });

  checkContent('adapt-contrib-slider - check slider._canShowMarking attribute', async () => {
    const isValid = sliders.every(({ _canShowMarking }) => _canShowMarking === true);
    if (!isValid) throw new Error('adapt-contrib-slider - _canShowMarking not added to every instance of slider');
    return true;
  });

  updatePlugin('adapt-contrib-slider - update to v2.1.1', { name: 'adapt-contrib-slider', version: '2.1.1', framework: '>=2.0.11' });

  testSuccessWhere('non/configured slider component with empty course', {
    fromPlugins: [{ name: 'adapt-contrib-slider', version: '2.1.0' }],
    content: [
      { _id: 'c-100', _component: 'slider' },
      { _id: 'c-105', _component: 'slider' },
      { _type: 'course' }
    ]
  });

  testStopWhere('no slider components', {
    fromPlugins: [{ name: 'adapt-contrib-slider', version: '2.1.0' }],
    content: [{ _component: 'other' }]
  });

  testStopWhere('incorrect version', {
    fromPlugins: [{ name: 'adapt-contrib-slider', version: '2.1.1' }]
  });
});

describe('adapt-contrib-slider - v2.1.1 > v2.1.5', async () => {
  let sliders;

  whereFromPlugin('adapt-contrib-slider - from v2.1.1', { name: 'adapt-contrib-slider', version: '<2.1.5' });

  whereContent('adapt-contrib-slider - where slider', async content => {
    sliders = getComponents('slider');
    return sliders.length;
  });

  mutateContent('adapt-contrib-slider - add slider._canShowFeedback', async () => {
    sliders.forEach(slider => {
      slider._canShowFeedback = true;
    });
    return true;
  });

  checkContent('adapt-contrib-slider - check slider._feedback._canShowFeedback attribute', async () => {
    const isValid = sliders.every(({ _canShowFeedback }) => _canShowFeedback === true);
    if (!isValid) throw new Error('adapt-contrib-slider - _canShowFeedback not added to every instance of slider');
    return true;
  });

  updatePlugin('adapt-contrib-slider - update to v2.1.5', { name: 'adapt-contrib-slider', version: '2.1.5', framework: '>=2.0.13' });

  testSuccessWhere('non/configured slider component with empty course', {
    fromPlugins: [{ name: 'adapt-contrib-slider', version: '2.1.4' }],
    content: [
      { _id: 'c-100', _component: 'slider' },
      { _id: 'c-105', _component: 'slider' },
      { _type: 'course' }
    ]
  });

  testStopWhere('no slider components', {
    fromPlugins: [{ name: 'adapt-contrib-slider', version: '2.1.4' }],
    content: [{ _component: 'other' }]
  });

  testStopWhere('incorrect version', {
    fromPlugins: [{ name: 'adapt-contrib-slider', version: '2.1.5' }]
  });
});

describe('adapt-contrib-slider - v2.1.5 > v2.3.0', async () => {
  let sliders;

  whereFromPlugin('adapt-contrib-slider - from v2.1.5', { name: 'adapt-contrib-slider', version: '<2.3.0' });

  whereContent('adapt-contrib-slider - where slider', async content => {
    sliders = getComponents('slider');
    return sliders.length;
  });

  mutateContent('adapt-contrib-slider - add slider._showScaleNumbers', async () => {
    sliders.forEach(slider => {
      slider._showScaleNumbers = true;
    });
    return true;
  });

  checkContent('adapt-contrib-slider - check slider._showScaleNumbers attribute', async () => {
    const isValid = sliders.every(({ _showScaleNumbers }) => _showScaleNumbers === true);
    if (!isValid) throw new Error('adapt-contrib-slider - _showScaleNumbers not added to every instance of slider');
    return true;
  });

  updatePlugin('adapt-contrib-slider - update to v2.3.0', { name: 'adapt-contrib-slider', version: '2.3.0', framework: '>=2.0.13' });

  testSuccessWhere('non/configured slider component', {
    fromPlugins: [{ name: 'adapt-contrib-slider', version: '2.2.0' }],
    content: [
      { _id: 'c-100', _component: 'slider' },
      { _id: 'c-105', _component: 'slider' }
    ]
  });

  testStopWhere('no slider components', {
    fromPlugins: [{ name: 'adapt-contrib-slider', version: '2.2.0' }],
    content: [{ _component: 'other' }]
  });

  testStopWhere('incorrect version', {
    fromPlugins: [{ name: 'adapt-contrib-slider', version: '2.3.0' }]
  });
});

describe('adapt-contrib-slider - v2.3.0 > v2.4.0', async () => {
  let course, courseConfidenceSliderGlobals, sliders;

  whereFromPlugin('adapt-contrib-slider - from v2.3.0', { name: 'adapt-contrib-slider', version: '<2.4.0' });

  whereContent('adapt-contrib-slider - where slider', async content => {
    sliders = getComponents('slider');
    return sliders.length;
  });

  mutateContent('Narrative - add globals if missing', async (content) => {
    course = getCourse();
    if (!_.has(course, '_globals._components._slider')) _.set(course, '_globals._components._slider', {});
    courseConfidenceSliderGlobals = course._globals._components._slider;
    return true;
  });

  mutateContent('adapt-contrib-slider - add slider.labelStart', async (content) => {
    courseConfidenceSliderGlobals.labelStart = 'Start of the scale';
    return true;
  });

  mutateContent('adapt-contrib-slider - add slider.labelEnd', async (content) => {
    courseConfidenceSliderGlobals.labelEnd = 'End of the scale';
    return true;
  });

  checkContent('adapt-contrib-slider - check globals labelStart attribute', async (content) => {
    const isValid = courseConfidenceSliderGlobals.labelStart === 'Start of the scale';
    if (!isValid) throw new Error('adapt-contrib-slider - globals labelStart attribute not added.');
    return true;
  });

  checkContent('adapt-contrib-slider - check globals labelEnd attribute', async (content) => {
    const isValid = courseConfidenceSliderGlobals.labelEnd === 'End of the scale';
    if (!isValid) throw new Error('adapt-contrib-slider - globals labelEnd attribute not added.');
    return true;
  });

  updatePlugin('adapt-contrib-slider - update to v2.4.0', { name: 'adapt-contrib-slider', version: '2.4.0', framework: '>=2.0.16' });

  testSuccessWhere('non/configured slider component with empty course', {
    fromPlugins: [{ name: 'adapt-contrib-slider', version: '2.3.0' }],
    content: [
      { _id: 'c-100', _component: 'slider' },
      { _id: 'c-105', _component: 'slider' },
      { _type: 'course' }
    ]
  });

  testSuccessWhere('non/configured slider component with course._globals', {
    fromPlugins: [{ name: 'adapt-contrib-slider', version: '2.3.0' }],
    content: [
      { _id: 'c-100', _component: 'slider' },
      { _id: 'c-105', _component: 'slider' },
      { _type: 'course', _globals: { _components: { _slider: {} } } }
    ]
  });

  testStopWhere('no slider components', {
    fromPlugins: [{ name: 'adapt-contrib-slider', version: '2.3.0' }],
    content: [
      { _component: 'other' },
      { _type: 'course' }
    ]
  });

  testStopWhere('incorrect version', {
    fromPlugins: [{ name: 'adapt-contrib-slider', version: '2.4.0' }]
  });
});
