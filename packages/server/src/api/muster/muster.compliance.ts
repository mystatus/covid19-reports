import { Moment } from 'moment-timezone';
import { MusteringOpportunities, MusterWindowWithStartAndEndDate } from './mustering.opportunities';
import { RecordedObservations, RecordedObservationTimestamp } from '../observation/observation.utils';
import { RosterEntry } from '../../util/roster-utils';

/**
 * The <strong><code>calculateMusterCompliance()</code></strong> function <strong>calculates muster compliance for all
 * individuals on <code>Roster</code> using provided recorded observations which are compared with mustering opportunities
 * in order to perform these calculations</strong>.
 * @param rosterIndividualsInformation The roster information for a set of individuals
 * @param recordedObservations The observations recorded for a set of individuals
 * @param musteringOpportunities The required mustering opportunities, mustering time windows
 */
export function calculateMusterCompliance(observations: RecordedObservations[], musteringOpportunities: MusteringOpportunities, rosterForMusterCompliance: RosterEntry[]): MusterCompliance[] {
  return rosterForMusterCompliance.map(roster => {
    const edipi = roster.edipi;
    const unitId = roster.unitId;
    const unitMusteringOpportunities = musteringOpportunities[unitId];

    // mustering is not required
    if (!unitMusteringOpportunities || unitMusteringOpportunities.length === 0) {
      return { totalMusters: 0, mustersReported: 0, musterPercent: 100, ...roster };
    }

    const totalMusters = unitMusteringOpportunities.length;

    const edipiObservations = filterObservationsByEdipi(observations, edipi);
    const mustersReported = calculateIndividualMusterCompliance(edipiObservations, unitMusteringOpportunities);
    const musterPercent = calculatePercentageRounded(mustersReported, totalMusters);

    return { totalMusters, mustersReported, musterPercent, ...roster };
  });
}

function calculateIndividualMusterCompliance(observations: RecordedObservationTimestamp[], musteringOpportunities: MusterWindowWithStartAndEndDate[]): number {
  let compliance = 0;
  musteringOpportunities.forEach(musteringOpportunity => {
    compliance += calculateCompliance(observations, musteringOpportunity.startMusterDate, musteringOpportunity.endMusterDate);
  });
  return compliance;
}

function filterObservationsByEdipi(observations: RecordedObservations[], edipi: string): RecordedObservationTimestamp[] {
  return observations
    .filter(observation => observation.edipi === edipi)
    .map(observation => { return { timestamp: observation.timestamp }; });
}

function calculateCompliance(observationTimestamps: RecordedObservationTimestamp[], startMusterDate: Moment, endMusterDate: Moment): number {
  let compliance = 0;

  for (const obTs of observationTimestamps) {
    const epochTimestamp = obTs.timestamp.getTime();
    if (epochTimestamp >= startMusterDate.valueOf() && epochTimestamp <= endMusterDate.valueOf()) {
      compliance = 1;
      break;
    }
  }

  return compliance;
}

function calculatePercentageRounded(mustersReported: number, totalMusters: number) {
  const musterPercent = (100 * mustersReported) / totalMusters;
  return Math.round(10 * musterPercent) / 10;
}

/**
 * Represents muster compliance for an individual
 */
export type MusterCompliance = {
  totalMusters: number;
  mustersReported: number;
  musterPercent: number;
} & RosterEntry;

