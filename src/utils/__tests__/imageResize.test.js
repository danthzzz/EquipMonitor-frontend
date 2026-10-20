import { fitWithin } from '../imageResize';

describe('fitWithin', () => {
  it('shrinks landscape photos to 1600 px wide', () => {
    expect(fitWithin(4000, 3000)).toEqual({ width: 1600, height: 1200 });
  });

  it('shrinks portrait photos to 1600 px tall', () => {
    expect(fitWithin(3000, 4000)).toEqual({ width: 1200, height: 1600 });
  });

  it('never upscales small photos', () => {
    expect(fitWithin(1200, 900)).toEqual({ width: 1200, height: 900 });
  });

  it('rounds to whole pixels', () => {
    expect(fitWithin(4032, 3024)).toEqual({ width: 1600, height: 1200 });
    expect(fitWithin(1601, 1000, 1600)).toEqual({ width: 1600, height: 999 });
  });
});
