import {expect} from 'chai';
import { binaryDaysToDateArray, DaysOfTheWeek, nextDay, daysToString, dayIsIn } from './days';

describe('days', () => {
  describe('daysToString()', () => {
    it('expect to return Sun', () => {
      expect(daysToString(DaysOfTheWeek.Sunday)).to.eql('Sun');
    });
    it('expect to return Mon', () => {
      expect(daysToString(DaysOfTheWeek.Monday)).to.eql('Mon');
    });
    it('expect to return Tue', () => {
      expect(daysToString(DaysOfTheWeek.Tuesday)).to.eql('Tue');
    });
    it('expect to return Wed', () => {
      expect(daysToString(DaysOfTheWeek.Wednesday)).to.eql('Wed');
    });
    it('expect to return Thu', () => {
      expect(daysToString(DaysOfTheWeek.Thursday)).to.eql('Thu');
    });
    it('expect to return Fri', () => {
      expect(daysToString(DaysOfTheWeek.Friday)).to.eql('Fri');
    });
    it('expect to return Sat', () => {
      expect(daysToString(DaysOfTheWeek.Saturday)).to.eql('Sat');
    });
    it('expect to return Every day', () => {
      expect(daysToString(DaysOfTheWeek.Monday | DaysOfTheWeek.Sunday | DaysOfTheWeek.Tuesday | DaysOfTheWeek.Wednesday 
      | DaysOfTheWeek.Thursday | DaysOfTheWeek.Friday | DaysOfTheWeek.Saturday)).to.eql('Every day');
    });
    it('expect to return Every weekday', () => {
      expect(daysToString(DaysOfTheWeek.Monday | DaysOfTheWeek.Tuesday | DaysOfTheWeek.Wednesday 
      | DaysOfTheWeek.Thursday | DaysOfTheWeek.Friday)).to.eql('Every weekday');
    });
  });
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
  });
  describe('dayIsIn()', () => {
    it('expect to return true', () => {
      expect(dayIsIn(DaysOfTheWeek.Friday, DaysOfTheWeek.Sunday | DaysOfTheWeek.Monday | DaysOfTheWeek.Friday)).to.eql(true)
    });
  });
  describe('nextDay()', () => {
    it('expect to return next day Sunday to Monday', () => {
      expect(binaryDaysToDateArray(nextDay(DaysOfTheWeek.Sunday))).to.eql([DaysOfTheWeek.Monday]);
    });
  });
});