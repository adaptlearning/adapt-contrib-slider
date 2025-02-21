import { describe, whereContent, whereFromPlugin, mutateContent, checkContent, updatePlugin, getCourse, getComponents } from 'adapt-migrations';
import _ from 'lodash';

describe('adapt-contrib-slider - v2.0.0 > v2.0.1', async () => {
  let sliders;

  whereFromPlugin('adapt-contrib-slider - from v2.0.0', { name: 'adapt-contrib-slider', version: '<2.0.1' });

  whereContent('adapt-contrib-slider - where slider', async content => {
    sliders = getComponents('slider');
    return sliders.length;
  });

  /**
   * * Add JSON field to component and set attribute.
   */
  mutateContent('adapt-contrib-slider - add slider._showScale', async () => {
    sliders.forEach(slider => {
      slider._showScale = true;
    });
    return true;
  });

  checkContent('adapt-contrib-slider - check slider._showScale attribute', async () => {
    const isValid = sliders.some(({ _showScale }) => _showScale === true);
    if (!isValid) throw new Error('adapt-contrib-slider - _showScale not added to every instance of slider');
    return true;
  });

  /**
   * * Add JSON field to component and set attribute.
   */
  mutateContent('adapt-contrib-slider - add slider._recordInteraction', async () => {
    sliders.forEach(slider => {
      slider._recordInteraction = true;
    });
    return true;
  });

  checkContent('adapt-contrib-slider - check slider._recordInteraction attribute', async () => {
    const isValid = sliders.every(({ _recordInteraction }) => _recordInteraction === true);
    if (!isValid) throw new Error('adapt-contrib-slider - _recordInteraction not added to every instance of slider');
    return true;
  });

  updatePlugin('adapt-contrib-slider - update to v2.0.1', { name: 'adapt-contrib-slider', version: '2.0.1', framework: '>=2.0.0' });
});

describe('adapt-contrib-slider - v2.0.1 > v2.0.3', async () => {
  let sliders;

  whereFromPlugin('adapt-contrib-slider - from v2.0.1', { name: 'adapt-contrib-slider', version: '<2.0.3' });

  whereContent('adapt-contrib-slider - where slider', async content => {
    sliders = getComponents('slider');
    return sliders.length;
  });

  /**
   * * Modify attribute of existing JSON field.
   */
  mutateContent('adapt-contrib-slider - add slider._correctAnswer', async () => {
    sliders.forEach(slider => {
      if (slider._correctAnswer === 1) {
        slider._correctAnswer = '';
      }
    });
    return true;
  });

  checkContent('adapt-contrib-slider - check slider._correctAnswer attribute', async () => {
    const isValid = sliders.some(({ _correctAnswer }) => _correctAnswer !== undefined);
    if (!isValid) throw new Error('adapt-contrib-slider - _correctAnswer not added to every instance of slider');
    return true;
  });

  /**
   * * Modify attribute of existing JSON field.
   */
  mutateContent('adapt-contrib-slider - modify slider._correctRange._bottom', async () => {
    sliders.forEach(slider => {
      if (slider._correctRange._bottom === 1) {
        slider._correctRange._bottom = 0;
      }
    });
    return true;
  });

  checkContent('adapt-contrib-slider - check slider._correctRange._bottom attribute', async () => {
    const isValid = sliders.every(({ _correctRange }) => _correctRange._bottom !== undefined);
    if (!isValid) throw new Error('adapt-contrib-slider - _correctRange._bottom not modified in every instance of slider');
    return true;
  });

  /**
   * * Modify attribute of existing JSON field.
   */
  mutateContent('adapt-contrib-slider - modify slider._correctRange._top', async () => {
    sliders.forEach(slider => {
      if (slider._correctRange._top === 1) {
        slider._correctRange._top = 0;
      }
    });
    return true;
  });

  checkContent('adapt-contrib-slider - check slider._correctRange._top attribute', async () => {
    const isValid = sliders.every(({ _correctRange }) => _correctRange._top !== undefined);
    if (!isValid) throw new Error('adapt-contrib-slider - _correctRange._top not modified in every instance of slider');
    return true;
  });

  updatePlugin('adapt-contrib-slider - update to v2.0.3', { name: 'adapt-contrib-slider', version: '2.0.3', framework: '>=2.0.0' });
});

describe('adapt-contrib-slider - v2.0.3 > v2.0.4', async () => {
  let sliders;

  whereFromPlugin('adapt-contrib-slider - from v2.0.3', { name: 'adapt-contrib-slider', version: '<2.0.4' });

  whereContent('adapt-contrib-slider - where slider', async content => {
    sliders = getComponents('slider');
    return sliders.length;
  });

  /**
   * * Add JSON field to component and set attribute.
   */
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
});

describe('adapt-contrib-slider - v2.0.4 > v2.1.0', async () => {
  let sliders;

  whereFromPlugin('adapt-contrib-slider - from v2.0.3', { name: 'adapt-contrib-slider', version: '<2.0.4' });

  whereContent('adapt-contrib-slider - where slider', async content => {
    sliders = getComponents('slider');
    return sliders.length;
  });

  /**
   * * Add JSON field to component and set attribute.
   */
  mutateContent('adapt-contrib-slider - add slider._scaleStep', async () => {
    sliders.forEach(slider => {
      slider._scaleStep = 1;
    });
    return true;
  });

  checkContent('adapt-contrib-slider - check slider._scaleStep attribute', async () => {
    const isValid = sliders.every(({ _scaleStep }) => _scaleStep === 1);
    if (!isValid) throw new Error('adapt-contrib-slider - _scaleStep not added to every instance of slider');
    return true;
  });

  /**
   * * Add JSON field to component and set attribute.
   */
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

  updatePlugin('adapt-contrib-slider - update to v2.1.0', { name: 'adapt-contrib-slider', version: '2.1.0', framework: '>=2.0.0' });
});

describe('adapt-contrib-slider - v2.1.0 > v2.1.1', async () => {
  let sliders;

  whereFromPlugin('adapt-contrib-slider - from v2.1.1', { name: 'adapt-contrib-slider', version: '<2.1.1' });

  whereContent('adapt-contrib-slider - where slider', async content => {
    sliders = getComponents('slider');
    return sliders.length;
  });

  /**
   * * Add JSON field to component and set attribute.
   */
  mutateContent('adapt-contrib-slider - add slider._scaleStep', async () => {
    sliders.forEach(slider => {
      slider._scaleStep = 1;
    });
    return true;
  });

  checkContent('adapt-contrib-slider - check slider._scaleStep attribute', async () => {
    const isValid = sliders.every(({ _scaleStep }) => _scaleStep === 1);
    if (!isValid) throw new Error('adapt-contrib-slider - _scaleStep not added to every instance of slider');
    return true;
  });

  /**
   * * Add JSON field to component and set attribute.
   */
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

  /**
   * * Add JSON field to component and set attribute.
   */
  mutateContent('adapt-contrib-slider - add slider._canShowMarking', async () => {
    sliders.forEach(slider => {
      slider._canShowMarking = true;
    });
    return true;
  });

  checkContent('adapt-contrib-slider - check slider._canShowMarking attribute', async () => {
    const isValid = sliders.every(({ _canShowMarking }) => _canShowMarking === true);
    if (!isValid) throw new Error('adapt-contrib-slider - _canShowMarking not added to every instance of slider');
    return true;
  });

  updatePlugin('adapt-contrib-slider - update to v2.1.1', { name: 'adapt-contrib-slider', version: '2.1.1', framework: '>=2.0.11' });
});

describe('adapt-contrib-slider - v2.1.1 > v2.1.5', async () => {
  let sliders;

  whereFromPlugin('adapt-contrib-slider - from v2.1.1', { name: 'adapt-contrib-slider', version: '<2.1.5' });

  whereContent('adapt-contrib-slider - where slider', async content => {
    sliders = getComponents('slider');
    return sliders.length;
  });

  /**
   * * Add JSON field to component and set attribute.
   */
  mutateContent('adapt-contrib-slider - remove slider._feedback', async () => {
    sliders.forEach(slider => {
      delete slider._feedback;
    });
    return true;
  });

  checkContent('adapt-contrib-slider - check slider._feedback attribute', async () => {
    const isValid = sliders.some(({ _feedback }) => _feedback);
    if (!isValid) throw new Error('adapt-contrib-slider - _feedback not removed from every instance of slider');
    return true;
  });

  /**
   * * Add JSON field to component and set attribute.
   */
  mutateContent('adapt-contrib-slider - add slider._feedback._correct', async () => {
    sliders.forEach(slider => {
      slider._feedback._correct = '';
    });
    return true;
  });

  checkContent('adapt-contrib-slider - check slider._feedback._correct attribute', async () => {
    const isValid = sliders.every(({ _feedback }) => _feedback._correct !== undefined);
    if (!isValid) throw new Error('adapt-contrib-slider - _feedback._correct not added to every instance of slider');
    return true;
  });

  /**
   * * Add JSON field to component and set attribute.
   */
  mutateContent('adapt-contrib-slider - add slider._feedback._incorrect.final', async () => {
    sliders.forEach(slider => {
      slider._feedback._incorrect.final = '';
    });
    return true;
  });

  checkContent('adapt-contrib-slider - check slider._feedback._incorrect.final attribute', async () => {
    const isValid = sliders.every(({ _feedback }) => _feedback && _feedback._incorrect && _feedback._incorrect.final !== undefined);
    if (!isValid) throw new Error('adapt-contrib-slider - _feedback._incorrect.final not added to every instance of slider');
    return true;
  });

  /**
   * * Add JSON field to component and set attribute.
   */
  mutateContent('adapt-contrib-slider - add slider._feedback._incorrect.notFinal', async () => {
    sliders.forEach(slider => {
      slider._feedback._incorrect.notFinal = '';
    });
    return true;
  });

  checkContent('adapt-contrib-slider - check slider._feedback._incorrect.notFinal attribute', async () => {
    const isValid = sliders.every(({ _feedback }) => _feedback._incorrect.notFinal !== undefined);
    if (!isValid) throw new Error('adapt-contrib-slider - _feedback._incorrect.notFinal not added to every instance of slider');
    return true;
  });

  /**
   * * Add JSON field to component and set attribute.
   */
  mutateContent('adapt-contrib-slider - add slider._feedback._partlyCorrect.final', async () => {
    sliders.forEach(slider => {
      slider._feedback._partlyCorrect.final = '';
    });
    return true;
  });

  checkContent('adapt-contrib-slider - check slider._feedback._partlyCorrect.final attribute', async () => {
    const isValid = sliders.every(({ _feedback }) => _feedback._partlyCorrect.final !== undefined);
    if (!isValid) throw new Error('adapt-contrib-slider - _feedback._partlyCorrect.final not added to every instance of slider');
    return true;
  });

  /**
   * * Add JSON field to component and set attribute.
   */
  mutateContent('adapt-contrib-slider - add slider._feedback._partlyCorrect.notFinal', async () => {
    sliders.forEach(slider => {
      slider._feedback._partlyCorrect.notFinal = '';
    });
    return true;
  });

  checkContent('adapt-contrib-slider - check slider._feedback._partlyCorrect.notFinal attribute', async () => {
    const isValid = sliders.every(({ _feedback }) => _feedback._partlyCorrect.notFinal !== undefined);
    if (!isValid) throw new Error('adapt-contrib-slider - _feedback._partlyCorrect.notFinal not added to every instance of slider');
    return true;
  });

  /**
   * * Add JSON field to component and set attribute.
   */
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
});

describe('adapt-contrib-slider - v2.1.5 > v2.3.0', async () => {
  let sliders;

  whereFromPlugin('adapt-contrib-slider - from v2.1.5', { name: 'adapt-contrib-slider', version: '<2.3.0' });

  whereContent('adapt-contrib-slider - where slider', async content => {
    sliders = getComponents('slider');
    return sliders.length;
  });

  /**
   * * Add JSON field to component and set attribute.
   */
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
});

describe('adapt-contrib-slider - v2.3.0 > v2.4.0', async () => {
  let course, courseConfidenceSliderGlobals, sliders;

  whereFromPlugin('adapt-contrib-slider - from v2.3.0', { name: 'adapt-contrib-slider', version: '<2.4.0' });

  whereContent('adapt-contrib-slider - where slider', async content => {
    sliders = getComponents('slider');
    return sliders.length;
  });

  /**
   * * Add JSON field to component and set attribute.
   */
  mutateContent('adapt-contrib-slider - add slider.labelStart', async (content) => {
    course = getCourse();
    if (!_.has(course, '_globals._components._slider')) _.set(course, '_globals._components._slider', {});
    courseConfidenceSliderGlobals = course._globals._components._slider;

    courseConfidenceSliderGlobals.labelStart = 'Start of the scale';

    return true;
  });

  checkContent('adapt-contrib-slider - check globals labelStart attribute', async (content) => {
    const isValid = courseConfidenceSliderGlobals.labelStart === 'Start of the scale';
    if (!isValid) throw new Error('adapt-contrib-slider - globals labelStart attribute not added.');
    return true;
  });

  /**
   * * Add JSON field to component and set attribute.
   */
  mutateContent('adapt-contrib-slider - add slider.labelEnd', async (content) => {
    course = getCourse();
    if (!_.has(course, '_globals._components._slider')) _.set(course, '_globals._components._slider', {});
    courseConfidenceSliderGlobals = course._globals._components._slider;

    courseConfidenceSliderGlobals.labelEnd = 'End of the scale';

    return true;
  });

  checkContent('adapt-contrib-slider - check globals labelEnd attribute', async (content) => {
    const isValid = courseConfidenceSliderGlobals.labelEnd === 'End of the scale';
    if (!isValid) throw new Error('adapt-contrib-slider - globals labelEnd attribute not added.');
    return true;
  });

  updatePlugin('adapt-contrib-slider - update to v2.4.0', { name: 'adapt-contrib-slider', version: '2.4.0', framework: '>=2.0.16' });
});
