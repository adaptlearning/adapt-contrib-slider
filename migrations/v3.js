import { describe, whereContent, whereFromPlugin, mutateContent, checkContent, updatePlugin } from 'adapt-migrations';
import _ from 'lodash';

describe('adapt-contrib-slider - v2.4.0 > v3.1.0-alpha.1', async () => {
  let sliders;

  whereFromPlugin('adapt-contrib-slider - from v2.4.0', { name: 'adapt-contrib-slider', version: '<3.1.0-alpha.1' });

  whereContent('adapt-contrib-slider - where slider', async content => {
    sliders = content.filter(({ _component }) => _component === 'slider');
    return sliders.length;
  });

  /**
   * * Remove JSON field
   */
  mutateContent('adapt-contrib-slider - remove slider._feedback._partlyCorrect', async () => {
    sliders.forEach(slider => {
      delete slider._feedback._partlyCorrect;
    });
    return true;
  });

  checkContent('adapt-contrib-slider - check slider._feedback._partlyCorrect', async () => {
    const isValid = sliders.every(({ _feedback }) => _feedback._partlyCorrect);
    if (!isValid) throw new Error('adapt-contrib-slider - _feedback not removed from every instance of slider');
    return true;
  });

  updatePlugin('adapt-contrib-slider - update to v3.1.0-alpha.1', { name: 'adapt-contrib-slider', version: 'v3.1.0-alpha.1', framework: '>=5.19.1' });
});

describe('adapt-contrib-slider - v3.1.0-alpha.1 > v3.2.0', async () => {
  let course, courseConfidenceSliderGlobals, sliders;

  whereFromPlugin('adapt-contrib-slider - from v3.2.0', { name: 'adapt-contrib-slider', version: '<3.2.0' });

  whereContent('adapt-contrib-slider - where slider', async content => {
    sliders = content.filter(({ _component }) => _component === 'slider');
    return sliders.length;
  });

  /**
   * * Add JSON field to globals and set attribute
   */
  mutateContent('adapt-contrib-slider - add ariaCorrectAnswer to globals', async (content) => {
    course = content.find(({ _type }) => _type === 'course');
    if (!_.has(course, '_globals._components._slider')) _.set(course, '_globals._components._slider', {});
    courseConfidenceSliderGlobals = course._globals._components._slider;

    courseConfidenceSliderGlobals.ariaCorrectAnswer = 'The correct answer is {{{correctAnswer}}}';

    return true;
  });

  checkContent('adapt-contrib-slider - check globals ariaCorrectAnswer attribute', async (content) => {
    const isValid = courseConfidenceSliderGlobals.ariaCorrectAnswer === 'The correct answer is {{{correctAnswer}}}';
    if (!isValid) throw new Error('adapt-contrib-slider - globals ariaCorrectAnswer attribute not added.');
    return true;
  });

  /**
   * * Add JSON field to globals and set attribute
   */
  mutateContent('adapt-contrib-slider - add ariaCorrectAnswerRange to globals', async (content) => {
    course = content.find(({ _type }) => _type === 'course');
    if (!_.has(course, '_globals._components._slider')) _.set(course, '_globals._components._slider', {});
    courseConfidenceSliderGlobals = course._globals._components._slider;

    courseConfidenceSliderGlobals.ariaCorrectAnswerRange = 'The correct answer is any value from {{{bottom}}} to {{{top}}}';

    return true;
  });

  checkContent('adapt-contrib-slider - check globals ariaCorrectAnswerRange attribute', async (content) => {
    const isValid = courseConfidenceSliderGlobals.ariaCorrectAnswerRange === 'The correct answer is any value from {{{bottom}}} to {{{top}}}';
    if (!isValid) throw new Error('adapt-contrib-slider - globals ariaCorrectAnswerRange attribute not added.');
    return true;
  });

  /**
   * * Add JSON field to globals and set attribute
   */
  mutateContent('adapt-contrib-slider - add ariaUserAnswer to globals', async (content) => {
    course = content.find(({ _type }) => _type === 'course');
    if (!_.has(course, '_globals._components._slider')) _.set(course, '_globals._components._slider', {});
    courseConfidenceSliderGlobals = course._globals._components._slider;

    courseConfidenceSliderGlobals.ariaUserAnswer = 'The answer you chose was {{{userAnswer}}}';

    return true;
  });

  checkContent('adapt-contrib-slider - check globals ariaUserAnswer attribute', async (content) => {
    const isValid = courseConfidenceSliderGlobals.ariaUserAnswer === 'The answer you chose was {{{userAnswer}}}';
    if (!isValid) throw new Error('adapt-contrib-slider - globals ariaUserAnswer attribute not added.');
    return true;
  });

  updatePlugin('adapt-contrib-slider - update to v3.2.0', { name: 'adapt-contrib-slider', version: '3.2.0', framework: '>=5.5.0' });
});
