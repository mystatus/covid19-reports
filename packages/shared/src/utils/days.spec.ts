import { expect } from 'chai';
import { binaryDaysToDateArray, DaysOfTheWeek, nextDay } from './days';

describe('days', () => {
  describe('binaryDaysToDateArray()', () => {
    it('expect to return 1st day of the week', () => {
      expect(binaryDaysToDateArray(DaysOfTheWeek.Sunday)).to.eql([1]);
    });
    it('expect to return 2nd day of the week', () => {
      expect(binaryDaysToDateArray(DaysOfTheWeek.Monday)).to.eql([2]);
    });
    it('expect to return 3rd day of the week', () => {
      expect(binaryDaysToDateArray(DaysOfTheWeek.Tuesday)).to.eql([3]);
    });
    it('expect to return 4th day of the week', () => {
      expect(binaryDaysToDateArray(DaysOfTheWeek.Wednesday)).to.eql([4]);
    });
    it('expect to return 5th day of the week', () => {
      expect(binaryDaysToDateArray(DaysOfTheWeek.Thursday)).to.eql([5]);
    });
    it('expect to return 6th day of the week', () => {
      expect(binaryDaysToDateArray(DaysOfTheWeek.Friday)).to.eql([6]);
    });
    it('expect to return 7th day of the week', () => {
      expect(binaryDaysToDateArray(DaysOfTheWeek.Saturday)).to.eql([7]);
    });
    it('expect to return 2nd and 7th day of the week', () => {
      // eslint-disable-next-line no-bitwise
      expect(binaryDaysToDateArray(DaysOfTheWeek.Saturday | DaysOfTheWeek.Monday)).to.eql([2, 7]);
    });
    it('expect to return all day of the week', () => {
      // eslint-disable-next-line no-bitwise
      expect(binaryDaysToDateArray(DaysOfTheWeek.Sunday | DaysOfTheWeek.Monday | DaysOfTheWeek.Tuesday | DaysOfTheWeek.Wednesday
      | DaysOfTheWeek.Thursday | DaysOfTheWeek.Friday | DaysOfTheWeek.Saturday)).to.eql([1, 2, 3, 4, 5, 6, 7]);
    });
    it('expect to return next day Sunday to Monday', () => {
      expect(binaryDaysToDateArray(nextDay(DaysOfTheWeek.Sunday))).to.eql([DaysOfTheWeek.Monday]);
    });
  });
});
