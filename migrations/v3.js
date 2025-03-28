import { describe, whereContent, whereFromPlugin, mutateContent, checkContent, updatePlugin, getCourse, getComponents, testStopWhere, testSuccessWhere } from 'adapt-migrations';
import _ from 'lodash';

describe('adapt-contrib-slider - v2.4.0 > v3.1.0', async () => {
  let sliders;

  whereFromPlugin('adapt-contrib-slider - from v2.4.0', { name: 'adapt-contrib-slider', version: '<3.1.0' });

  whereContent('adapt-contrib-slider - where slider', async content => {
    sliders = getComponents('slider');
    return sliders.length;
  });

  mutateContent('adapt-contrib-slider - remove slider._feedback._partlyCorrect', async () => {
    sliders.forEach(slider => {
      _.unset(slider, '_feedback._partlyCorrect');
    });
    return true;
  });

  checkContent('adapt-contrib-slider - check slider._feedback._partlyCorrect', async () => {
    const isInvalid = sliders.some(({ _feedback }) => _.has(_feedback, '_partlyCorrect'));
    if (isInvalid) throw new Error('adapt-contrib-slider - _feedback not removed from every instance of slider');
    return true;
  });

  updatePlugin('adapt-contrib-slider - update to v3.1.0', { name: 'adapt-contrib-slider', version: 'v3.1.0', framework: '>=5.19.1' });

  testSuccessWhere('non/configured slider component with course._globals', {
    fromPlugins: [{ name: 'adapt-contrib-slider', version: '2.3.0' }],
    content: [
      { _id: 'c-100', _component: 'slider', _feedback: { _partlyCorrect: {} } },
      { _id: 'c-105', _component: 'slider', _feedback: { _partlyCorrect: { final: 'final', notFinal: 'notFinal' } } },
      { _id: 'c-110', _component: 'slider', _feedback: {} },
      { _id: 'c-115', _component: 'slider' },
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

describe('adapt-contrib-slider - v3.1.0 > v3.2.0', async () => {
  let course, courseConfidenceSliderGlobals, sliders;
  const ariaCorrectAnswer = 'The correct answer is {{{correctAnswer}}}';
  const ariaCorrectAnswerRange = 'The correct answer is any value from {{{bottom}}} to {{{top}}}';
  const ariaUserAnswer = 'The answer you chose was {{{userAnswer}}}';

  whereFromPlugin('adapt-contrib-slider - from v3.2.0', { name: 'adapt-contrib-slider', version: '<3.2.0' });

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

  mutateContent('adapt-contrib-slider - add ariaCorrectAnswer to globals', async (content) => {
    courseConfidenceSliderGlobals.ariaCorrectAnswer = ariaCorrectAnswer;
    return true;
  });

  mutateContent('adapt-contrib-slider - add ariaCorrectAnswerRange to globals', async (content) => {
    courseConfidenceSliderGlobals.ariaCorrectAnswerRange = ariaCorrectAnswerRange;
    return true;
  });

  mutateContent('adapt-contrib-slider - add ariaUserAnswer to globals', async (content) => {
    courseConfidenceSliderGlobals.ariaUserAnswer = ariaUserAnswer;
    return true;
  });

  checkContent('adapt-contrib-slider - check globals ariaCorrectAnswer attribute', async (content) => {
    const isValid = courseConfidenceSliderGlobals.ariaCorrectAnswer === ariaCorrectAnswer;
    if (!isValid) throw new Error('adapt-contrib-slider - globals ariaCorrectAnswer attribute not added.');
    return true;
  });

  checkContent('adapt-contrib-slider - check globals ariaCorrectAnswerRange attribute', async (content) => {
    const isValid = courseConfidenceSliderGlobals.ariaCorrectAnswerRange === ariaCorrectAnswerRange;
    if (!isValid) throw new Error('adapt-contrib-slider - globals ariaCorrectAnswerRange attribute not added.');
    return true;
  });

  checkContent('adapt-contrib-slider - check globals ariaUserAnswer attribute', async (content) => {
    const isValid = courseConfidenceSliderGlobals.ariaUserAnswer === ariaUserAnswer;
    if (!isValid) throw new Error('adapt-contrib-slider - globals ariaUserAnswer attribute not added.');
    return true;
  });

  updatePlugin('adapt-contrib-slider - update to v3.2.0', { name: 'adapt-contrib-slider', version: '3.2.0', framework: '>=5.5.0' });

  testSuccessWhere('non/configured slider component with course._globals', {
    fromPlugins: [{ name: 'adapt-contrib-slider', version: '2.3.0' }],
    content: [
      { _id: 'c-100', _component: 'slider' },
      { _type: 'course', _globals: { _components: { _slider: {} } } }
    ]
  });

  testSuccessWhere('non/configured slider component empty course', {
    fromPlugins: [{ name: 'adapt-contrib-slider', version: '2.3.0' }],
    content: [
      { _id: 'c-100', _component: 'slider' },
      { _type: 'course' }
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
