import {expect} from 'chai';
import {daysToString, DaysOfTheWeek} from './muster.days';


describe('daysToString()', () => {
  it('expect to return 1st day of the week', () => {
    expect(daysToString(DaysOfTheWeek.Sunday)).to.eql([1]);
  });
  it('expect to return 2nd day of the week', () => {
    expect(daysToString(DaysOfTheWeek.Monday)).to.eql([2]);
  });
  it('expect to return 3rd day of the week', () => {
    expect(daysToString(DaysOfTheWeek.Tuesday)).to.eql([3]);
  });
  it('expect to return 4th day of the week', () => {
    expect(daysToString(DaysOfTheWeek.Wednesday)).to.eql([4]);
  });
  it('expect to return 5th day of the week', () => {
    expect(daysToString(DaysOfTheWeek.Thursday)).to.eql([5]);
  });
  it('expect to return 6th day of the week', () => {
    expect(daysToString(DaysOfTheWeek.Friday)).to.eql([6]);
  });
  it('expect to return 7th day of the week', () => {
    expect(daysToString(DaysOfTheWeek.Saturday)).to.eql([7]);
  });
  it('expect to return 2nd and 7th day of the week', () => {
    // eslint-disable-next-line no-bitwise
    expect(daysToString(DaysOfTheWeek.Saturday | DaysOfTheWeek.Monday)).to.eql([2, 7]);
  });
  it('expect to return all day of the week', () => {
    // eslint-disable-next-line no-bitwise
    expect(daysToString(DaysOfTheWeek.Sunday | DaysOfTheWeek.Monday | DaysOfTheWeek.Tuesday | DaysOfTheWeek.Wednesday
      | DaysOfTheWeek.Thursday | DaysOfTheWeek.Friday | DaysOfTheWeek.Saturday)).to.eql([1, 2, 3, 4, 5, 6, 7]);
  });
});

