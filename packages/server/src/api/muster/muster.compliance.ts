import { Roster } from '../roster/roster.model';
import { MusteringOpportunities } from './mustering.opportunities';
import { RecordedObservations } from '../observation/observation.utils';

/**
 * The <strong><code>toMusterCompliance()</code></strong> function <strong>calculates muster compliance for all
 * individuals on <code>Roster</code> using provided recorded observations which are compared with mustering opportunities
 * in order to perform these calculations</strong>.
 * @param rosterIndividualsInformation The roster information for a set of individuals
 * @param recordedObservations The observations recorded for a set of individuals
 * @param musteringOpportunities The required mustering opportunities, mustering time windows
 */
export function toMusterCompliance(
  rosterIndividualsInformation: Roster[],
  recordedObservations: RecordedObservations[],
  musteringOpportunities: MusteringOpportunities,
): MusterCompliance[] {
  const musterIntermediateCompliance = toMusterIntermediateCompliance(rosterIndividualsInformation);
  return calculateMusterCompliance(recordedObservations, musteringOpportunities, musterIntermediateCompliance);
}

/**
 * The <strong><code>toMusterIntermediateCompliance()</code></strong> function <strong>converts an array of
 * <code>Roster</code> data into an intermediate muster compliance array structure</strong>.
 * The intermediate muster compliance array contains only existing data elements from the <strong><code>Roster</code></strong>
 * data without any compliance calculations.
 *
 * @param rosters The array of <code>Roster</code> data
 */
export function toMusterIntermediateCompliance(rosters: Roster[]): IntermediateMusterCompliance[] {
  return rosters.map(roster => {
    return {
      edipi: roster.edipi,
      firstName: roster.firstName,
      lastName: roster.lastName,
      // This filed is to be implemented as part of a different task
      myCustomColumn1: 'tbd',
      unitId: roster.unit.id,
      phone: roster.phoneNumber,
    };
  });
}

/**
 * TBD later....
 * @param observations
 * @param musterTimeView
 * @param musterComplianceReport
 */
export function calculateMusterCompliance(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  observations: RecordedObservations[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  musterTimeView: MusteringOpportunities,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  musterComplianceReport: IntermediateMusterCompliance[],
): MusterCompliance[] {
  // this is to be implemented as part of a different task
  return [];
}

/**
 * Represents muster compliance for an individual
 */
export type MusterCompliance = {
  totalMusters: number;
  mustersReported: number;
  musterPercent: number;
} & IntermediateMusterCompliance;

/**
 * Represents muster compliance without any compliance calculations
 */
type IntermediateMusterCompliance = {
  edipi: string;
  firstName: string;
  lastName: string;
  myCustomColumn1: string;
  unitId: number;
  phone?: string;
};
