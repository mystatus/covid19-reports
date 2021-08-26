import { expect } from 'chai';
import {
  validateMathematicExpression,
  validateTimeExpression,
  ValidatedExpression,
} from './expression-utils';

describe('expression-utils', () => {
  describe('validateMathematicExpression()', () => {
    it('should only allow numbers and mathematic symbols and indicate if bad input was passed', () => {
      const exp: ValidatedExpression = validateMathematicExpression('XX * 99');
      expect(exp.inputValid).false;
      expect(exp.isValid).false;
      expect(exp.value).empty;
    });

    it('should perform the expected operations if the expression is valid', () => {
      const exp: ValidatedExpression = validateMathematicExpression('5 * 1 - 5 / 1 - 1');
      expect(exp.inputValid).true;
      expect(exp.isValid).true;
      expect(exp.value).equal(5 * 1 - 5 / 1 - 1);
    });

    it('should support negative numbers', () => {
      const exp: ValidatedExpression = validateMathematicExpression('-5 * 5');
      expect(exp.inputValid).true;
      expect(exp.isValid).true;
      expect(exp.value).equal(-5 * 5);
    });

    it('should support decimal numbers', () => {
      const exp: ValidatedExpression = validateMathematicExpression('-5.555 * 5.555');
      expect(exp.inputValid).true;
      expect(exp.isValid).true;
      expect(exp.value).equal(-5.555 * 5.555);
    });
  });

  describe('validateTimeExpression()', () => {
    it('should not allow empty input', () => {
      const exp: ValidatedExpression = validateTimeExpression('');
      expect(exp.inputValid).false;
      expect(exp.isValid).false;
      expect(exp.value).empty;
    });

    it('should not validate if input is not JSON format', () => {
      const exp: ValidatedExpression = validateTimeExpression('bad input');
      expect(exp.inputValid).true;
      expect(exp.isValid).false;
      expect(exp.value).empty;
    });

    it('should default to returning today\'s date at midnight if JSON is not momentJS format', () => {
      const exp: ValidatedExpression = validateTimeExpression('{"fubar": 10}');
      const todayAtMidnightGMT = new Date();
      todayAtMidnightGMT.setHours(0, 0, 0, 0);
      expect(exp.inputValid).true;
      expect(exp.isValid).true;
      expect(exp.value).equal(todayAtMidnightGMT.toISOString());
    });

    it('should return correct time-offset if expression is valid', () => {
      const exp: ValidatedExpression = validateTimeExpression('{ "day": 1, "h": 12, "m": 30, "s": 30 }');
      const today = new Date();
      const tomorrowAtNoonThirtyThirty = new Date(today);
      tomorrowAtNoonThirtyThirty.setDate(today.getDate() + 1);
      tomorrowAtNoonThirtyThirty.setHours(12, 30, 30, 0);
      expect(exp.inputValid).true;
      expect(exp.isValid).true;
      expect(exp.value).equal(tomorrowAtNoonThirtyThirty.toISOString());
    });
  });
});
